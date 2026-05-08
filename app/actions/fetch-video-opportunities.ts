"use server"

export interface VideoOpportunity {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  viewCount: number
  likeCount?: number
  commentCount?: number
  publishedAt: string
  estimatedClicks: number
  viralScore: number
}

/** Engagement-oriented metrics for prioritizing Shorts (no revenue estimates). */
function calculateOpportunityMetrics(video: any): { estimatedClicks: number; viralScore: number } {
  const views = parseInt(video.statistics?.viewCount || "0")
  const likes = parseInt(video.statistics?.likeCount || "0")
  const comments = parseInt(video.statistics?.commentCount || "0")

  const engagementRate = views > 0 ? ((likes + comments * 3) / views) * 100 : 0
  const viralScore = Math.min(100, Math.round(engagementRate * 1000))

  const baseClickRate = 0.00001
  const bonusClickRate = (viralScore / 100) * 0.00009
  const clickRate = baseClickRate + bonusClickRate
  const rawClicks = views * clickRate
  const estimatedClicks = Math.max(10, Math.min(99, Math.round(rawClicks)))

  return { estimatedClicks, viralScore }
}

export async function fetchTrendingShorts(): Promise<VideoOpportunity[]> {
  const apiKey = process.env.RAPIDAPI_KEY || "e58a784d0dmsh8c00f2f58365008p103943jsn729926f8c316"

  try {
    const response = await fetch("https://yt-api.p.rapidapi.com/trending?geo=US&type=shorts", {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    })

    if (!response.ok) {
      console.error("[youtube] Trending API failed:", response.status)
      return generateSampleOpportunities()
    }

    const data = await response.json()
    const videos = data.data || []

    if (videos.length === 0) {
      return generateSampleOpportunities()
    }

    return videos.slice(0, 20).map((video: any) => {
      const viewCount = parseInt(video.viewCount || "0")
      const likeCount = parseInt(video.likeCount || "0")
      const commentCount = parseInt(video.commentCount || "0")

      const metrics = calculateOpportunityMetrics({
        statistics: {
          viewCount: viewCount.toString(),
          likeCount: likeCount.toString(),
          commentCount: commentCount.toString(),
        },
      })

      return {
        videoId: video.videoId,
        title: video.title,
        channelTitle: video.channelTitle || video.channelName || "Unknown Channel",
        thumbnailUrl: video.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
        viewCount,
        likeCount,
        commentCount,
        publishedAt: video.publishedTime || new Date().toISOString(),
        ...metrics,
      }
    }).sort((a: VideoOpportunity, b: VideoOpportunity) => b.viralScore - a.viralScore)
  } catch (error) {
    console.error("[youtube] Error fetching trending shorts:", error)
    return generateSampleOpportunities()
  }
}

export async function searchVideosByKeyword(keyword: string): Promise<VideoOpportunity[]> {
  const apiKey = process.env.RAPIDAPI_KEY || "e58a784d0dmsh8c00f2f58365008p103943jsn729926f8c316"

  try {
    const encodedKeyword = encodeURIComponent(keyword)
    const response = await fetch(
      `https://yt-api.p.rapidapi.com/search?query=${encodedKeyword}&type=shorts&sort_by=views`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "yt-api.p.rapidapi.com",
        },
      },
    )

    if (!response.ok) {
      console.error("[youtube] Search API failed:", response.status)
      return generateSampleOpportunities()
    }

    const data = await response.json()
    const videos = data.data || []

    if (videos.length === 0) {
      return generateSampleOpportunities()
    }

    return videos.slice(0, 20).map((video: any) => {
      const viewCount = parseInt(video.viewCount || "0")
      const likeCount = parseInt(video.likeCount || "0")
      const commentCount = parseInt(video.commentCount || "0")

      const metrics = calculateOpportunityMetrics({
        statistics: {
          viewCount: viewCount.toString(),
          likeCount: likeCount.toString(),
          commentCount: commentCount.toString(),
        },
      })

      return {
        videoId: video.videoId,
        title: video.title,
        channelTitle: video.channelTitle || video.channelName || "Unknown Channel",
        thumbnailUrl: video.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
        viewCount,
        likeCount,
        commentCount,
        publishedAt: video.publishedTime || new Date().toISOString(),
        ...metrics,
      }
    }).sort((a: VideoOpportunity, b: VideoOpportunity) => b.viralScore - a.viralScore)
  } catch (error) {
    console.error("[youtube] Error searching videos:", error)
    return generateSampleOpportunities()
  }
}

function generateSampleOpportunities(): VideoOpportunity[] {
  return [
    {
      videoId: "dQw4w9WgXcQ",
      title: "I Lost 50 Pounds in 90 Days - Here's How",
      channelTitle: "FitLife Journey",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      viewCount: 2847000,
      likeCount: 89000,
      commentCount: 4200,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 87,
      viralScore: 92,
    },
    {
      videoId: "sample123",
      title: "Side Projects That Taught Me Real Skills",
      channelTitle: "Money Makers",
      thumbnailUrl: "https://i.ytimg.com/vi/sample123/mqdefault.jpg",
      viewCount: 1920000,
      likeCount: 67000,
      commentCount: 3100,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 76,
      viralScore: 88,
    },
    {
      videoId: "crypto456",
      title: "Crypto Basics Without the Hype",
      channelTitle: "Crypto Millionaire",
      thumbnailUrl: "https://i.ytimg.com/vi/crypto456/mqdefault.jpg",
      viewCount: 1450000,
      likeCount: 52000,
      commentCount: 2800,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 68,
      viralScore: 85,
    },
    {
      videoId: "fitness789",
      title: "30 Day Body Transformation - No Gym Needed",
      channelTitle: "Home Fitness Pro",
      thumbnailUrl: "https://i.ytimg.com/vi/fitness789/mqdefault.jpg",
      viewCount: 1280000,
      likeCount: 44000,
      commentCount: 2100,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 62,
      viralScore: 81,
    },
    {
      videoId: "business234",
      title: "Starting a Small Business From a Spare Room",
      channelTitle: "Entrepreneur Life",
      thumbnailUrl: "https://i.ytimg.com/vi/business234/mqdefault.jpg",
      viewCount: 980000,
      likeCount: 38000,
      commentCount: 1900,
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 58,
      viralScore: 78,
    },
    {
      videoId: "invest567",
      title: "Simple Investing Habits for Busy Weeks",
      channelTitle: "Financial Freedom",
      thumbnailUrl: "https://i.ytimg.com/vi/invest567/mqdefault.jpg",
      viewCount: 870000,
      likeCount: 32000,
      commentCount: 1600,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 54,
      viralScore: 75,
    },
    {
      videoId: "drop890",
      title: "Dropshipping Setup Walkthrough (Beginner Friendly)",
      channelTitle: "Ecom Kings",
      thumbnailUrl: "https://i.ytimg.com/vi/drop890/mqdefault.jpg",
      viewCount: 720000,
      likeCount: 28000,
      commentCount: 1400,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 49,
      viralScore: 72,
    },
    {
      videoId: "mindset345",
      title: "This Mindset Shift Changed My Life Forever",
      channelTitle: "Success Mindset",
      thumbnailUrl: "https://i.ytimg.com/vi/mindset345/mqdefault.jpg",
      viewCount: 650000,
      likeCount: 24000,
      commentCount: 1200,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 45,
      viralScore: 69,
    },
    {
      videoId: "passive678",
      title: "Three Long-Term Systems for Reinvesting Your Time",
      channelTitle: "Passive Income Pro",
      thumbnailUrl: "https://i.ytimg.com/vi/passive678/mqdefault.jpg",
      viewCount: 590000,
      likeCount: 21000,
      commentCount: 1000,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 41,
      viralScore: 66,
    },
    {
      videoId: "amazon901",
      title: "Amazon FBA: Inventory and Listing Checklist",
      channelTitle: "Amazon Secrets",
      thumbnailUrl: "https://i.ytimg.com/vi/amazon901/mqdefault.jpg",
      viewCount: 480000,
      likeCount: 18000,
      commentCount: 850,
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 37,
      viralScore: 63,
    },
    {
      videoId: "social234",
      title: "I Grew My Instagram to 100k in 90 Days",
      channelTitle: "Social Media Boss",
      thumbnailUrl: "https://i.ytimg.com/vi/social234/mqdefault.jpg",
      viewCount: 420000,
      likeCount: 16000,
      commentCount: 780,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 34,
      viralScore: 61,
    },
    {
      videoId: "diet567",
      title: "I Ate This Every Day and Lost 30 Pounds",
      channelTitle: "Diet Hacks",
      thumbnailUrl: "https://i.ytimg.com/vi/diet567/mqdefault.jpg",
      viewCount: 380000,
      likeCount: 14000,
      commentCount: 690,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 31,
      viralScore: 58,
    },
    {
      videoId: "youtube890",
      title: "How Small YouTubers Grow an Audience From Zero",
      channelTitle: "YouTube Money",
      thumbnailUrl: "https://i.ytimg.com/vi/youtube890/mqdefault.jpg",
      viewCount: 340000,
      likeCount: 12000,
      commentCount: 610,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 28,
      viralScore: 55,
    },
    {
      videoId: "trade123",
      title: "Day Trading: What One Session Actually Looks Like",
      channelTitle: "Trading Academy",
      thumbnailUrl: "https://i.ytimg.com/vi/trade123/mqdefault.jpg",
      viewCount: 310000,
      likeCount: 11000,
      commentCount: 550,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 25,
      viralScore: 52,
    },
    {
      videoId: "affiliate456",
      title: "Affiliate Marketing: Tracking Your First Conversions",
      channelTitle: "Affiliate Secrets",
      thumbnailUrl: "https://i.ytimg.com/vi/affiliate456/mqdefault.jpg",
      viewCount: 280000,
      likeCount: 9500,
      commentCount: 490,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 22,
      viralScore: 49,
    },
    {
      videoId: "freelance789",
      title: "Freelancing: How I Booked My First Ten Clients",
      channelTitle: "Freelance Freedom",
      thumbnailUrl: "https://i.ytimg.com/vi/freelance789/mqdefault.jpg",
      viewCount: 250000,
      likeCount: 8500,
      commentCount: 420,
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 19,
      viralScore: 46,
    },
    {
      videoId: "tiktok012",
      title: "TikTok Shop: Getting Comfortable on Camera",
      channelTitle: "TikTok Money",
      thumbnailUrl: "https://i.ytimg.com/vi/tiktok012/mqdefault.jpg",
      viewCount: 220000,
      likeCount: 7500,
      commentCount: 380,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 16,
      viralScore: 43,
    },
    {
      videoId: "course345",
      title: "How I Launched a Digital Course From a Small List",
      channelTitle: "Course Creator",
      thumbnailUrl: "https://i.ytimg.com/vi/course345/mqdefault.jpg",
      viewCount: 190000,
      likeCount: 6500,
      commentCount: 320,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 13,
      viralScore: 40,
    },
    {
      videoId: "saas678",
      title: "Building a SaaS: From Idea to First Users",
      channelTitle: "SaaS Startup",
      thumbnailUrl: "https://i.ytimg.com/vi/saas678/mqdefault.jpg",
      viewCount: 170000,
      likeCount: 5800,
      commentCount: 280,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedClicks: 11,
      viralScore: 38,
    },
  ]
}
