"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"

export async function createPageFromTemplate({
  title,
  content,
  affiliateLink,
}: {
  title: string
  content: string
  affiliateLink: string
}) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    if (!isValidAffiliateUrl(affiliateLink)) {
      return { success: false, error: "Use a full link that starts with https://" }
    }

    let nicheId: string | null = null

    const { data: existingNiche } = await supabase.from("niches").select("id").limit(1).single()

    if (existingNiche) {
      nicheId = existingNiche.id
    } else {
      // Create a default niche if none exists
      const { data: newNiche, error: createNicheError } = await supabase
        .from("niches")
        .insert({
          name: "General",
          description: "General niche for all content",
          icon: "📄",
        })
        .select("id")
        .single()

      if (createNicheError) {
        console.error("[v0] Error creating default niche:", createNicheError)
        return { success: false, error: "Could not create default niche" }
      }

      nicheId = newNiche.id
    }

    let offerId: string | null = null

    const { data: existingOffer } = await supabase.from("offers").select("id").limit(1).single()

    if (existingOffer) {
      offerId = existingOffer.id
    } else {
      // Create a default offer if none exists
      const { data: newOffer, error: createOfferError } = await supabase
        .from("offers")
        .insert({
          title: "Default Offer",
          description: "Default affiliate offer",
          commission_rate: "50%",
          niche_id: nicheId,
          affiliate_network: "General",
        })
        .select("id")
        .single()

      if (createOfferError) {
        console.error("[v0] Error creating default offer:", createOfferError)
        return { success: false, error: "Could not create default offer" }
      }

      offerId = newOffer.id
    }

    // Create the page
    const { data, error } = await supabase
      .from("pages")
      .insert({
        user_id: user.id,
        niche_id: nicheId,
        offer_id: offerId,
        title,
        content: sanitizeArticleHtml(content),
        affiliate_link: affiliateLink,
        status: "active",
        views: 0,
        clicks: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating page:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the pages list
    revalidatePath("/pages")

    return { success: true, pageId: data.id }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
