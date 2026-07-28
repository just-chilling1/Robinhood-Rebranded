"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, ExternalLink, Sparkles, ShieldCheck } from "lucide-react"

type CommentPack = {
  version: number
  videoId: string
  videoUrl: string
  videoTitle: string
  channelTitle?: string
  createdAt?: string
  comments: string[]
  tips?: string[]
}

export function CommentPackViewer({
  pageId,
  pack,
}: {
  pageId: string
  pack: CommentPack
}) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const comments = useMemo(() => (Array.isArray(pack.comments) ? pack.comments : []).filter(Boolean), [pack.comments])
  const tips = useMemo(() => (Array.isArray(pack.tips) ? pack.tips : []), [pack.tips])

  useEffect(() => {
    // Track "open" (stored as views in existing schema). Best-effort only.
    fetch("/api/track-open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    }).catch(() => {})
  }, [pageId])

  const trackCopy = async () => {
    // Track "copy" (stored as clicks in existing schema). Best-effort only.
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      })
    } catch {
      // ignore
    }
  }

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text)
    await trackCopy()
  }

  const handleCopyOne = async (idx: number) => {
    const text = comments[idx]
    if (!text) return
    await copyText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1200)
  }

  const handleCopyAll = async () => {
    if (comments.length === 0) return
    const text = comments.map((c) => `- ${c}`).join("\n")
    await copyText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1200)
  }

  const top5 = comments.slice(0, 5)

  return (
    <div className="min-h-screen bg-[#0A0E12] px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">RH Comment Pack</p>
          <h1 className="text-3xl md:text-5xl font-black text-foreground text-balance">{pack.videoTitle}</h1>
          <p className="text-base text-muted-foreground">
            {pack.channelTitle ? `Channel: ${pack.channelTitle}` : "Pick a comment, tweak 1–2 words, and post early."}
          </p>
        </div>

        <Card className="glass-strong border-border/50">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Quick Start (30 seconds)
            </CardTitle>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="glass rounded-xl p-4">
                <p className="font-semibold text-foreground mb-2">Do this</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- Post within the first 30–90 minutes</li>
                  <li>- Use 1 question + 1 compliment + 1 value-add</li>
                  <li>- Reply to anyone who responds</li>
                </ul>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Keep it safe
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- No links</li>
                  <li>- No “DM me” spam</li>
                  <li>- No income promises</li>
                </ul>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="h-12 font-bold glow-cyan flex-1">
                <a href={pack.videoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open the Short
                </a>
              </Button>
              <Button onClick={handleCopyAll} variant="outline" className="h-12 glass bg-transparent flex-1">
                <Copy className="w-5 h-5 mr-2" />
                {copiedAll ? "Copied!" : "Copy ALL comments"}
              </Button>
            </div>

            {tips.length > 0 && (
              <div className="glass rounded-xl p-4">
                <p className="font-semibold text-foreground mb-2">Tips</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {tips.slice(0, 5).map((t, i) => (
                    <li key={i}>- {t}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Top 5 (fastest)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {top5.map((c, idx) => (
              <div key={idx} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="flex-1 text-foreground">{c}</p>
                <Button onClick={() => handleCopyOne(idx)} className="h-11 font-bold">
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedIdx === idx ? "Copied!" : "Copy"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">All comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {comments.map((c, idx) => (
              <div key={idx} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="flex-1 text-muted-foreground">{c}</p>
                <Button onClick={() => handleCopyOne(idx)} variant="outline" className="h-11 glass bg-transparent">
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedIdx === idx ? "Copied!" : "Copy"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


