import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { onboardingConfig } from "@/lib/onboarding/config"

// Auth + cookies — never statically prerender (needs Supabase env at runtime).
export const dynamic = "force-dynamic"

export const metadata = {
  title: `Welcome | ${onboardingConfig.productName}`,
}

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single()

  if (profile?.onboarding_completed_at) {
    redirect(onboardingConfig.dashboardRoute)
  }

  return <OnboardingFlow />
}
