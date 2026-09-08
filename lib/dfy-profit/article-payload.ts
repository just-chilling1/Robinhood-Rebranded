export interface CommentPackPayload {
  version: number
  videoId: string
  videoUrl?: string
  videoTitle: string
  channelTitle?: string
  createdAt?: string
  comments: string[]
  tips?: string[]
}

export type ArticlePayload =
  | { kind: "pack"; pack: CommentPackPayload }
  | { kind: "html" }
  | { kind: "empty" }

/**
 * Decide how to render a `pages.content` value.
 * Comment packs are JSON with a `comments` array; Done-For-You Profit
 * articles are raw HTML.
 */
export function parseArticlePayload(content: string | null): ArticlePayload {
  const trimmed = content?.trim() ?? ""
  if (!trimmed) return { kind: "empty" }

  try {
    const parsed = JSON.parse(trimmed) as Partial<CommentPackPayload> | null
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.comments)) {
      return {
        kind: "pack",
        pack: {
          version: Number(parsed.version || 1),
          videoId: String(parsed.videoId || ""),
          videoUrl: parsed.videoUrl,
          videoTitle: String(parsed.videoTitle || ""),
          channelTitle: parsed.channelTitle,
          createdAt: parsed.createdAt,
          comments: parsed.comments,
          tips: parsed.tips,
        },
      }
    }
  } catch {
    /* not json, so it is html */
  }

  return { kind: "html" }
}
