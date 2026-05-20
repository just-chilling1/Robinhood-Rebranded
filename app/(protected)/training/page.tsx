import { redirect } from "next/navigation"
import { SUPPORT_PORTAL_URL } from "@/lib/support"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">Robinhood Training Center</h1>
        <p className="text-xl text-muted-foreground">
          Follow these 5 simple steps to comment safely and build engagement over time
        </p>
      </div>

      <div className="glass-strong border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">Complete Training Program</p>
            <p className="text-base text-muted-foreground">2 essential videos to master the system</p>
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
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://player.vimeo.com/video/${training.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    title={training.title}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>

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

      <Card className="glass-strong glow-jade border-border/50">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <Play className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Need More Help?</h3>
            <p className="text-lg text-muted-foreground">
              Questions about the training? Visit our{" "}
              <a
                href={SUPPORT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-bold"
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
