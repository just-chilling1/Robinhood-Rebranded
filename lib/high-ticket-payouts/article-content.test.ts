import { describe, expect, it } from "vitest"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"
import { buildAuthorityArticleContent, wrapArticleWithTitle } from "./article-content"

function extractTocHrefs(html: string): string[] {
  const tocHeading = html.search(/<h2[^>]*>Table of Contents<\/h2>/i)
  const slice = tocHeading >= 0 ? html.slice(tocHeading, tocHeading + 2500) : html
  return [...slice.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])
}

function extractIds(html: string): Set<string> {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
}

describe("buildAuthorityArticleContent table of contents", () => {
  it("uses heading ids that survive sanitization so every TOC link resolves", () => {
    const article = buildAuthorityArticleContent({
      topic: "Health & Wellness: The Complete Buyer's Guide",
      territory: "Health & Wellness",
      hobby: "Health & Wellness",
      angle: "pillar-guide",
    })
    const html = sanitizeArticleHtml(wrapArticleWithTitle(article.title, article.html))
    const ids = extractIds(html)
    const hrefs = extractTocHrefs(html)

    expect(hrefs.length).toBeGreaterThan(5)
    for (const href of hrefs) {
      expect(ids.has(href), `missing target id for #${href}`).toBe(true)
    }
  })
})
