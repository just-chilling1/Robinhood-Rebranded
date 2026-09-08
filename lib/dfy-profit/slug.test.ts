import { describe, expect, it } from "vitest"
import { buildArticleSlug } from "./slug"

describe("buildArticleSlug", () => {
  const suffix = () => "ab12cd"

  it("lowercases and hyphenates a title", () => {
    expect(buildArticleSlug("The Ultimate Keto Guide", suffix)).toBe("the-ultimate-keto-guide-ab12cd")
  })

  it("strips punctuation and collapses separators", () => {
    expect(buildArticleSlug("Weight Loss: What *Actually* Works!!", suffix)).toBe(
      "weight-loss-what-actually-works-ab12cd",
    )
  })

  it("trims leading and trailing hyphens", () => {
    expect(buildArticleSlug("  --Hello--  ", suffix)).toBe("hello-ab12cd")
  })

  it("truncates a very long title to 60 characters before the suffix", () => {
    const slug = buildArticleSlug("a".repeat(200), suffix)
    expect(slug).toBe(`${"a".repeat(60)}-ab12cd`)
  })

  it("falls back to a default stem when the title has no usable characters", () => {
    expect(buildArticleSlug("!!!", suffix)).toBe("authority-article-ab12cd")
  })

  it("produces a different suffix on each call by default", () => {
    expect(buildArticleSlug("Same Title")).not.toBe(buildArticleSlug("Same Title"))
  })
})
