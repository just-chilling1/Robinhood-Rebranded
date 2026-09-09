import { describe, expect, it, vi } from "vitest"

vi.mock("./ai", () => ({
  generateStructuredJson: vi.fn(),
  isAiConfigured: () => false,
}))

import { generateAuthorityArticle } from "./generate-authority-article"
import { buildDfyArticleTopic } from "./prompts"

describe("buildDfyArticleTopic", () => {
  it("uses the product as territory and the niche as the cluster hobby", () => {
    expect(buildDfyArticleTopic("KetoMax", "Weight Loss")).toEqual({
      topic: "KetoMax: The Complete Buyer's Guide",
      territory: "KetoMax",
      hobby: "Weight Loss",
      angle: "pillar-guide",
    })
  })
})

describe("generateAuthorityArticle", () => {
  it("returns the authority template when AI is not configured", async () => {
    const article = await generateAuthorityArticle({
      productName: "KetoMax",
      productContext: "a keto plan",
      niche: "Weight Loss",
    })
    expect(article.title).toBe("KetoMax: The Complete Buyer's Guide")
    expect(article.html).toContain("Frequently Asked Questions")
    expect(article.html).toContain('href="#offer"')
  })
})
