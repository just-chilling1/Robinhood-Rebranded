import { describe, expect, it } from "vitest"
import { deriveNameFromUrl, parseOfferContext } from "./scrape-offer-context"

describe("deriveNameFromUrl", () => {
  it("title-cases the host without the tld or www", () => {
    expect(deriveNameFromUrl("https://www.ketomax.com/offer")).toBe("Ketomax")
  })

  it("splits hyphenated hosts into words", () => {
    expect(deriveNameFromUrl("https://keto-max-plan.net")).toBe("Keto Max Plan")
  })

  it("falls back to a generic name for an unparseable url", () => {
    expect(deriveNameFromUrl("not a url")).toBe("This Offer")
  })
})

describe("parseOfferContext", () => {
  it("reads the title tag and meta description", () => {
    const html = '<html><head><title>KetoMax - Burn Fat</title><meta name="description" content="A 30 day plan."></head></html>'
    expect(parseOfferContext(html)).toEqual({ title: "KetoMax - Burn Fat", description: "A 30 day plan." })
  })

  it("reads og:description when there is no meta description", () => {
    const html = '<meta property="og:description" content="OG copy here.">'
    expect(parseOfferContext(html).description).toBe("OG copy here.")
  })

  it("decodes html entities in the title", () => {
    expect(parseOfferContext("<title>Keto &amp; Fasting</title>").title).toBe("Keto & Fasting")
  })

  it("returns empty strings when nothing is present", () => {
    expect(parseOfferContext("<p>nothing</p>")).toEqual({ title: "", description: "" })
  })
})
