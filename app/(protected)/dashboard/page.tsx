import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { QuickActionCard } from "@/components/quick-action-card"
import { FeaturedVideoCard } from "@/components/featured-video-card"
import { HowItWorks } from "@/components/how-it-works"
import { Brain, Play, Gem, Headphones } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
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

    // Fetch user profile with error handling
    let profile = null

    try {
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()
      profile = profileData
    } catch (error) {
      console.error("[robinhood] Error fetching profile:", error)
    }

    return (
      <div className="space-y-8 max-w-7xl mx-auto">
          {/* Welcome */}
          <div className="pt-2">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-[#fbbf24]">Home</p>
            <h1 className="mb-4 text-4xl lg:text-6xl font-black tracking-tight text-white">
              Welcome to Robinhood{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="max-w-3xl text-lg lg:text-xl leading-relaxed text-[#a5c9e8]">
              You post ready-made comments on viral videos. When someone buys through your links, you get paid. You
              only need to do three things &mdash; each one takes just a few minutes.
            </p>
          </div>

          {/* VIDEO CARD - FIRST THING THEY SEE */}
          <FeaturedVideoCard />

          {/* How it works - 3 simple steps */}
          <HowItWorks />

          {/* Quick Actions */}
          <div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Support Card */}
          <Card className="glass-strong border-2 border-[#06b6d4]/40 glow-cyan">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9] flex items-center justify-center shadow-lg">
                    <Headphones className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white mb-0.5">Need Help?</h3>
                    <p className="text-[#7dd3fc] text-sm">Priority support available 24/7</p>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-[#06b6d4] text-white font-extrabold px-8 py-5 text-base rounded-2xl shadow-lg shadow-[#06b6d4]/30 hover:shadow-[#06b6d4]/50 transition-all duration-300">
                  <a href="/support">Contact Support</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    )
  } catch (error) {
    console.error("[robinhood] Dashboard error:", error)
    redirect("/auth/login")
  }
}
