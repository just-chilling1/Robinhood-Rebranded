import { redirect } from "next/navigation"
import { SUPPORT_PORTAL_URL } from "@/lib/support"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Gem, Sparkles } from "lucide-react"
import { TrainingVideo } from "@/components/training-video"
import { PageHeader } from "@/components/page-header"
import { ACADEMY_TRAINING_VIDEOS } from "@/lib/academy-training-videos"
import {
  PREMIUM_TRAINING_MODULES,
  getPremiumTrainingVimeoId,
} from "@/lib/premium-training-videos"

export default async function TrainingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const premiumTrainings = PREMIUM_TRAINING_MODULES.map((module) => ({
    title: module.title,
    feature: module.feature,
    videoId: getPremiumTrainingVimeoId(module.key),
    description: module.description,
  }))

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Training"
        title="Robinhood Training Center"
        subtitle="Watch the core system videos first, then the premium feature trainings when you unlock each upgrade"
      />

      <div className="glass-strong rounded-2xl border-border/50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
            <Play className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">Complete Training Program</p>
            <p className="text-base text-muted-foreground">
              {ACADEMY_TRAINING_VIDEOS.length} essential videos to master the system +{" "}
              {premiumTrainings.length} premium feature trainings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {ACADEMY_TRAINING_VIDEOS.map((training) => (
          <Card
            key={training.vimeoId}
            className="glass-strong glow-violet overflow-hidden border-border/50 transition-all hover:shadow-xl"
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                <TrainingVideo videoId={training.vimeoId} title={training.title} />

                <div className="flex flex-col justify-center space-y-4 p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-black text-white shadow-lg">
                      {training.step}
                    </div>
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-bold text-accent">
                      {training.duration}
                    </span>
                  </div>
                  <div>
                    <h2 className="mb-3 text-3xl font-bold text-foreground">{training.title}</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">{training.description}</p>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Play className="h-4 w-4" />
                      <span>Watch this video to continue</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6 pt-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#fbbf24]/30 bg-gradient-to-r from-[#fbbf24]/20 to-[#f97316]/20 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#fbbf24]" />
            <span className="text-sm font-black uppercase tracking-widest text-[#fbbf24]">Premium Tier</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">Premium Feature Trainings</h2>
          <p className="text-lg text-muted-foreground">
            Tutorials for Accelerator, Recurring Streams, Social Payouts, and Protector
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {premiumTrainings.map((training) => (
            <Card
              key={training.videoId}
              className="glass-strong overflow-hidden border-2 border-[#fbbf24]/25 transition-all hover:border-[#fbbf24]/50 hover:shadow-xl"
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                  <TrainingVideo videoId={training.videoId} title={training.title} />

                  <div className="flex flex-col justify-center space-y-4 p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f97316] px-4 py-1.5 text-sm font-black uppercase tracking-wider text-[#1a1305]">
                        <Gem className="h-4 w-4" />
                        Premium
                      </span>
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-bold text-accent">
                        {training.feature}
                      </span>
                    </div>
                    <div>
                      <h2 className="mb-3 text-3xl font-bold text-foreground">{training.title}</h2>
                      <p className="text-lg leading-relaxed text-muted-foreground">{training.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="glass-strong glow-jade border-border/50">
        <CardContent className="space-y-4 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Play className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold text-foreground">Need More Help?</h3>
            <a
              href={SUPPORT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-lg font-semibold text-[#06b6d4] underline decoration-2 decoration-[#06b6d4] underline-offset-4 hover:text-[#0ea5e9] hover:decoration-[#0ea5e9]"
            >
              Questions about the training? Visit our support portal anytime for help
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
