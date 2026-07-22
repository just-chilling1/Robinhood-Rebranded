import { redirect } from "next/navigation"
import { SUPPORT_PORTAL_URL } from "@/lib/support"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Gem, Sparkles } from "lucide-react"
import { TrainingVideo } from "@/components/training-video"
import { PageHeader } from "@/components/page-header"

export default async function TrainingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const trainingSteps = [
    {
      step: 1,
      title: "Gold Rush Training",
      description: "Learn how to use the Gold Rush Generator to find viral opportunities and generate money-making comments",
      videoId: "1151044475",
      duration: "10 min",
    },
    {
      step: 2,
      title: "My Vault Training",
      description: "Master the My Vault system to manage your comment packs and track your results effectively",
      videoId: "1151044790",
      duration: "12 min",
    },
  ]

  const premiumTrainings = [
    {
      title: "Accelerator Training",
      feature: "Accelerator",
      videoId: "1151044893",
      description: "Watch this first to maximize your results with the 200+ Accelerator videos and ready-made comment packs",
    },
    {
      title: "Recurring Streams Training",
      feature: "Recurring Streams",
      videoId: "1151045100",
      description: "Learn how to copy the 200+ proven Facebook posts and start making money today",
    },
    {
      title: "Social Payouts Training",
      feature: "Social Payouts",
      videoId: "1151045210",
      description: "Learn how to submit your link to 100+ traffic sources and get automated traffic forever",
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Training"
        title="Robinhood Training Center"
        subtitle="Follow these 5 simple steps to comment safely and build engagement over time"
      />

      <div className="glass-strong border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">Complete Training Program</p>
            <p className="text-base text-muted-foreground">
              2 essential videos to master the system + {premiumTrainings.length} premium feature trainings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {trainingSteps.map((training) => (
          <Card
            key={training.step}
            className="glass-strong border-border/50 glow-violet overflow-hidden hover:shadow-xl transition-all"
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Video Player */}
                <TrainingVideo videoId={training.videoId} title={training.title} />

                {/* Video Info */}
                <div className="p-8 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-white shadow-lg">
                      {training.step}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                      {training.duration}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-3">{training.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{training.description}</p>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Play className="w-4 h-4" />
                      <span>Watch this video to continue</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium Feature Trainings */}
      <div className="space-y-6 pt-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#fbbf24]/30 bg-gradient-to-r from-[#fbbf24]/20 to-[#f97316]/20 px-4 py-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-sm font-black uppercase tracking-widest text-[#fbbf24]">Premium Tier</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Premium Feature Trainings</h2>
          <p className="text-lg text-muted-foreground">
            Tutorials for Accelerator, Recurring Streams and Social Payouts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {premiumTrainings.map((training) => (
            <Card
              key={training.videoId}
              className="glass-strong border-2 border-[#fbbf24]/25 overflow-hidden hover:border-[#fbbf24]/50 hover:shadow-xl transition-all"
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Video Player */}
                  <TrainingVideo videoId={training.videoId} title={training.title} />

                  {/* Video Info */}
                  <div className="p-8 flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f97316] px-4 py-1.5 text-sm font-black uppercase tracking-wider text-[#1a1305]">
                        <Gem className="w-4 h-4" />
                        Premium
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                        {training.feature}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-3">{training.title}</h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">{training.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="glass-strong glow-jade border-border/50">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <Play className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Need More Help?</h3>
            <p className="text-lg font-semibold text-[#c7e8ff]">
              Questions about the training? Visit our{" "}
              <a
                href={SUPPORT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#06b6d4] underline underline-offset-4 decoration-2 hover:text-[#0ea5e9]"
              >
                support portal
              </a>{" "}
              anytime for help
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
