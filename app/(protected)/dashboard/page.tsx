import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { QuickActionCard } from "@/components/quick-action-card"
import { FeaturedVideoCard } from "@/components/featured-video-card"
import { HowItWorks } from "@/components/how-it-works"
import { PageHeader } from "@/components/page-header"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { DashboardTipsWidget } from "@/components/dashboard-tips-widget"
import { PremiumUpgradesWidget } from "@/components/premium-upgrades-widget"
import { Brain, Play, Gem, Headphones } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      console.error("[rh] Error fetching profile:", error)
    }

    const firstName = profile?.full_name ? profile.full_name.split(" ")[0] : ""

    return (
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-4">
        <div className="space-y-8 xl:col-span-3">
          <PageHeader
            eyebrow="Home"
            title={<>Welcome to RH{firstName ? `, ${firstName}` : ""}</>}
            subtitle="You post ready-made comments on viral videos. When someone buys through your links, you get paid. You only need to do three things — each one takes just a few minutes."
          />

          <FeaturedVideoCard />

          <HowItWorks />

          <div>
            <h2 className="ds-h2 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <QuickActionCard
                title="Gold Rush"
                description="Find trending Shorts and generate comment packs instantly"
                icon={Brain}
                href="/create"
                buttonText="Launch Now"
                glowColor="blue"
              />
              <QuickActionCard
                title="Training Academy"
                description="Learn how to maximize engagement safely"
                icon={Play}
                href="/training"
                buttonText="Access Now"
                glowColor="pink"
              />
              <QuickActionCard
                title="Premium Systems"
                description="Unlock advanced AI models and workflows"
                icon={Gem}
                href="/upgrades"
                buttonText="Explore Premium"
                glowColor="cyan"
              />
            </div>
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
    console.error("[rh] Dashboard error:", error)
    redirect("/auth/login")
  }
}
