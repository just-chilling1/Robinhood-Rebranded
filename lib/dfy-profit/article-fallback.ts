import { buildAuthorityArticleContent } from "@/lib/high-ticket-payouts/article-content"
import { buildDfyArticleTopic, type ArticlePromptInput } from "./prompts"
import type { GeneratedArticleContent } from "./types"

/**
 * Template authority article used when AI is unavailable or fails.
 * Same generator Blackbox uses for DFY Profit (`buildRecurringStreamArticleContent`).
 */
export function buildFallbackArticle(input: ArticlePromptInput): GeneratedArticleContent {
  const topic = buildDfyArticleTopic(input.productName, input.niche)
  const content = buildAuthorityArticleContent({
    topic: topic.topic,
    territory: topic.territory,
    hobby: topic.hobby,
    angle: topic.angle,
  })
  return {
    title: content.title,
    excerpt: content.excerpt,
    html: content.html,
  }
}
