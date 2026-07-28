"use server"

type TrendingShort = {
  videoId: string
  title: string
  channelTitle: string
  publishedAt?: string
  thumbnailUrl?: string
  viewCount?: number
  url: string
}

function buildYouTubeUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`
}

function getMockShorts(categoryName: string): TrendingShort[] {
  // Fallback to keep the app usable without API keys in dev/demo.
  const base = [
    {
      videoId: "dQw4w9WgXcQ",
      title: `Trending in ${categoryName}: Quick tip you can try today`,
      channelTitle: "Creator Daily",
      viewCount: 1834000,
    },
    {
      videoId: "9bZkp7q19f0",
      title: `Hot right now (${categoryName}): 30-second breakdown`,
      channelTitle: "Shorts Lab",
      viewCount: 912300,
    },
    {
      videoId: "3JZ_D3ELwOQ",
      title: `Everyone is talking about this (${categoryName})`,
      channelTitle: "Trend Pulse",
      viewCount: 442100,
    },
  ]

  return base.map((s) => ({
    ...s,
    url: buildYouTubeUrl(s.videoId),
    thumbnailUrl: `https://i.ytimg.com/vi/${s.videoId}/hqdefault.jpg`,
  }))
}

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  return await res.json()
}

function parseIsoDurationToSeconds(iso: string): number | null {
  // Example: PT59S, PT1M2S, PT2M10S
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!match) return null
  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  return hours * 3600 + minutes * 60 + seconds
}

export default async function fetchTrendingShorts(categoryName: string): Promise<{ success: true; shorts: TrendingShort[] } | { success: false; error: string; shorts: TrendingShort[] }> {
  const apiKey = process.env.YOUTUBE_API_KEY

  // Always return a usable list (fallback) to keep UX smooth.
  const fallback = getMockShorts(categoryName)

  if (!apiKey) {
    return { success: false, error: "Missing YOUTUBE_API_KEY. Showing sample results.", shorts: fallback }
  }

  try {
    // Strategy: search for recent high-view videos matching "[category] shorts"
    // then hydrate details (duration + views) and keep <= 75s.
    const publishedAfter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
    const q = encodeURIComponent(`${categoryName} shorts`)

    const searchUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&order=viewCount&publishedAfter=${encodeURIComponent(publishedAfter)}&q=${q}&key=${encodeURIComponent(apiKey)}`

    const searchData = await fetchJson(searchUrl)
    const items: any[] = Array.isArray(searchData.items) ? searchData.items : []
    const ids = items
      .map((it) => it?.id?.videoId)
      .filter(Boolean)
      .slice(0, 20)

    if (ids.length === 0) {
      return { success: false, error: "No results. Showing sample results.", shorts: fallback }
    }

    const videosUrl =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(ids.join(","))}&key=${encodeURIComponent(apiKey)}`

    const videosData = await fetchJson(videosUrl)
    const videos: any[] = Array.isArray(videosData.items) ? videosData.items : []

    const shorts: TrendingShort[] = videos
      .map((v) => {
        const durationSec = parseIsoDurationToSeconds(v?.contentDetails?.duration || "")
        const viewCount = Number(v?.statistics?.viewCount || 0)
        const videoId = v?.id
        const title = v?.snippet?.title || "Untitled"
        const channelTitle = v?.snippet?.channelTitle || "Unknown channel"
        const thumbnailUrl =
          v?.snippet?.thumbnails?.high?.url ||
          v?.snippet?.thumbnails?.medium?.url ||
          v?.snippet?.thumbnails?.default?.url

        return {
          videoId,
          title,
          channelTitle,
          thumbnailUrl,
          publishedAt: v?.snippet?.publishedAt,
          viewCount,
          url: buildYouTubeUrl(videoId),
          // stash duration for filtering below (not part of public type)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any & { _durationSec?: number }
      })
      .filter((v: any) => Boolean(v.videoId))
      .map((v: any) => ({ ...v, _durationSec: undefined, url: buildYouTubeUrl(v.videoId) }))

    // We cannot keep _durationSec in type cleanly with the above map; re-filter using a second pass from source.
    const byId = new Map<string, number | null>()
    for (const v of videos) {
      const durationSec = parseIsoDurationToSeconds(v?.contentDetails?.duration || "")
      if (v?.id) byId.set(v.id, durationSec)
    }

    const filtered = shorts
      .filter((s) => {
        const dur = byId.get(s.videoId) ?? null
        // Shorts are <= 60s; some platforms produce 61-75s “short” style clips, so allow small buffer.
        return dur !== null && dur <= 75
      })
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 12)

    if (filtered.length === 0) {
      return { success: false, error: "No short-form videos found. Showing sample results.", shorts: fallback }
    }

    return { success: true, shorts: filtered }
  } catch (err) {
    console.error("[rh] fetchTrendingShorts failed:", err)
    return { success: false, error: "Could not fetch trending Shorts. Showing sample results.", shorts: fallback }
  }
}


