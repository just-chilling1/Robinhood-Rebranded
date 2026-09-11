"use server"

import { revalidatePath } from "next/cache"

import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { createClient } from "@/lib/supabase/server"

export type AffiliateLink = {
  id: string
  offer_name: string
  affiliate_url: string
  niche: string | null
  notes: string | null
  created_at: string
}

export type AffiliateLinkInput = {
  offerName: string
  affiliateUrl: string
  niche?: string
  notes?: string
}

type ActionOk<T> = { success: true } & T
type ActionFail = { success: false; error: string }
type ActionResult<T extends object = object> = ActionOk<T> | ActionFail
type ParsedInput = { ok: true; value: AffiliateLinkInput } | { ok: false; error: string }

function blankToNull(value?: string | null) {
  const trimmed = value?.trim() ?? ""
  return trimmed.length > 0 ? trimmed : null
}

function parseInput(input: AffiliateLinkInput): ParsedInput {
  const offerName = input.offerName.trim()
  const affiliateUrl = input.affiliateUrl.trim()
  const niche = blankToNull(input.niche) ?? undefined
  const notes = blankToNull(input.notes) ?? undefined

  if (!offerName) {
    return { ok: false, error: "Add the name of the product or offer." }
  }
  if (!affiliateUrl) {
    return { ok: false, error: "Paste your affiliate link." }
  }
  if (!isValidAffiliateUrl(affiliateUrl)) {
    return { ok: false, error: "Use a full link that starts with https://" }
  }

  return { ok: true, value: { offerName, affiliateUrl, niche, notes } }
}

function mapRow(row: {
  id: string
  offer_name: string
  affiliate_url: string
  niche: string | null
  notes: string | null
  created_at: string
}): AffiliateLink {
  return {
    id: row.id,
    offer_name: row.offer_name,
    affiliate_url: row.affiliate_url,
    niche: row.niche,
    notes: row.notes,
    created_at: row.created_at,
  }
}

function missingTableError(message: string) {
  return /affiliate_links|schema cache|does not exist|42P01/i.test(message)
}

const MISSING_TABLE_MESSAGE =
  "Link Vault isn’t set up on this database yet. Run scripts/010_create_affiliate_links.sql in the Supabase SQL editor."

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null as null, error: "Not authenticated" }
  }

  return { supabase, user, error: null as null }
}

function revalidateVault() {
  revalidatePath("/share")
  revalidatePath("/create")
}

export async function listAffiliateLinks(): Promise<ActionResult<{ links: AffiliateLink[] }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const { data, error: queryError } = await supabase
      .from("affiliate_links")
      .select("id, offer_name, affiliate_url, niche, notes, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (queryError) {
      if (missingTableError(queryError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[affiliate-links] list failed:", queryError.message, queryError.code, queryError.details)
      return { success: false, error: "Couldn’t load your links. Please try again." }
    }

    return { success: true, links: (data ?? []).map(mapRow) }
  } catch (error) {
    console.error("[affiliate-links] list error:", error)
    return { success: false, error: "Couldn’t load your links. Please try again." }
  }
}

export async function createAffiliateLink(
  input: AffiliateLinkInput,
): Promise<ActionResult<{ link: AffiliateLink }>> {
  try {
    const parsed = parseInput(input)
    if (!parsed.ok) return { success: false, error: parsed.error }

    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const { data, error: insertError } = await supabase
      .from("affiliate_links")
      .insert({
        user_id: user.id,
        offer_name: parsed.value.offerName,
        affiliate_url: parsed.value.affiliateUrl,
        niche: parsed.value.niche ?? null,
        notes: parsed.value.notes ?? null,
      })
      .select("id, offer_name, affiliate_url, niche, notes, created_at")
      .single()

    if (insertError || !data) {
      if (insertError && missingTableError(insertError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[affiliate-links] create failed:", insertError?.message, insertError?.code, insertError?.details)
      return { success: false, error: "Couldn’t save this link. Please try again." }
    }

    revalidateVault()
    return { success: true, link: mapRow(data) }
  } catch (error) {
    console.error("[affiliate-links] create error:", error)
    return { success: false, error: "Couldn’t save this link. Please try again." }
  }
}

export async function updateAffiliateLink(
  id: string,
  input: AffiliateLinkInput,
): Promise<ActionResult<{ link: AffiliateLink }>> {
  try {
    if (!id) return { success: false, error: "Missing link." }

    const parsed = parseInput(input)
    if (!parsed.ok) return { success: false, error: parsed.error }

    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const { data, error: updateError } = await supabase
      .from("affiliate_links")
      .update({
        offer_name: parsed.value.offerName,
        affiliate_url: parsed.value.affiliateUrl,
        niche: parsed.value.niche ?? null,
        notes: parsed.value.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, offer_name, affiliate_url, niche, notes, created_at")
      .single()

    if (updateError || !data) {
      console.error("[affiliate-links] update failed:", updateError)
      return { success: false, error: "Couldn’t update this link. Please try again." }
    }

    revalidateVault()
    return { success: true, link: mapRow(data) }
  } catch (error) {
    console.error("[affiliate-links] update error:", error)
    return { success: false, error: "Couldn’t update this link. Please try again." }
  }
}

export async function deleteAffiliateLink(id: string): Promise<ActionResult> {
  try {
    if (!id) return { success: false, error: "Missing link." }

    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const { error: deleteError } = await supabase
      .from("affiliate_links")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("[affiliate-links] delete failed:", deleteError)
      return { success: false, error: "Couldn’t delete this link. Please try again." }
    }

    revalidateVault()
    return { success: true }
  } catch (error) {
    console.error("[affiliate-links] delete error:", error)
    return { success: false, error: "Couldn’t delete this link. Please try again." }
  }
}
