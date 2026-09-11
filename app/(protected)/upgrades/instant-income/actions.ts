"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"

interface Template {
  id: string
  title: string
  category: string
  content: string
  avgEarnings: string
  author: string
  bestFor: string
}

export async function createPageFromTemplate(_userId: string, template: Template, affiliateLink: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    if (!isValidAffiliateUrl(affiliateLink)) {
      return { success: false, error: "Use a full link that starts with https://" }
    }

    let { data: niche } = await supabase.from("niches").select("id").limit(1).single()

    if (!niche) {
      const { data: newNiche, error: nicheError } = await supabase
        .from("niches")
        .insert({ name: "General", description: "General niche" })
        .select("id")
        .single()

      if (nicheError) throw nicheError
      niche = newNiche
    }

    let { data: offer } = await supabase.from("offers").select("id").limit(1).single()

    if (!offer) {
      const { data: newOffer, error: offerError } = await supabase
        .from("offers")
        .insert({
          name: "Default Offer",
          description: "Default offer",
          niche_id: niche.id,
          commission_rate: 50,
        })
        .select("id")
        .single()

      if (offerError) throw offerError
      offer = newOffer
    }

    const finalContent = sanitizeArticleHtml(
      template.content.replace(/\[INSERT YOUR AFFILIATE LINK HERE\]/g, affiliateLink),
    )

    const { data: page, error: pageError } = await supabase
      .from("pages")
      .insert({
        user_id: user.id,
        niche_id: niche.id,
        offer_id: offer.id,
        title: template.title,
        content: finalContent,
        affiliate_link: affiliateLink,
        status: "active",
      })
      .select()
      .single()

    if (pageError) throw pageError

    revalidatePath("/pages")
    revalidatePath("/dashboard")

    return { success: true, page }
  } catch (error: unknown) {
    console.error("Error creating page:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create page" }
  }
}
