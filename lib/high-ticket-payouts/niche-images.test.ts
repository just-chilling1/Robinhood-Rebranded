import { describe, expect, it } from "vitest"
import {
  buildNicheFallbackImageUrl,
  buildPixabayQuery,
  nicheVisualQuery,
  replaceFeaturedImageUrl,
} from "./niche-images"

describe("nicheVisualQuery", () => {
  it("maps high-ticket niches to stock-friendly phrases", () => {
    expect(nicheVisualQuery("Fitness & Sports")).toContain("fitness")
    expect(nicheVisualQuery("Finance & Investing")).toContain("finance")
  })

  it("fuzzy-matches related niche labels", () => {
    expect(nicheVisualQuery("Weight Loss")).toContain("weight")
  })
})

describe("buildPixabayQuery", () => {
  it("puts niche visuals first", () => {
    const q = buildPixabayQuery("Health & Wellness", "Health & Wellness: The Complete Buyer's Guide")
    expect(q.startsWith("health wellness")).toBe(true)
  })
})

describe("buildNicheFallbackImageUrl", () => {
  it("embeds niche tags instead of a random picsum seed", () => {
    const url = buildNicheFallbackImageUrl("Travel & Lifestyle", "Travel & Lifestyle for Beginners")
    expect(url).toContain("loremflickr.com")
    expect(url).toContain("travel")
    expect(url).not.toContain("picsum")
  })
})

describe("replaceFeaturedImageUrl", () => {
  it("swaps the first img src", () => {
    const html = '<figure><img src="https://old.example/a.jpg" alt="x" /></figure>'
    expect(replaceFeaturedImageUrl(html, "https://new.example/b.jpg")).toContain(
      'src="https://new.example/b.jpg"',
    )
  })
})
