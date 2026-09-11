import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { generateAuthorityArticle } from "@/lib/dfy-profit/generate-authority-article"
import { weaveAffiliateLinks } from "@/lib/dfy-profit/weave-affiliate-links"
import { buildArticleSlug } from "@/lib/dfy-profit/slug"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"

export const dynamic = "force-dynamic"
export const maxDuration = 120

const NO_STORE = { "Cache-Control": "no-store" } as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE })
  }

  const body = await request.json().catch(() => ({}))
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl.trim() : ""
  const productName = typeof body.productName === "string" ? body.productName.trim() : ""
  const productContext = typeof body.productContext === "string" ? body.productContext.trim() : ""
  const niche = typeof body.niche === "string" ? body.niche.trim() : ""

  if (!isValidAffiliateUrl(affiliateUrl) || !productName || !niche) {
    return NextResponse.json(
      { error: "affiliateUrl, productName, and niche are required" },
      { status: 400, headers: NO_STORE },
    )
  }

  const content = await generateAuthorityArticle({
    productName,
    productContext,
    niche,
    affiliateUrl,
  })
  const html = sanitizeArticleHtml(weaveAffiliateLinks(content.html, affiliateUrl))

  // Satisfies pages.niche_id NOT NULL without a migration.
  const { data: niche_row } = await supabase.from("niches").select("id").limit(1).single()

  // pages.slug is UNIQUE, so retry once with a fresh suffix on a collision.
  let page: { id: string; slug: string | null } | null = null
  let insertError: { code?: string; message?: string } | null = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await supabase
      .from("pages")
      .insert({
        user_id: user.id,
        niche_id: niche_row?.id ?? null,
        offer_id: null,
        offer_name: productName,
        title: content.title,
        content: html,
        affiliate_link: affiliateUrl,
        slug: buildArticleSlug(content.title),
        status: "active",
        views: 0,
        clicks: 0,
      })
      .select("id, slug")
      .single()

    if (!result.error && result.data) {
      page = result.data
      insertError = null
      break
    }

    insertError = result.error
    // 23505 is Postgres unique_violation; anything else will not be fixed by a retry.
    if (result.error?.code !== "23505") break
  }

  if (insertError || !page) {
    // Still return the copy so the kit UI is not empty. Mirrors blackbox's
    // article/route.ts lines 66-80.
    console.error("[rh] dfy-profit article save failed:", insertError)
    return NextResponse.json(
      {
        id: null,
        slug: null,
        url: null,
        title: content.title,
        excerpt: content.excerpt,
        html,
        saveWarning: "Article generated but not saved, so there is no shareable link. Copy the text below.",
      },
      { headers: NO_STORE },
    )
  }

  const origin = new URL(request.url).origin

  return NextResponse.json(
    {
      id: page.id,
      slug: page.slug,
      url: `${origin}/article/${page.slug ?? page.id}`,
      title: content.title,
      excerpt: content.excerpt,
      html,
    },
    { headers: NO_STORE },
  )
}
