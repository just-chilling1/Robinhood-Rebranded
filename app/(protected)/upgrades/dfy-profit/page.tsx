import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { listAffiliateLinks, type AffiliateLink } from "@/app/actions/affiliate-links"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import DfyProfitClient from "./DfyProfitClient"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.dfyProfit} | Your complete promo kit`,
  description: "Paste your affiliate link, pick a niche, and get videos, an authority article, and Facebook posts in one run.",
}

export default async function DfyProfitPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const linksResult = await listAffiliateLinks().catch(() => ({ success: false as const, error: "failed" }))
  const links: AffiliateLink[] = linksResult.success ? linksResult.links : []

  return <DfyProfitClient savedLinks={links} />
}
