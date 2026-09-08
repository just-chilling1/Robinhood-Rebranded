import type { GeneratedArticleContent } from "./types"

export interface ArticlePromptInput {
  productName: string
  productContext: string
  niche: string
}

const MIN_ARTICLE_WORDS = 900

export function buildArticlePrompt(input: ArticlePromptInput): string {
  return `You are an experienced affiliate content writer. Write one long authority article.

TOPIC: the best approach to ${input.niche}
PRODUCT YOU RECOMMEND: ${input.productName}
PRODUCT CONTEXT: ${input.productContext || input.niche}

REQUIREMENTS:
- At least 1200 words of real, specific, useful content
- Plain HTML body only: <p>, <h2>, <h3>, <ul>, <li>, <strong>. No <html>, <head>, or <body> tags
- Open with the reader's problem, not a greeting
- At least four <h2> sections
- Include one <h2>FAQ</h2> section with at least three question and answer pairs
- Mention ${input.productName} naturally two or three times, never as hype
- Put the exact token [LINK] on its own once in the body where a reader would want the resource
- Plain English, beginner friendly, honest about effort required
- No fabricated statistics and no income guarantees

Reply with JSON only, no markdown fences, in exactly this shape:
{"title": "...", "excerpt": "one or two sentence summary", "html": "<p>...</p>"}`
}

export function buildFacebookPostsPrompt(input: {
  productName: string
  niche: string
  promoLink: string
  postCount: number
}): string {
  return `Write ${input.postCount} different Facebook posts promoting a helpful article.

NICHE: ${input.niche}
PRODUCT: ${input.productName}
LINK TO SHARE: ${input.promoLink}

REQUIREMENTS:
- Each post 50 to 90 words
- Written like a real person sharing something that helped them, not an ad
- Each post uses a different angle: a personal result, a warning about a common mistake, a curiosity hook
- Each post ends with the link exactly as given: ${input.promoLink}
- No hashtags, no emoji, no income guarantees

Reply with JSON only, no markdown fences, in exactly this shape:
{"posts": ["first post text", "second post text"]}`
}

function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/**
 * Validate an AI article payload. Returns null when it fails the authority bar,
 * which signals `generateStructuredJson` to retry.
 */
export function normalizeArticleContent(raw: unknown, fallbackTitle: string): GeneratedArticleContent | null {
  if (!raw || typeof raw !== "object") return null

  const candidate = raw as Partial<GeneratedArticleContent>
  const html = typeof candidate.html === "string" ? candidate.html.trim() : ""
  if (!html) return null

  const plain = stripHtml(html)
  if (countWords(plain) < MIN_ARTICLE_WORDS) return null
  if (!/faq|frequently asked/i.test(html)) return null

  const title = typeof candidate.title === "string" && candidate.title.trim() ? candidate.title.trim() : fallbackTitle
  const excerpt =
    typeof candidate.excerpt === "string" && candidate.excerpt.trim()
      ? candidate.excerpt.trim()
      : `${plain.slice(0, 180).trim()}...`

  return { title, excerpt, html }
}
