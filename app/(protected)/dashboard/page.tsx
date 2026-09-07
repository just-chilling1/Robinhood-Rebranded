import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { DashboardTipsWidget } from "@/components/dashboard-tips-widget"
import { PremiumUpgradesWidget } from "@/components/premium-upgrades-widget"
import { DashboardVideoCard } from "@/components/dashboard-video-card"
import { BonusTrainingCard } from "@/components/bonus-training-card"
import { DashboardSupportBanner } from "@/components/dashboard-support-banner"
import { BookOpen, Brain, Play } from "lucide-react"
import { DASHBOARD_TRAINING_VIDEOS } from "@/lib/dashboard-training-videos"
import { PRODUCT_NAME } from "@/lib/brand"

/** Never serve a cached dashboard shell (avoids stale UI after deploys). */
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/auth/login")
    }

    let profile = null

    try {
      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()
      profile = profileData
    } catch (error) {
      console.error("[robinhood] Error fetching profile:", error)
    }

    const firstName = profile?.full_name ? profile.full_name.split(" ")[0] : ""

    return (
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-4">
        <div className="space-y-8 xl:col-span-3">
          <PageHeader
            eyebrow="Home"
            title={<>Welcome to {PRODUCT_NAME}{firstName ? `, ${firstName}` : ""}</>}
            subtitle="Watch the three videos below in order — then jump into Gold Rush and start earning. The Academy is there whenever you want a deeper walkthrough."
          />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Play className="h-7 w-7 text-slate-600" />
              <h2 className="ds-h2">Start Here</h2>
            </div>
            <DashboardVideoCard video={DASHBOARD_TRAINING_VIDEOS[0]} />
          </div>

          <BonusTrainingCard />

          <DashboardVideoCard video={DASHBOARD_TRAINING_VIDEOS[1]} />

          <BonusTrainingCard />

          <DashboardVideoCard video={DASHBOARD_TRAINING_VIDEOS[2]} />

          <div className="flex flex-col gap-3">
            <Link
              href="/create"
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#2563EB] px-8 text-sm font-bold text-white shadow-lg shadow-[#2563EB]/25 transition-all hover:from-[#1D4ED8] hover:to-[#1D4ED8]"
            >
              <Brain className="h-5 w-5" />
              Get Started Now with Gold Rush
            </Link>
            <Link
              href="/training"
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-8 text-sm font-bold text-foreground shadow-card transition-colors hover:border-primary hover:bg-primary-light"
            >
              <BookOpen className="h-5 w-5" />
              Know More from the Academy
            </Link>
          </div>

          <DashboardSupportBanner />
        </div>

        <aside className="hidden min-w-0 space-y-6 xl:col-span-1 xl:block">
          <ContactSupportWidget />

          <DashboardTipsWidget />

          <PremiumUpgradesWidget />
        </aside>
      </div>
    )
  } catch (error) {
    console.error("[robinhood] Dashboard error:", error)
    redirect("/auth/login")
  }
}
