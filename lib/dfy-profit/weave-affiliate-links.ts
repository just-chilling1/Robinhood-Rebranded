const CTA_LABEL = "Check Today's Price"

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function anchor(href: string, label: string): string {
  return `<a class="affiliate-link" href="${href}" target="_blank" rel="noopener sponsored">${label}</a>`
}

/**
 * Weave the user's affiliate link into generated article HTML.
 * Idempotent: html that already contains an affiliate anchor is returned as-is,
 * so re-running a stage cannot stack duplicate CTAs.
 */
export function weaveAffiliateLinks(html: string, affiliateUrl: string, ctaLabel: string = CTA_LABEL): string {
  const url = affiliateUrl.trim()
  if (!url) return html
  if (html.includes('class="affiliate-link"')) return html

  const href = escapeAttribute(url)
  let body = html

  if (body.includes("[LINK]")) {
    body = body.split("[LINK]").join(anchor(href, "see the details here"))
  } else {
    const headingEnd = body.indexOf("</h2>")
    const recommendation = `<p>Here is the exact resource referenced above: ${anchor(href, "see the details here")}.</p>`
    body =
      headingEnd === -1
        ? `${recommendation}${body}`
        : `${body.slice(0, headingEnd + 5)}${recommendation}${body.slice(headingEnd + 5)}`
  }

  const cta = `<p class="article-cta">${anchor(href, ctaLabel)}</p>`
  return `${body}${cta}`
}
