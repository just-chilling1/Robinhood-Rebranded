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
  relevanceScore?: number
}

export interface FetchVideosInput {
  productName: string
  productDescription: string
  keyword?: string
  mode: "trending" | "niche"
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "your", "you", "are", "was",
  "how", "what", "when", "who", "why", "can", "get", "has", "have", "had", "not",
  "but", "all", "any", "our", "out", "day", "way", "new", "old", "one", "two",
  "teaches", "people", "about", "into", "over", "after", "before", "without", "using",
])

function getRapidApiKey(): string | undefined {
  return process.env.RAPIDAPI_KEY
}

function isValidYouTubeVideoId(videoId: string): boolean {
  return YOUTUBE_ID_PATTERN.test(videoId)
}

/** Build search terms from product info so results match what the user is promoting. */
function extractSearchTerms(productName: string, productDescription: string): string[] {
  const terms = new Set<string>()

  const trimmedName = productName.trim()
  if (trimmedName.length >= 3) {
    terms.add(trimmedName)
  }

  const descriptionWords =
    productDescription
      .toLowerCase()
      .match(/\b[a-z]{4,}\b/g)
      ?.filter((word) => !STOP_WORDS.has(word)) ?? []

  for (const word of descriptionWords.slice(0, 4)) {
    terms.add(word)
  }

  if (trimmedName.includes(" ")) {
    const nameWords = trimmedName.toLowerCase().split(/\s+/).filter((w) => w.length >= 4 && !STOP_WORDS.has(w))
    for (const word of nameWords.slice(0, 2)) {
      terms.add(word)
    }
  }

  return [...terms].slice(0, 5)
}

/** Score how well a video title matches the user's product/niche. */
function calculateRelevanceScore(title: string, searchTerms: string[]): number {
  const lowerTitle = title.toLowerCase()
  let score = 0

  for (const term of searchTerms) {
    const lowerTerm = term.toLowerCase()
    if (lowerTitle.includes(lowerTerm)) {
      score += lowerTerm.includes(" ") ? 3 : 1
    } else {
      const words = lowerTerm.split(/\s+/).filter((w) => w.length >= 4)
      for (const word of words) {
        if (lowerTitle.includes(word)) score += 1
      }
    }
  }

  return score
}

function calculateOpportunityMetrics(video: {
  statistics?: { viewCount?: string; likeCount?: string; commentCount?: string }
}): { estimatedClicks: number; viralScore: number } {
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

function mapRawVideo(video: Record<string, unknown>, relevanceScore: number): VideoOpportunity | null {
  const videoId = String(video.videoId || "")
  if (!isValidYouTubeVideoId(videoId)) return null

  const viewCount = parseInt(String(video.viewCount || "0"))
  const likeCount = parseInt(String(video.likeCount || "0"))
  const commentCount = parseInt(String(video.commentCount || "0"))

  const metrics = calculateOpportunityMetrics({
    statistics: {
      viewCount: viewCount.toString(),
      likeCount: likeCount.toString(),
      commentCount: commentCount.toString(),
    },
  })

  const thumbnail = video.thumbnail as Array<{ url?: string }> | undefined

  return {
    videoId,
    title: String(video.title || "Untitled"),
    channelTitle: String(video.channelTitle || video.channelName || "Unknown Channel"),
    thumbnailUrl: thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    viewCount,
    likeCount,
    commentCount,
    publishedAt: String(video.publishedTime || new Date().toISOString()),
    relevanceScore,
    ...metrics,
  }
}

/** YouTube oEmbed returns 404 for removed, private, or invalid videos. */
async function isVideoAvailable(videoId: string): Promise<boolean> {
  if (!isValidYouTubeVideoId(videoId)) return false

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`,
      { method: "GET", cache: "no-store" },
    )
    return response.ok
  } catch {
    return false
  }
}

async function validateVideos(videos: VideoOpportunity[]): Promise<VideoOpportunity[]> {
  const batchSize = 8
  const valid: VideoOpportunity[] = []

  for (let i = 0; i < videos.length; i += batchSize) {
    const batch = videos.slice(i, i + batchSize)
    const checks = await Promise.all(
      batch.map(async (video) => ((await isVideoAvailable(video.videoId)) ? video : null)),
    )
    valid.push(...checks.filter((v): v is VideoOpportunity => v !== null))
  }

  return valid
}

async function searchShortsByQuery(query: string, sortBy: "views" | "date" = "views"): Promise<Record<string, unknown>[]> {
  const apiKey = getRapidApiKey()
  if (!apiKey) {
    console.error("[youtube] Missing RAPIDAPI_KEY")
    return []
  }
  const encodedQuery = encodeURIComponent(query)

  const response = await fetch(
    `https://yt-api.p.rapidapi.com/search?query=${encodedQuery}&type=shorts&sort_by=${sortBy}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    console.error("[youtube] Search API failed:", response.status, query)
    return []
  }

  const data = await response.json()
  return Array.isArray(data.data) ? data.data : []
}

async function searchWithYouTubeApi(query: string): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  try {
    const publishedAfter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
    const searchUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&maxResults=15&order=viewCount&publishedAfter=${encodeURIComponent(publishedAfter)}&q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}`

    const searchResponse = await fetch(searchUrl, { cache: "no-store" })
    if (!searchResponse.ok) return []

    const searchData = await searchResponse.json()
    const ids = (searchData.items || [])
      .map((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .filter(Boolean)

    if (ids.length === 0) return []

    const videosUrl =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(ids.join(","))}&key=${encodeURIComponent(apiKey)}`

    const videosResponse = await fetch(videosUrl, { cache: "no-store" })
    if (!videosResponse.ok) return []

    const videosData = await videosResponse.json()

    return (videosData.items || []).map((video: Record<string, unknown>) => {
      const snippet = video.snippet as Record<string, unknown> | undefined
      const statistics = video.statistics as Record<string, string> | undefined
      const thumbnails = snippet?.thumbnails as Record<string, { url?: string }> | undefined

      return {
        videoId: video.id,
        title: snippet?.title,
        channelTitle: snippet?.channelTitle,
        viewCount: statistics?.viewCount,
        likeCount: statistics?.likeCount,
        commentCount: statistics?.commentCount,
        publishedTime: snippet?.publishedAt,
        thumbnail: thumbnails?.medium?.url
          ? [{ url: thumbnails.medium.url }]
          : thumbnails?.default?.url
            ? [{ url: thumbnails.default.url }]
            : [],
      }
    })
  } catch (error) {
    console.error("[youtube] YouTube API search failed:", error)
    return []
  }
}

export async function fetchVideoOpportunities(input: FetchVideosInput): Promise<VideoOpportunity[]> {
  const productTerms = extractSearchTerms(input.productName, input.productDescription)
  const userKeyword = input.keyword?.trim()

  const queries =
    input.mode === "niche" && userKeyword
      ? [userKeyword, ...productTerms.filter((t) => t.toLowerCase() !== userKeyword.toLowerCase())]
      : productTerms.length > 0
        ? productTerms
        : [input.productName.trim()].filter(Boolean)

  if (queries.length === 0) {
    console.error("[youtube] No search terms derived from product info")
    return []
  }

  const sortBy = input.mode === "trending" ? "views" : "views"
  const seenIds = new Set<string>()
  const candidates: VideoOpportunity[] = []

  for (const query of queries.slice(0, 3)) {
    let rawVideos = await searchShortsByQuery(query, sortBy)

    if (rawVideos.length === 0) {
      rawVideos = await searchWithYouTubeApi(`${query} shorts`)
    }

    for (const raw of rawVideos) {
      const relevanceScore = calculateRelevanceScore(String(raw.title || ""), [...queries, ...productTerms])
      const mapped = mapRawVideo(raw, relevanceScore)
      if (!mapped || seenIds.has(mapped.videoId)) continue

      seenIds.add(mapped.videoId)
      candidates.push(mapped)
    }
  }

  if (candidates.length === 0) {
    console.warn("[youtube] No relevant videos found for queries:", queries)
    return []
  }

  candidates.sort((a, b) => {
    const relevanceDiff = (b.relevanceScore || 0) - (a.relevanceScore || 0)
    if (relevanceDiff !== 0) return relevanceDiff
    return b.viralScore - a.viralScore
  })

  const validated = await validateVideos(candidates.slice(0, 40))

  return validated.slice(0, 20)
}

/** @deprecated Use fetchVideoOpportunities with product context instead. */
export async function fetchTrendingShorts(
  productName?: string,
  productDescription?: string,
): Promise<VideoOpportunity[]> {
  if (productName && productDescription) {
    return fetchVideoOpportunities({
      productName,
      productDescription,
      mode: "trending",
    })
  }

  console.warn("[youtube] fetchTrendingShorts called without product context — returning empty")
  return []
}

/** @deprecated Use fetchVideoOpportunities with product context instead. */
export async function searchVideosByKeyword(
  keyword: string,
  productName?: string,
  productDescription?: string,
): Promise<VideoOpportunity[]> {
  return fetchVideoOpportunities({
    productName: productName || keyword,
    productDescription: productDescription || keyword,
    keyword,
    mode: "niche",
  })
}
