import { describe, expect, it } from "vitest"
import { buildFallbackPosts } from "./posts-fallback"

const LINK = "https://site.test/article/keto-guide-ab12cd"

describe("buildFallbackPosts", () => {
  it("returns the requested number of posts", () => {
    expect(buildFallbackPosts("Weight Loss", LINK, 3)).toHaveLength(3)
  })

  it("substitutes the promo link into every post", () => {
    for (const post of buildFallbackPosts("Weight Loss", LINK, 3)) {
      expect(post).toContain(LINK)
      expect(post).not.toContain("[LINK]")
    }
  })

  it("returns distinct posts", () => {
    const posts = buildFallbackPosts("Weight Loss", LINK, 3)
    expect(new Set(posts).size).toBe(3)
  })

  it("falls back to generic copy for an unknown niche", () => {
    const posts = buildFallbackPosts("Underwater Basket Weaving", LINK, 3)
    expect(posts).toHaveLength(3)
    expect(posts[0]).toContain(LINK)
  })
})
