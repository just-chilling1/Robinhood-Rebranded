import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { DashboardTipsWidget } from "@/components/dashboard-tips-widget"
import { PremiumUpgradesWidget } from "@/components/premium-upgrades-widget"
import { DashboardVideoCard } from "@/components/dashboard-video-card"
import { BonusTrainingCard } from "@/components/bonus-training-card"
import { BookOpen, Brain, Headphones, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DASHBOARD_TRAINING_VIDEOS } from "@/lib/dashboard-training-videos"

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
            title={<>Welcome to Robinhood{firstName ? `, ${firstName}` : ""}</>}
            subtitle="Watch the three videos below in order — then jump into Gold Rush and start earning. The Academy is there whenever you want a deeper walkthrough."
          />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Play className="h-7 w-7 text-[#fbbf24]" />
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
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#d946ef] px-8 text-sm font-bold text-white shadow-lg shadow-[#a855f7]/25 transition-all hover:from-[#d946ef] hover:to-[#a855f7]"
            >
              <Brain className="h-5 w-5" />
              Get Started Now with Gold Rush
            </Link>
            <Link
              href="/training"
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-bold text-white transition-colors hover:border-[#0ea5e9]/40 hover:bg-white/10"
            >
              <BookOpen className="h-5 w-5" />
              Know More from the Academy
            </Link>
          </div>

          <Card className="glass-strong glow-cyan border-2 border-[#06b6d4]/40">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9] shadow-lg">
                    <Headphones className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 text-xl font-extrabold text-white">Need Help?</h3>
                    <p className="text-sm text-[#7dd3fc]">Priority support available 24/7</p>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] px-8 py-5 text-base font-extrabold text-white shadow-lg shadow-[#06b6d4]/30 transition-all duration-300 hover:from-[#0ea5e9] hover:to-[#06b6d4] hover:shadow-[#06b6d4]/50"
                >
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="hidden min-w-0 space-y-6 xl:col-span-1 xl:block">
          <ContactSupportWidget />

          <Card className="glass-strong border border-[#0ea5e9]/25">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-[#7dd3fc]">
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <DashboardTipsWidget />
            </CardContent>
          </Card>

          <PremiumUpgradesWidget />
        </aside>
      </div>
    )
  } catch (error) {
    console.error("[robinhood] Dashboard error:", error)
    redirect("/auth/login")
  }
}
