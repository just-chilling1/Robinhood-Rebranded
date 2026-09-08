import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { LicenseRightsContent } from "./license-rights-content"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.licenseRights} | Reseller Edition`,
  description: "Request activation for the Full Turnkey Reseller & License Rights Edition",
}

export default async function LicenseRightsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware already allows local bypass; keep page reachable for preview.
  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  return <LicenseRightsContent />
}
