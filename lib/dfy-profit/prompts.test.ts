import { describe, expect, it } from "vitest"
import { buildArticlePrompt, buildFacebookPostsPrompt, normalizeArticleContent } from "./prompts"
import { buildFallbackArticle } from "./article-fallback"

const longBody = `<p>${"word ".repeat(950)}</p><h2>FAQ</h2><p>Q and A</p>`

describe("buildArticlePrompt", () => {
  it("includes the product, niche, and a json-only instruction", () => {
    const prompt = buildArticlePrompt({ productName: "KetoMax", productContext: "a keto plan", niche: "Weight Loss" })
    expect(prompt).toContain("KetoMax")
    expect(prompt).toContain("Weight Loss")
    expect(prompt).toContain("[LINK]")
    expect(prompt.toLowerCase()).toContain("json")
  })
})

describe("normalizeArticleContent", () => {
  it("accepts a long article with an faq", () => {
    const result = normalizeArticleContent({ title: "T", excerpt: "E", html: longBody }, "Fallback")
    expect(result?.title).toBe("T")
    expect(result?.html).toContain("FAQ")
  })

  it("rejects a short article", () => {
    expect(normalizeArticleContent({ title: "T", excerpt: "E", html: "<p>too short</p>" }, "Fallback")).toBeNull()
  })

  it("rejects an article with no faq section", () => {
    const noFaq = `<p>${"word ".repeat(950)}</p>`
    expect(normalizeArticleContent({ title: "T", excerpt: "E", html: noFaq }, "Fallback")).toBeNull()
  })

  it("rejects non-object input", () => {
    expect(normalizeArticleContent(null, "Fallback")).toBeNull()
    expect(normalizeArticleContent("nope", "Fallback")).toBeNull()
  })

  it("substitutes the fallback title when the title is missing", () => {
    const result = normalizeArticleContent({ excerpt: "E", html: longBody }, "Fallback")
    expect(result?.title).toBe("Fallback")
  })

  it("derives an excerpt from the body when it is missing", () => {
    const result = normalizeArticleContent({ title: "T", html: longBody }, "Fallback")
    expect(result?.excerpt.length).toBeGreaterThan(0)
    expect(result?.excerpt).not.toContain("<p>")
  })
})

describe("buildFacebookPostsPrompt", () => {
  it("asks for the requested post count and includes the promo link", () => {
    const prompt = buildFacebookPostsPrompt({
      productName: "KetoMax",
      niche: "Weight Loss",
      promoLink: "https://site.test/article/x",
      postCount: 3,
    })
    expect(prompt).toContain("3")
    expect(prompt).toContain("https://site.test/article/x")
  })
})

describe("buildFallbackArticle", () => {
  it("passes its own normalization bar so a no-ai run still yields an article", () => {
    const article = buildFallbackArticle({ productName: "KetoMax", productContext: "a keto plan", niche: "Weight Loss" })
    expect(normalizeArticleContent(article, "Fallback")).not.toBeNull()
  })

  it("includes a [LINK] token for weaving", () => {
    const article = buildFallbackArticle({ productName: "KetoMax", productContext: "", niche: "Weight Loss" })
    expect(article.html).toContain("[LINK]")
  })
})
