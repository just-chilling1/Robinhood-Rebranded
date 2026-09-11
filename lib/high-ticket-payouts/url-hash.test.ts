import { describe, expect, it } from "vitest"
import { hashAffiliateUrl } from "./url-hash"

describe("hashAffiliateUrl", () => {
  it("returns a 64-char hex digest", () => {
    const hash = hashAffiliateUrl("https://example.com/offer?x=1")
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it("is stable for the same URL", () => {
    const a = hashAffiliateUrl("https://example.com/offer")
    const b = hashAffiliateUrl("https://example.com/offer")
    expect(a).toBe(b)
  })

  it("trims whitespace before hashing", () => {
    const a = hashAffiliateUrl("  https://example.com/offer  ")
    const b = hashAffiliateUrl("https://example.com/offer")
    expect(a).toBe(b)
  })

  it("ignores URL fragments", () => {
    const a = hashAffiliateUrl("https://example.com/offer#section")
    const b = hashAffiliateUrl("https://example.com/offer")
    expect(a).toBe(b)
  })
})
