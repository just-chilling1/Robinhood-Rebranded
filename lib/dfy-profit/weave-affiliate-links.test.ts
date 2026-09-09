import { describe, expect, it } from "vitest"
import { weaveAffiliateLinks } from "./weave-affiliate-links"

const URL = "https://example.com/offer?id=42"

describe("weaveAffiliateLinks", () => {
  it("appends a footer CTA carrying the affiliate class and url", () => {
    const out = weaveAffiliateLinks("<p>One</p>", URL)
    expect(out).toContain('class="affiliate-link"')
    expect(out).toContain(`href="${URL}"`)
    expect(out).toContain("Check Today's Price")
  })

  it("replaces [LINK] placeholders with a tracked anchor", () => {
    const out = weaveAffiliateLinks("<p>See it here: [LINK]</p>", URL)
    expect(out).not.toContain("[LINK]")
    expect(out.match(/class="affiliate-link"/g)).toHaveLength(2)
  })

  it("inserts an inline recommendation after the first h2 when there is no placeholder", () => {
    const out = weaveAffiliateLinks("<h2>Why</h2><p>Body</p>", URL)
    const afterHeading = out.slice(out.indexOf("</h2>"))
    expect(afterHeading).toContain('class="affiliate-link"')
  })

  it("escapes double quotes in the url so the attribute cannot break out", () => {
    const out = weaveAffiliateLinks("<p>x</p>", 'https://e.com/"onmouseover=alert(1)')
    expect(out).not.toContain('"onmouseover=alert(1)')
    expect(out).toContain("&quot;onmouseover=alert(1)")
  })

  it("returns the html unchanged apart from nothing added when the url is blank", () => {
    expect(weaveAffiliateLinks("<p>x</p>", "  ")).toBe("<p>x</p>")
  })

  it("does not double-weave html that already contains an affiliate anchor", () => {
    const once = weaveAffiliateLinks("<h2>Why</h2><p>Body</p>", URL)
    const twice = weaveAffiliateLinks(once, URL)
    expect(twice).toBe(once)
  })

  it("rewrites Blackbox #offer placeholders to the affiliate url", () => {
    const out = weaveAffiliateLinks(
      '<h2>How to choose</h2><p>Start with <a href="#offer">the starter kit we recommend</a>.</p><div class="cta-box"><p><a href="#offer">Next step</a></p></div>',
      URL,
    )
    expect(out).not.toContain("#offer")
    expect(out).toContain(`href="${URL}"`)
    expect(out.split(`href="${URL}"`).length - 1).toBe(2)
  })
})
