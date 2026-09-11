import { describe, expect, it } from "vitest"
import { buildArticlePrompt, buildFacebookPostsPrompt, normalizeArticleContent } from "./prompts"
import { buildFallbackArticle } from "./article-fallback"

const longBody = `<p>${"word ".repeat(1100)}</p><h2>FAQ</h2><p>Q and A</p>`

describe("buildArticlePrompt", () => {
  it("uses the Blackbox authority prompt: territory, #offer placeholder, and JSON output", () => {
    const prompt = buildArticlePrompt({ productName: "KetoMax", productContext: "a keto plan", niche: "Weight Loss" })
    expect(prompt).toContain("KetoMax")
    expect(prompt).toContain("Weight Loss")
    expect(prompt).toContain("The Complete Buyer's Guide")
    expect(prompt).toContain('href="#offer"')
    expect(prompt).toContain("1,500-2,500 words")
    expect(prompt).toContain("Frequently Asked Questions")
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
    const noFaq = `<p>${"word ".repeat(1100)}</p>`
    expect(normalizeArticleContent({ title: "T", excerpt: "E", html: noFaq }, "Fallback")).toBeNull()
  })

  it("rejects non-object input", () => {
    expect(normalizeArticleContent(null, "Fallback")).toBeNull()
    expect(normalizeArticleContent("nope", "Fallback")).toBeNull()
  })

  it("rejects a payload with no title", () => {
    expect(normalizeArticleContent({ excerpt: "E", html: longBody }, "Fallback")).toBeNull()
  })

  it("strips a model-supplied h1 so the template can own the title", () => {
    const result = normalizeArticleContent(
      { title: "T", excerpt: "E", html: `<h1>Wrong</h1>${longBody}` },
      "Fallback",
    )
    expect(result?.html).not.toContain("<h1>")
    expect(result?.html).toContain("FAQ")
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
  it("passes its own normalization bar so a no-ai run still yields an article", async () => {
    const article = await buildFallbackArticle({
      productName: "KetoMax",
      productContext: "a keto plan",
      niche: "Weight Loss",
    })
    expect(normalizeArticleContent(article, "Fallback")).not.toBeNull()
  })

  it("uses the Recurring Stream / High-Ticket authority template with a niche-related image", async () => {
    const article = await buildFallbackArticle({
      productName: "KetoMax",
      productContext: "",
      niche: "Weight Loss",
    })
    expect(article.title).toBe("KetoMax: The Complete Buyer's Guide")
    expect(article.html).toContain('class="article-body"')
    expect(article.html).toContain('href="#offer"')
    expect(article.html).toContain('aria-label="Table of contents"')
    expect(article.html).toContain("Frequently Asked Questions")
    expect(article.html).toContain('class="cta-box"')
    expect(article.html).toContain("<figure>")
    expect(article.html).not.toContain("picsum.photos")
    expect(article.html).toMatch(/loremflickr\.com|pixabay\.com/)
  })
})
