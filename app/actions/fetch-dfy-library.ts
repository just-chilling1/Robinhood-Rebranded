"use server"

export interface DFYVideo {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  viewCount: number
  niche: string
  estimatedClicks: number
  viralScore: number
  commentTemplates: string[] // 5 templates with [PRODUCT] and [LINK] placeholders
}

const NICHES = [
  "weight loss",
  "make money online",
  "crypto trading",
  "fitness motivation",
  "side hustle",
  "passive income"
]

// Generate comment templates with placeholders
function generateCommentTemplates(): string[] {
  return [
    "I struggled with this exact thing for months. Then I found [PRODUCT] and everything changed. Completely different results now. Here if you want it: [LINK]",
    "This is solid advice. I combined this approach with [PRODUCT] and saw way better results than doing it alone. Game changer: [LINK]",
    "Been there. What finally worked for me was using [PRODUCT] alongside this method. Took things to the next level: [LINK]",
    "Great insights here. I also discovered [PRODUCT] which pairs perfectly with this strategy. Made a huge difference for me: [LINK]",
    "Struggled for a while until I found [PRODUCT]. It connects really well to what's discussed here. Check it out: [LINK]"
  ]
}

function calculateMetrics(viewCount: number): { estimatedClicks: number; viralScore: number } {
  const viralScore = Math.min(100, Math.round((viewCount / 1000000) * 100))

  const baseClickRate = 0.00001
  const bonusClickRate = (viralScore / 100) * 0.00009
  const clickRate = baseClickRate + bonusClickRate
  const rawClicks = viewCount * clickRate
  const estimatedClicks = Math.max(10, Math.min(99, Math.round(rawClicks)))

  return { estimatedClicks, viralScore }
}

export async function fetchDFYLibrary(): Promise<DFYVideo[]> {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'e58a784d0dmsh8c00f2f58365008p103943jsn729926f8c316'
  const allVideos: DFYVideo[] = []

  try {
    // Fetch videos for each niche (35-40 videos per niche to get 200+ total)
    for (const niche of NICHES) {
      try {
        const encodedNiche = encodeURIComponent(niche)
        const response = await fetch(
          `https://yt-api.p.rapidapi.com/search?query=${encodedNiche}&type=shorts&sort_by=views`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': RAPIDAPI_KEY,
              'x-rapidapi-host': 'yt-api.p.rapidapi.com'
            }
          }
        )

        if (!response.ok) {
          console.error(`[DFY] Failed to fetch ${niche} videos:`, response.status)
          continue
        }

        const data = await response.json()
        const videos = data.data || []

        // Process videos for this niche
        const nicheVideos = videos.slice(0, 35).map((video: any) => {
          const viewCount = parseInt(video.viewCount || "0")
          const metrics = calculateMetrics(viewCount)
          
          return {
            videoId: video.videoId,
            title: video.title,
            channelTitle: video.channelTitle || video.channelName || "Unknown Channel",
            thumbnailUrl: video.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
            viewCount: viewCount,
            niche: niche,
            commentTemplates: generateCommentTemplates(),
            ...metrics
          }
        })

        allVideos.push(...nicheVideos)
        
        console.log(`[DFY] Loaded ${nicheVideos.length} videos for "${niche}"`)
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (nicheError) {
        console.error(`[DFY] Error fetching ${niche}:`, nicheError)
      }
    }

    console.log(`[DFY] Total library size: ${allVideos.length} videos`)
    
    // Sort by viral score (best opportunities first)
    return allVideos.sort((a, b) => b.viralScore - a.viralScore)
    
  } catch (error) {
    console.error("[DFY] Error building library:", error)
    // Return empty array if API fails
    return []
  }
}

