import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { QuickActionCard } from "@/components/quick-action-card"
import { FeaturedVideoCard } from "@/components/featured-video-card"
import { HowItWorks } from "@/components/how-it-works"
import { PageHeader } from "@/components/page-header"
import { Brain, Play, Gem, Headphones, ArrowRight, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/** Never serve a cached dashboard shell (avoids stale UI after deploys). */
export const dynamic = "force-dynamic"

const TIPS = [
  "Post comments on videos with 10k+ views for better reach.",
  "Save your best comment packs in My Vault so you can reuse them.",
  "Watch the Getting Started video before your first Gold Rush run.",
  "Add your affiliate links in Your Links before promoting.",
  "Individual results vary — consistency beats one-off spikes.",
]

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
    let pagesCount = 0
    let linksCount = 0

    try {
      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()
      profile = profileData
    } catch (error) {
      console.error("[robinhood] Error fetching profile:", error)
    }

    try {
      const [{ count: vaultCount }, { count: linkPages }] = await Promise.all([
        supabase.from("pages").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase
          .from("pages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .not("affiliate_link", "is", null),
      ])
      pagesCount = vaultCount ?? 0
      linksCount = linkPages ?? 0
    } catch (error) {
      console.error("[robinhood] Error fetching usage:", error)
    }

    const firstName = profile?.full_name ? profile.full_name.split(" ")[0] : ""
    const tip = TIPS[pagesCount % TIPS.length]
    const nextStepHref = pagesCount === 0 ? "/create" : linksCount === 0 ? "/share" : "/training"
    const nextStepLabel =
      pagesCount === 0
        ? "Create your first comment pack"
        : linksCount === 0
          ? "Save an affiliate link"
          : "Watch a training video"

    return (
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-4">
        <div className="space-y-8 xl:col-span-3">
          <PageHeader
            eyebrow="Home"
            title={<>Welcome to Robinhood{firstName ? `, ${firstName}` : ""}</>}
            subtitle="You post ready-made comments on viral videos. When someone buys through your links, you get paid. You only need to do three things — each one takes just a few minutes."
          />

          <FeaturedVideoCard />

          <HowItWorks />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="glass-strong border border-[#0ea5e9]/25">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7dd3fc]">Comment packs</p>
                <p className="mt-2 text-3xl font-black text-white">{pagesCount}</p>
                <p className="mt-1 text-sm text-[#a5c9e8]">Saved in your vault</p>
              </CardContent>
            </Card>
            <Card className="glass-strong border border-[#0ea5e9]/25">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7dd3fc]">Links tracked</p>
                <p className="mt-2 text-3xl font-black text-white">{linksCount}</p>
                <p className="mt-1 text-sm text-[#a5c9e8]">With an affiliate URL</p>
              </CardContent>
            </Card>
            <Card className="glass-strong border border-[#0ea5e9]/25">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7dd3fc]">Next step</p>
                <p className="mt-2 text-base font-bold leading-snug text-white">{nextStepLabel}</p>
                <Link
                  href={nextStepHref}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#0ea5e9] hover:underline"
                >
                  Go <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

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

        <aside className="hidden space-y-4 xl:col-span-1 xl:block">
          <Card className="glass-strong border border-[#fbbf24]/30">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#fbbf24]">Next step</p>
              <p className="mt-2 text-lg font-bold text-white">{nextStepLabel}</p>
              <Button
                asChild
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] font-bold text-white"
              >
                <Link href={nextStepHref}>Continue</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-strong border border-[#0ea5e9]/25">
            <CardContent className="space-y-4 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7dd3fc]">Your activity</p>
              <div>
                <p className="text-sm text-[#a5c9e8]">Comment packs saved</p>
                <p className="text-2xl font-black text-white">{pagesCount}</p>
              </div>
              <div>
                <p className="text-sm text-[#a5c9e8]">Links with affiliate URL</p>
                <p className="text-2xl font-black text-white">{linksCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-1 flex items-center gap-2 text-[#fbbf24]">
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Tip</span>
                </div>
                <p className="text-sm leading-snug text-[#d8e9fb]">{tip}</p>
              </div>
              <p className="text-xs text-[#7dd3fc]/70">Individual results vary.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    )
  } catch (error) {
    console.error("[robinhood] Dashboard error:", error)
    redirect("/auth/login")
  }
}
