"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface GenerateCommentPackInput {
  nicheId: string
  videoId: string
  videoTitle: string
  channelTitle?: string
  affiliateLink?: string
  offerName?: string
}

// RapidAPI ChatGPT function
async function generateAIComments(videoTitle: string, channelTitle: string, niche: string, offerName?: string): Promise<string[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const rapidApiHost = process.env.RAPIDAPI_HOST || "chatgpt-42.p.rapidapi.com"

  if (!rapidApiKey) {
    throw new Error("Missing RAPIDAPI_KEY")
  }
  
  const prompt = offerName 
    ? `You are a YouTube comment expert. Generate 10 high-quality, engaging comments for this YouTube Short:

Title: "${videoTitle}"
Channel: "${channelTitle}"
Niche: ${niche}

The commenter is promoting: "${offerName}"

Requirements:
- Make comments sound natural and human
- Mix of reactions, questions, and value-add comments
- Some should subtly create curiosity about the topic (to lead to the affiliate offer later)
- Vary length: some short (5-10 words), some medium (15-25 words)
- NO spam, NO direct links in comments
- Use casual language, emojis occasionally
- Make them specific to the video topic

Return ONLY the 10 comments, one per line, no numbering, no explanations.`
    : `You are a YouTube comment expert. Generate 10 high-quality, engaging comments for this YouTube Short:

Title: "${videoTitle}"
Channel: "${channelTitle}"
Niche: ${niche}

Requirements:
- Sound natural and human
- Mix reactions, questions, and insights
- Vary length: short and medium
- Use casual language
- Be specific to the video

Return ONLY the 10 comments, one per line.`

  try {
    const response = await fetch(`https://${rapidApiHost}/gpt4o`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        web_access: false
      })
    })

    if (!response.ok) {
      throw new Error(`RapidAPI error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.result || data.choices?.[0]?.message?.content || ""
    
    // Split by newlines and clean up
    const comments = aiResponse
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0 && !line.match(/^\d+[\.\)]/)) // Remove numbered lines
      .slice(0, 10)

    if (comments.length === 0) {
      throw new Error("No comments generated")
    }

    return comments
  } catch (error) {
    console.error("[rh] RapidAPI error:", error)
    // Fallback to template comments
    return generateTemplateComments(videoTitle, channelTitle, offerName)
  }
}

// Fallback template comments
function generateTemplateComments(videoTitle: string, channelTitle: string, offerName?: string): string[] {
  const templates = [
    `This is exactly what I needed! Great content 🔥`,
    `Wow, ${channelTitle} always delivers value!`,
    `Quick question - how long did it take you to see results?`,
    `This is a game changer. Saving this for later 💯`,
    `Finally someone explaining this properly! Thank you`,
    `Been struggling with this - your timing is perfect`,
    `Drop more content like this please! 🙏`,
    `This actually makes sense. Why didn't I find this sooner?`,
    `Respect for keeping it real and not overhyping`,
    `Commenting so I can come back to this later 📌`
  ]
  
  return templates
}

export default async function generateCommentPackAction(input: GenerateCommentPackInput) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Validate inputs
    if (!input.nicheId || !input.videoId || !input.videoTitle) {
      return { success: false, error: "Missing required fields" }
    }

    // Get niche info
    const { data: niche } = await supabase
      .from("niches")
      .select("name")
      .eq("id", input.nicheId)
      .single()

    const nicheName = niche?.name || "General"

    console.log("[rh] Generating comments with RapidAPI...")

    // Generate comments using RapidAPI
    const comments = await generateAIComments(
      input.videoTitle,
      input.channelTitle || "Unknown Channel",
      nicheName,
      input.offerName
    )

    console.log("[rh] Generated", comments.length, "comments")

    // Create page/pack in database
    const packTitle = input.offerName 
      ? `${input.offerName} - ${input.videoTitle.substring(0, 50)}`
      : input.videoTitle.substring(0, 80)

    // Create the comment pack object that matches the viewer format
    const packData = {
      version: 1,
      videoId: input.videoId,
      videoUrl: `https://youtube.com/watch?v=${input.videoId}`,
      videoTitle: input.videoTitle,
      channelTitle: input.channelTitle || "Unknown Channel",
      createdAt: new Date().toISOString(),
      comments: comments,
      tips: [
        "💡 Copy and paste these naturally throughout the day",
        "⏰ Space them out - don't spam all at once",
        "🎯 Pin your affiliate link in your YouTube channel description",
        "📱 Reply to other comments to increase visibility",
        "🔥 The more you engage, the more YouTube promotes your comments"
      ]
    }

    const { data: page, error: pageError } = await supabase
      .from("pages")
      .insert({
        user_id: user.id,
        niche_id: input.nicheId,
        offer_id: null, // Allow custom offers without offer_id
        offer_name: input.offerName || "Custom Offer",
        title: packTitle,
        content: JSON.stringify(packData), // Store full pack data
        affiliate_link: input.affiliateLink || `https://youtube.com/watch?v=${input.videoId}`,
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
      previewComments: comments.slice(0, 5), // Return first 5 for preview
    }
  } catch (error) {
    console.error("[rh] Error in generateCommentPackAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
