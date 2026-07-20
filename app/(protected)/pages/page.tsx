import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Copy, Calendar, Zap, Flame, ExternalLink, Youtube, MessageCircle } from "lucide-react"
import Link from "next/link"
import { PageActions } from "@/components/page-actions"
import { InfoHint } from "@/components/ui/info-hint"
import { EarningsBanner } from "@/components/earnings-banner"
import { PageHeader } from "@/components/page-header"
import { Fragment } from "react"

export default async function MyVaultPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's pages with niche details
  const { data: pages } = await supabase
    .from("pages")
    .select(
      `
      *,
      niches (name, icon)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="My Vault"
        title="Your Comment Vault"
        subtitle="All your AI-generated comment packs in one place 🔥"
        actions={
          <Button asChild className="h-14 sm:h-16 w-full sm:w-auto px-8 text-lg font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] text-white rounded-2xl shadow-lg" size="lg">
            <Link href="/create">
              <Flame className="w-5 h-5 mr-2" />
              Generate New Pack
            </Link>
          </Button>
        }
      />

      {!pages || pages.length === 0 ? (
        <Card className="glass-strong border-2 border-[#0ea5e9]/40">
          <CardContent className="p-16 text-center space-y-8">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#0ea5e9]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto border-2 border-[#0ea5e9]/40">
              <Zap className="w-16 h-16 text-[#0ea5e9]" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-4">Your Vault is Empty</h2>
              <p className="text-xl text-[#7dd3fc] font-semibold max-w-xl mx-auto">
                Fire up the Gold Rush Generator and create your first AI comment pack in 60 seconds
              </p>
            </div>
            <Button asChild className="h-20 px-12 text-2xl font-black bg-gradient-to-r from-[#0ea5e9] to-[#ec4899] hover:from-[#ec4899] hover:to-[#0ea5e9] text-white rounded-2xl shadow-2xl" size="lg">
              <Link href="/create">
                <Flame className="w-6 h-6 mr-3" />
                Start Making Packs Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pages.map((page, index) => {
            // Parse comment pack to get the comments themselves
            let comments: string[] = []
            try {
              const pack = JSON.parse(page.content || '{"comments":[]}')
              comments = Array.isArray(pack.comments) ? pack.comments : Array.isArray(pack) ? pack : []
            } catch {
              comments = []
            }
            const commentCount = comments.length

            return (
              <Fragment key={page.id}>
              <Card className="glass-strong border-2 border-[#0ea5e9]/30 hover:border-[#ec4899]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#ec4899]/10">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9]/30 to-[#ec4899]/30 flex items-center justify-center text-3xl border-2 border-[#0ea5e9]/40">
                          {page.niches?.icon || "💎"}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-black text-white mb-1">{page.offer_name || "Comment Pack"}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-[#7dd3fc]">
                            <Youtube className="w-4 h-4" />
                            <span className="font-semibold truncate">{page.video_title || page.title}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* What to do card */}
                      <div className="glass rounded-xl p-4 border-2 border-[#06b6d4]/30 bg-gradient-to-r from-[#06b6d4]/10 to-[#0ea5e9]/10">
                        <div className="flex items-start gap-3">
                          <MessageCircle className="w-5 h-5 text-[#06b6d4] mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-bold text-white mb-1">💰 How to Use This Pack:</p>
                            <ol className="text-[#7dd3fc] space-y-1 list-decimal list-inside">
                              <li className="font-semibold">Click <span className="text-white">"View Comments"</span> below</li>
                              <li className="font-semibold">Copy any comment you like (one-click copy)</li>
                              <li className="font-semibold">Click <span className="text-white">"Open Video"</span> to go to the YouTube Short</li>
                              <li className="font-semibold">Paste the comment on the video</li>
                              <li className="font-semibold">Your profile drives traffic to your affiliate link 🔥</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="glass rounded-xl p-3 text-center border-2 border-[#ec4899]/30 bg-gradient-to-br from-[#ec4899]/10 to-[#f97316]/10">
                      <MessageCircle className="w-5 h-5 text-[#ec4899] mx-auto mb-1" />
                      <p className="text-2xl font-black text-white">{commentCount}</p>
                      <p className="text-xs text-[#7dd3fc] font-bold mt-0.5">Comments</p>
                    </div>
                    <div className="glass rounded-xl p-3 text-center border-2 border-[#0ea5e9]/30">
                      <Eye className="w-5 h-5 text-[#0ea5e9] mx-auto mb-1" />
                      <p className="text-2xl font-black text-white">{page.views || 0}</p>
                      <p className="text-xs text-[#7dd3fc] font-bold mt-0.5 flex items-center justify-center gap-1">
                        Opens
                        <InfoHint label="How many times people have opened this comment pack." />
                      </p>
                    </div>
                    <div className="glass rounded-xl p-3 text-center border-2 border-[#06b6d4]/30">
                      <Copy className="w-5 h-5 text-[#06b6d4] mx-auto mb-1" />
                      <p className="text-2xl font-black text-white">{page.clicks || 0}</p>
                      <p className="text-xs text-[#7dd3fc] font-bold mt-0.5 flex items-center justify-center gap-1">
                        Copies
                        <InfoHint label="How many times a comment from this pack has been copied." />
                      </p>
                    </div>
                    <div className="glass rounded-xl p-3 text-center border-2 border-[#a855f7]/30">
                      <Calendar className="w-5 h-5 text-[#a855f7] mx-auto mb-1" />
                      <p className="text-xs font-black text-white leading-tight">
                        {new Date(page.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[#7dd3fc] font-bold mt-0.5">Created</p>
                    </div>
                  </div>

                  <PageActions pageId={page.id} affiliateLink={page.video_url || page.affiliate_link} videoUrl={page.video_url} comments={comments} />
                </CardContent>
              </Card>
              {(index + 1) % 2 === 0 && <EarningsBanner />}
              </Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
