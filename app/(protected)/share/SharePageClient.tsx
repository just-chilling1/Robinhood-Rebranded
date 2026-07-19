"use client"

import { useEffect, useState } from "react"
import { Facebook, Twitter, Linkedin, Mail, MessageCircle, Copy, Link as LinkIcon, Flame, TrendingUp, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function SharePageClient() {
  const [pages, setPages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPages() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("pages")
        .select("id, title, created_at, views, status, user_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      setPages(data || [])
      setIsLoading(false)
    }

    fetchPages()
  }, [])

  const copyLink = (pageId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/article/${pageId}`)
    setCopiedId(pageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl text-[#7dd3fc] font-bold">Loading your arsenal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#0ea5e9]/20 to-[#ec4899]/20 border-2 border-[#0ea5e9]/40">
          <Target className="w-5 h-5 text-[#ec4899]" />
          <span className="text-sm font-black text-white uppercase tracking-wider">Distribution Command</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Deployment Center</h1>
        <p className="text-2xl text-[#7dd3fc] font-bold">
          Copy links, blast social media, and spread your comment packs everywhere 🚀
        </p>
      </div>

      {!pages || pages.length === 0 ? (
        <Card className="glass-strong border-2 border-[#0ea5e9]/40">
          <CardContent className="p-16 text-center space-y-8">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#ec4899]/20 to-[#f97316]/20 flex items-center justify-center mx-auto border-2 border-[#ec4899]/40">
              <LinkIcon className="w-16 h-16 text-[#ec4899]" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-4">No Packs to Deploy Yet</h2>
              <p className="text-xl text-[#7dd3fc] font-semibold">
                Generate your first comment pack, then come back here to spread it
              </p>
            </div>
            <Button asChild className="h-20 px-12 text-2xl font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] text-white rounded-2xl shadow-2xl">
              <a href="/create">
                <Flame className="w-6 h-6 mr-3" />
                Create First Pack
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pages.map((page) => (
            <Card key={page.id} className="glass-strong border-2 border-[#0ea5e9]/30 hover:border-[#ec4899]/50 transition-all duration-300">
              <CardHeader className="border-b-2 border-[#0ea5e9]/20 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-black text-white mb-3">{page.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#06b6d4]" />
                        <span className="text-[#7dd3fc] font-bold">{page.views || 0} Opens</span>
                      </div>
                      <span className="text-[#7dd3fc]">•</span>
                      <span className="text-[#7dd3fc] font-semibold">
                        Created {new Date(page.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#10b981]/20 border-2 border-[#10b981]/40 text-[#10b981] text-sm font-black">
                    ACTIVE
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Quick Copy Link */}
                <div className="glass rounded-2xl p-4 border-2 border-[#0ea5e9]/30">
                  <div className="flex items-center gap-3">
                    <Input
                      value={`${window.location.origin}/article/${page.id}`}
                      readOnly
                      className="flex-1 bg-transparent border-0 text-white font-mono text-base h-12"
                    />
                    <Button
                      onClick={() => copyLink(page.id)}
                      className={`h-12 px-6 font-black rounded-xl transition-all ${
                        copiedId === page.id
                          ? "bg-[#10b981] text-white"
                          : "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] text-white"
                      }`}
                    >
                      {copiedId === page.id ? (
                        <>✓ Copied!</>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Social Blast Buttons */}
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-white">Social Media Blast:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Button
                      className="h-16 glass-strong hover:scale-105 border-2 border-[#1877f2]/40 hover:border-[#1877f2] hover:text-[#1877f2] transition-all font-bold"
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/article/${page.id}`)}`,
                          "_blank",
                        )
                      }}
                    >
                      <Facebook className="w-5 h-5 mr-2" />
                      Facebook
                    </Button>

                    <Button
                      className="h-16 glass-strong hover:scale-105 border-2 border-[#1da1f2]/40 hover:border-[#1da1f2] hover:text-[#1da1f2] transition-all font-bold"
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/article/${page.id}`)}&text=${encodeURIComponent(page.title)}`,
                          "_blank",
                        )
                      }}
                    >
                      <Twitter className="w-5 h-5 mr-2" />
                      Twitter
                    </Button>

                    <Button
                      className="h-16 glass-strong hover:scale-105 border-2 border-[#0077b5]/40 hover:border-[#0077b5] hover:text-[#0077b5] transition-all font-bold"
                      onClick={() => {
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/article/${page.id}`)}`,
                          "_blank",
                        )
                      }}
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      LinkedIn
                    </Button>

                    <Button
                      className="h-16 glass-strong hover:scale-105 border-2 border-[#25d366]/40 hover:border-[#25d366] hover:text-[#25d366] transition-all font-bold"
                      onClick={() => {
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(`${page.title} - ${window.location.origin}/article/${page.id}`)}`,
                          "_blank",
                        )
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </Button>

                    <Button
                      className="h-16 glass-strong hover:scale-105 border-2 border-[#0ea5e9]/40 hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all font-bold"
                      onClick={() => {
                        window.location.href = `mailto:?subject=${encodeURIComponent(page.title)}&body=${encodeURIComponent(`Check this out: ${window.location.origin}/article/${page.id}`)}`
                      }}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pro Tips */}
      <Card className="glass-strong border-2 border-[#fbbf24]/40">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-[#fbbf24]" />
            Distribution Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-lg">
            <div className="space-y-2">
              <h4 className="font-black text-[#0ea5e9]">💎 Post When It's Hot</h4>
              <p className="text-[#7dd3fc]">
                Peak times: 1-3 PM weekdays for max engagement
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-[#ec4899]">💎 Mix Your Content</h4>
              <p className="text-[#7dd3fc]">
                Don't spam links - add value, then share
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-[#06b6d4]">💎 Track What Works</h4>
              <p className="text-[#7dd3fc]">
                Check your Opens - double down on winners
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-[#10b981]">💎 Be Consistent</h4>
              <p className="text-[#7dd3fc]">
                Daily shares = more eyeballs = more results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
