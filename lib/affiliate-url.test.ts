import { describe, expect, it } from "vitest"
import { isValidAffiliateUrl, sanitizeAffiliateUrl, safeHref } from "./affiliate-url"
import { sanitizeArticleHtml } from "./sanitize-html"

describe("isValidAffiliateUrl", () => {
  it("accepts public https URLs", () => {
    expect(isValidAffiliateUrl("https://hop.clickbank.net/?tid=abc")).toBe(true)
  })

  it("rejects javascript and http", () => {
    expect(isValidAffiliateUrl("javascript:alert(1)")).toBe(false)
    expect(isValidAffiliateUrl("http://example.com")).toBe(false)
  })

  it("rejects private and metadata hosts", () => {
    expect(isValidAffiliateUrl("https://127.0.0.1/")).toBe(false)
    expect(isValidAffiliateUrl("https://169.254.169.254/latest/meta-data/")).toBe(false)
    expect(isValidAffiliateUrl("https://localhost/secret")).toBe(false)
    expect(isValidAffiliateUrl("https://192.168.1.1/admin")).toBe(false)
    expect(isValidAffiliateUrl("https://10.0.0.5/")).toBe(false)
  })

  it("safeHref returns null for unsafe values", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull()
    expect(sanitizeAffiliateUrl("https://example.com/offer")?.startsWith("https://example.com/offer")).toBe(true)
  })
})

describe("sanitizeArticleHtml", () => {
  it("strips script tags and event handlers", () => {
    const html = `<p onclick="alert(1)">Hi</p><script>alert(2)</script><a href="javascript:alert(3)">x</a>`
    const out = sanitizeArticleHtml(html)
    expect(out).not.toContain("script")
    expect(out).not.toContain("onclick")
    expect(out).not.toContain("javascript:")
    expect(out).toContain("<p")
  })

  it("keeps https links", () => {
    const out = sanitizeArticleHtml(`<a href="https://example.com/x" class="affiliate-link">Go</a>`)
    expect(out).toContain("https://example.com/x")
  })

  it("preserves heading id attributes for in-article anchors", () => {
    const out = sanitizeArticleHtml(`<h2 id="next-steps">Next Steps</h2><a href="#next-steps">Jump</a>`)
    expect(out).toContain('id="next-steps"')
    expect(out).toContain('href="#next-steps"')
  })
})
