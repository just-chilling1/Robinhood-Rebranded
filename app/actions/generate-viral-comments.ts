"use server"

import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { generateVideoComments } from "@/lib/dfy-profit/generate-video-comments"

interface GenerateViralCommentsInput {
  videoId: string
  videoTitle: string
  channelTitle: string
  productName: string
  productDescription: string
  affiliateLink: string
  nicheId?: string
}

export default async function generateViralCommentsAction(input: GenerateViralCommentsInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !isDevAuthBypassEnabled()) {
      return { success: false, error: "Not authenticated" }
    }

    console.log("[rh] Generating comments for:", input.videoTitle.substring(0, 60) + "...")
    console.log("[rh] Product:", input.productDescription.substring(0, 60) + "...")

    const { comments } = await generateVideoComments(input)

    console.log("[rh] Successfully generated", comments.length, "comments")
    console.log("[rh] Comments preview:", comments[0]?.substring(0, 50) + "...")

    // Only skip saving when there's no real session (anonymous dev-bypass testing).
    // A logged-in user should always get their pack saved to the vault, even in dev.
    if (!user) {
      return {
        success: true,
        comments,
        videoUrl: `https://youtube.com/watch?v=${input.videoId}`,
      }
    }

    // Create the comment pack
    const packData = {
      version: 1,
      videoId: input.videoId,
      videoUrl: `https://youtube.com/watch?v=${input.videoId}`,
      videoTitle: input.videoTitle,
      channelTitle: input.channelTitle,
      productName: input.productName,
      createdAt: new Date().toISOString(),
      comments: comments
    }

    const packTitle = `${input.productName} - ${input.videoTitle.substring(0, 50)}`

    // Get or create a "General" niche as fallback (since niche_id might be required by DB)
    let nicheId = input.nicheId
    if (!nicheId) {
      const { data: generalNiche } = await supabase
        .from("niches")
        .select("id")
        .limit(1)
        .single()
      nicheId = generalNiche?.id || null
    }

    const { data: page, error: pageError } = await supabase
      .from("pages")
      .insert({
        user_id: user.id,
        niche_id: nicheId,
        offer_id: null,
        offer_name: input.productName,
        title: packTitle,
        content: JSON.stringify(packData),
        affiliate_link: input.affiliateLink,
        video_id: input.videoId,
        video_title: input.videoTitle,
        video_url: `https://youtube.com/watch?v=${input.videoId}`,
        channel_title: input.channelTitle,
        status: "active",
        views: 0,
        clicks: 0,
      })
      .select()
      .single()

    if (pageError) {
      console.error("[rh] Error saving pack:", pageError)
      return { success: false, error: "Failed to save comment pack" }
    }

    return {
      success: true,
      pageId: page.id,
      comments: comments,
      videoUrl: `https://youtube.com/watch?v=${input.videoId}`
    }
  } catch (error) {
    console.error("[rh] Error in generateViralCommentsAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
