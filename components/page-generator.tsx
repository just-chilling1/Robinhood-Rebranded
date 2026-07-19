"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Sparkles, CheckCircle2, Clock, ExternalLink, Copy } from "lucide-react"
import { useRouter } from 'next/navigation'
import fetchTrendingShorts from "@/app/actions/fetch-trending-shorts"
import generateCommentPackAction from "@/app/actions/generate-comment-pack"

interface PageGeneratorProps {
  nicheId: string
  categoryName: string
  onBack: () => void
  affiliateLink?: string
  offerName?: string
}

export function PageGenerator({ nicheId, categoryName, onBack, affiliateLink, offerName }: PageGeneratorProps) {
  const [shorts, setShorts] = useState<any[]>([])
  const [loadingShorts, setLoadingShorts] = useState(true)
  const [shortsError, setShortsError] = useState<string | null>(null)
  const [selectedShort, setSelectedShort] = useState<any | null>(null)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [generatedComments, setGeneratedComments] = useState<string[] | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const messages = [
    "🤖 AI Agent: Scanning video content patterns...",
    "🧠 Neural Network: Processing engagement hooks...",
    "✨ AI Writer: Crafting authentic comment variations...",
    "🎯 Context Engine: Optimizing for platform algorithms...",
    "⚡ Quality Check: Ensuring natural human-like tone...",
    "🎁 Packaging: Finalizing your engagement arsenal...",
  ]

  useEffect(() => {
    async function loadShorts() {
      setLoadingShorts(true)
      setShortsError(null)
      try {
        // We use the niche/category selection as a keyword signal.
        const res = await fetchTrendingShorts(categoryName)
        if (!res.success) {
          setShortsError(res.error || "Showing sample results.")
        }
        setShorts(res.shorts || [])
      } catch (e) {
        console.error("[commentai] Failed to load shorts:", e)
        setShortsError("AI Agent: Could not fetch live data. Showing demo results.")
        setShorts([])
      } finally {
        setLoadingShorts(false)
      }
    }
    loadShorts()
  }, [nicheId, categoryName])

  useEffect(() => {
    if (generating && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [generating, timeRemaining])

  const handleGenerate = async () => {
    if (!selectedShort) {
      alert("Please pick a Short first.")
      return
    }

    setGenerating(true)
    setProgress(0)
    setTimeRemaining(30)
    setGeneratedComments(null)
    setCopied(false)

    let messageIndex = 0
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 7.5
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return newProgress
      })

      if (messageIndex < messages.length) {
        setCurrentMessage(messages[messageIndex])
        messageIndex++
      }
    }, 1000)

    try {
      const result = await generateCommentPackAction({
        nicheId,
        videoId: selectedShort.videoId,
        videoTitle: selectedShort.title,
        channelTitle: selectedShort.channelTitle,
        affiliateLink,
        offerName,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!result.success) {
        throw new Error(result.error || "Failed to generate page")
      }

      setGeneratedComments((result as any).previewComments || null)
      setSuccess(true)

      setTimeout(() => {
        router.push("/pages")
      }, 3000)
    } catch (error) {
      clearInterval(progressInterval)
      console.error("[v0] Error generating page:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate comments. Please try again."
      alert(errorMessage)
      setGenerating(false)
      setProgress(0)
      setTimeRemaining(30)
    }
  }

  const handleCopy = async () => {
    if (!generatedComments || generatedComments.length === 0) return
    const text = generatedComments.map((c) => `- ${c}`).join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (success) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="glass-strong glow-gold border-2 border-[#fbbf24]/40 max-w-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#fb923c] flex items-center justify-center mx-auto glow-gold shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-[#0d0a1a]" />
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">AI Task Complete!</h2>
              <p className="text-xl text-[#c4b5fd] font-semibold">Your engagement pack is secured. Redirecting to vault...</p>
            </div>
            {generatedComments && (
              <div className="glass rounded-xl p-4 text-left space-y-3">
                <p className="text-base font-semibold text-foreground">Quick copy (preview)</p>
                <div className="space-y-2">
                  {generatedComments.slice(0, 5).map((c, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      • {c}
                    </p>
                  ))}
                </div>
                <Button onClick={handleCopy} className="w-full h-12 font-bold">
                  <Copy className="w-5 h-5 mr-2" />
                  {copied ? "Copied!" : "Copy these 5"}
                </Button>
              </div>
            )}
            <div className="pt-4">
              <p className="text-lg text-accent font-semibold animate-pulse">Redirecting to your pages...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} disabled={generating} className="h-12 glass bg-transparent">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Deploy AI Content Scout</h2>
        <p className="text-xl text-[#c4b5fd] font-semibold">Select a trending Short and let the AI generate your engagement pack</p>
      </div>

      <Card className="glass-strong glow-purple border-2 border-[#a855f7]/40">
        <CardContent className="p-8 space-y-6">
          <div className="bg-[#a855f7]/10 rounded-2xl p-6 border-2 border-[#a855f7]/30 space-y-3">
            <h3 className="text-2xl font-extrabold text-[#a855f7] flex items-center gap-2">
              <Sparkles className="w-7 h-7" />
              AI Agent Instructions
            </h3>
            <ul className="space-y-2 text-base text-[#c4b5fd] font-semibold">
              <li>✓ Copy one comment, personalize 1–2 words before posting</li>
              <li>✓ Ask real questions (questions get more replies)</li>
              <li>✓ Avoid links or "DM me" patterns (flagged as spam)</li>
              <li>✓ This boosts engagement—not a guaranteed income tool</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">Trending Shorts (pick one)</p>
            {loadingShorts ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {shortsError && <p className="text-sm text-muted-foreground">{shortsError}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(shorts || []).slice(0, 8).map((s) => {
                    const isSelected = selectedShort?.videoId === s.videoId
                    return (
                      <button
                        key={s.videoId}
                        type="button"
                        onClick={() => setSelectedShort(s)}
                        className={`text-left glass rounded-xl p-4 border transition-all ${
                          isSelected ? "border-accent glow-jade" : "border-border/50 hover:glow-cyan"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-24 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {s.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground truncate">{s.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{s.channelTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {(s.viewCount || 0).toLocaleString()} views
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {selectedShort && (
                  <div className="flex items-center justify-between gap-3 glass rounded-xl p-4">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Selected</p>
                      <p className="font-semibold text-foreground truncate">{selectedShort.title}</p>
                    </div>
                    <Button asChild variant="outline" className="glass bg-transparent">
                      <a href={selectedShort.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {generating && (
            <div className="space-y-6 py-6">
              <div className="flex flex-col items-center justify-center gap-2 p-8 glass-strong rounded-2xl border-4 border-[#a855f7]/70 glow-purple bg-gradient-to-br from-[#a855f7]/10 to-[#fbbf24]/10">
                <Clock className="w-12 h-12 text-[#a855f7] animate-pulse mb-2" />
                <div className="text-center">
                  <p className="text-5xl font-black text-[#a855f7] mb-1">{timeRemaining}s</p>
                  <p className="text-lg font-bold text-white">AI Processing Time</p>
                  <p className="text-sm text-[#c4b5fd] mt-1">Neural network analyzing content...</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#a855f7]" />
                <p className="text-lg font-semibold text-white">{currentMessage}</p>
              </div>
              <div className="w-full h-4 rounded-full bg-[#231d35] overflow-hidden border-2 border-[#a855f7]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#a855f7] to-[#fbbf24] glow-purple transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-base text-[#c4b5fd] font-bold">{progress}% Complete</p>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedShort}
            className="w-full h-16 text-xl font-extrabold glow-purple bg-gradient-to-r from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] rounded-2xl"
          >
            {generating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                AI Agent Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                Launch AI Generator
              </>
            )}
          </Button>

          <div className="glass rounded-2xl p-5 space-y-3 border-2 border-[#fbbf24]/30">
            <p className="text-lg font-extrabold text-[#fbbf24]">AI Output Preview:</p>
            <ul className="space-y-2 text-base text-[#c4b5fd]">
              <li>✓ Variety pack of natural-sounding comments</li>
              <li>✓ Includes questions + value statements + reactions</li>
              <li>✓ Saved to your vault for reuse anytime</li>
              <li>✓ Focus: engagement quality, not income promises</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
