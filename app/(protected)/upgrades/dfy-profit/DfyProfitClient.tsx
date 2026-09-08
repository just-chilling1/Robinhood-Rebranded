"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { GenerationProgress } from "@/components/generation-progress"
import { SavedLinksPicker } from "@/components/saved-links-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import type { AffiliateLink } from "@/app/actions/affiliate-links"
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"
import { DfyResultPanel } from "./DfyResultPanel"

const NICHES = [
  "Weight Loss",
  "Make Money Online",
  "Health & Fitness",
  "Beauty & Skincare",
  "Relationships",
  "Tech & Gadgets",
  "Pets",
  "Home & Garden",
]

type Stage = "idle" | "videos" | "article" | "posts" | "done"

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  videos: "Finding your videos...",
  article: "Writing your authority article...",
  posts: "Generating Facebook posts...",
}

export default function DfyProfitClient({ savedLinks }: { savedLinks: AffiliateLink[] }) {
  const [affiliateUrl, setAffiliateUrl] = useState("")
  const [offerName, setOfferName] = useState("")
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [niche, setNiche] = useState("")
  const [stage, setStage] = useState<Stage>("idle")
  const [error, setError] = useState("")

  const [videos, setVideos] = useState<DfyVideoResult[]>([])
  const [article, setArticle] = useState<DfyArticleResult | null>(null)
  const [posts, setPosts] = useState<DfyFacebookPost[]>([])
  const [articleError, setArticleError] = useState("")
  const [postsError, setPostsError] = useState("")
  const [usedFallbackLink, setUsedFallbackLink] = useState(false)
  const [context, setContext] = useState({ productName: "", productContext: "", niche: "" })

  const generating = stage === "videos" || stage === "article" || stage === "posts"

  const runArticle = async (ctx: { productName: string; productContext: string; niche: string }) => {
    const response = await fetch("/api/premium/dfy-profit/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateUrl, ...ctx }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Article generation failed")
    return data as DfyArticleResult
  }

  const runPosts = async (ctx: { productName: string; niche: string }, articleUrl: string | null) => {
    const response = await fetch("/api/premium/dfy-profit/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateUrl, articleUrl: articleUrl ?? undefined, ...ctx }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Facebook post generation failed")
    return data as { posts: DfyFacebookPost[]; usedFallbackLink: boolean }
  }

  const handleGenerate = async () => {
    if (!isValidAffiliateUrl(affiliateUrl)) {
      setError("Enter a valid affiliate URL starting with https://")
      return
    }
    if (!niche) {
      setError("Pick a niche first.")
      return
    }

    setError("")
    setArticleError("")
    setPostsError("")
    setVideos([])
    setArticle(null)
    setPosts([])
    setStage("videos")

    let ctx = { productName: "", productContext: "", niche }

    try {
      const response = await fetch("/api/premium/dfy-profit/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateUrl, niche, offerName: offerName || undefined }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Video search failed")

      setVideos(data.videos)
      ctx = { productName: data.productName, productContext: data.productContext, niche: data.niche }
      setContext(ctx)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Video search failed")
      setStage("idle")
      return
    }

    setStage("article")
    let articleUrl: string | null = null
    try {
      const result = await runArticle(ctx)
      setArticle(result)
      articleUrl = result.url
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    }

    setStage("posts")
    try {
      const result = await runPosts({ productName: ctx.productName, niche: ctx.niche }, articleUrl)
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    }

    setStage("done")
  }

  const handleRetryArticle = async () => {
    setArticleError("")
    setStage("article")
    try {
      setArticle(await runArticle(context))
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    } finally {
      setStage("done")
    }
  }

  const handleRetryPosts = async () => {
    setPostsError("")
    setStage("posts")
    try {
      const result = await runPosts({ productName: context.productName, niche: context.niche }, article?.url ?? null)
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    } finally {
      setStage("done")
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Premium"
        title="Done-For-You Profit"
        subtitle="Paste your affiliate link, pick a niche, and get 5 videos to comment on, an authority article, and 3 Facebook posts in one run."
      />

      <Card className="glass-card border-border">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="dfy-profit-link" className="text-sm font-medium text-foreground">
              1. Your affiliate link
            </label>
            <Input
              id="dfy-profit-link"
              value={affiliateUrl}
              onChange={(event) => setAffiliateUrl(event.target.value)}
              placeholder="https://..."
              disabled={generating}
            />
            {savedLinks.length > 0 && (
              <SavedLinksPicker
                links={savedLinks}
                selectedId={selectedLinkId}
                onSelect={(link) => {
                  setSelectedLinkId(link.id)
                  setAffiliateUrl(link.affiliate_url)
                  setOfferName(link.offer_name)
                }}
              />
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">2. Pick a niche</legend>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={generating}
                  onClick={() => setNiche(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    niche === option
                      ? "border-[#2563EB] bg-[#EEF4FF] text-[#1d4ed8]"
                      : "border-border bg-card text-muted-foreground hover:border-[#2563EB]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button onClick={handleGenerate} disabled={generating} className="h-12 w-full text-base font-semibold sm:w-auto">
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Generating..." : videos.length > 0 ? "Generate another kit" : "Generate my kit"}
          </Button>
        </CardContent>
      </Card>

      {generating && <GenerationProgress label={STAGE_LABELS[stage as Exclude<Stage, "idle" | "done">]} offer="welcome" />}

      <DfyResultPanel
        videos={videos}
        article={article}
        posts={posts}
        articleError={articleError}
        postsError={postsError}
        usedFallbackLink={usedFallbackLink}
        isGeneratingArticle={stage === "article"}
        isGeneratingPosts={stage === "posts"}
        onRetryArticle={handleRetryArticle}
        onRetryPosts={handleRetryPosts}
      />
    </div>
  )
}
