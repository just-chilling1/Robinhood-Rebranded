"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"

interface GenerateViralCommentsInput {
  videoId: string
  videoTitle: string
  channelTitle: string
  productName: string
  productDescription: string
  affiliateLink: string
  nicheId?: string
}

// Generate viral comments with embedded affiliate link
async function generateViralCommentsWithAI(input: GenerateViralCommentsInput): Promise<string[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const rapidApiHost = process.env.RAPIDAPI_HOST || "chatgpt-42.p.rapidapi.com"

  if (!rapidApiKey) {
    console.error("[rh] Missing RAPIDAPI_KEY — using template fallback")
    return generateTemplateViralComments(input)
  }
  
  const prompt = `You're writing a YouTube comment. Be natural and conversational like a real person.

CONTEXT (don't mention these directly):
- Video is about: ${input.videoTitle}
- You promote: ${input.productDescription}
- Your link: ${input.affiliateLink}

Write 3 different comments (40-60 words each) that:
1. Share a personal experience or reaction related to the video's topic
2. Naturally mention how you achieved results with your product/method
3. Include your link as a helpful resource

BE NATURAL:
- Write like you're texting a friend
- Share a short story or personal win
- Don't repeat the video title word-for-word
- Don't say "this video" or "great content"
- Sound authentic, not promotional

EXAMPLES OF NATURAL COMMENTS:

Bad: "Great video about weight loss! I used a weight loss system and lost 50 pounds. Check it out: [link]"

Good: "I was stuck at the same weight for months. Then I found a keto approach that finally worked and dropped 40 lbs in 3 months. Game changer for me: [link]"

Bad: "This crypto trading video is amazing! I learned crypto trading with a course. Here's the link: [link]"

Good: "My first month trading I lost $2k because I had no clue what I was doing. Found a system that taught me proper risk management and now I'm finally profitable. Here if anyone wants it: [link]"

Now write 3 unique comments. Each should feel different. Mix up the storytelling. Just output the 3 comments, one per line, no numbers or formatting.`

  console.log("[rh] Calling ChatGPT API...")

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

    console.log("[rh] API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[rh] API Error Response:", errorText)
      throw new Error(`RapidAPI error: ${response.status}`)
    }

    const data = await response.json()
    
    // Try multiple possible response formats
    let aiResponse = ""
    if (data.result) {
      aiResponse = data.result
    } else if (data.choices?.[0]?.message?.content) {
      aiResponse = data.choices[0].message.content
    } else if (data.message?.content) {
      aiResponse = data.message.content
    } else if (typeof data === 'string') {
      aiResponse = data
    }

    console.log("[rh] AI Response length:", aiResponse.length)
    
    if (!aiResponse) {
      throw new Error("No content in API response")
    }

    const comments = aiResponse
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => {
        if (line.length === 0) return false
        if (line.match(/^\d+[\.\):\-]/)) return false
        if (line.length < 30) return false // Skip very short lines
        return true
      })
      .slice(0, 3)

    console.log("[rh] Parsed", comments.length, "comments")

    if (comments.length === 0) {
      throw new Error("No valid comments parsed from response")
    }

    return comments
  } catch (error) {
    console.error("[rh] AI comment generation failed:", error)
    console.log("[rh] Using template fallback")
    return generateTemplateViralComments(input)
  }
}

function generateTemplateViralComments(input: GenerateViralCommentsInput): string[] {
  return [
    `I was stuck in the same situation for months. Then I found a method that finally worked - ${input.productDescription}. Completely turned things around for me. Here if anyone wants to check it out: ${input.affiliateLink}`,
    `Struggled with this for way too long before I discovered a system that actually delivers results. ${input.productDescription}. Game changer honestly: ${input.affiliateLink}`,
    `My experience was similar until I came across something that changed everything. ${input.productDescription}. Made a huge difference: ${input.affiliateLink}`
  ]
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

    const comments = await generateViralCommentsWithAI(input)

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

