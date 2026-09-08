"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wallet,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { GenerationProgress } from "@/components/generation-progress"
import { SavedLinksPicker } from "@/components/saved-links-picker"
import { Button } from "@/components/ui/button"
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

const STEPS = [
  {
    num: "1",
    title: "Add your link",
    desc: "Paste an affiliate URL or pick one from Link Vault.",
  },
  {
    num: "2",
    title: "Pick a niche",
    desc: "Choose the niche so videos, article tone, and posts stay on-brand.",
  },
  {
    num: "3",
    title: "Generate your kit",
    desc: "We find 5 videos, write an authority article, and draft Facebook posts.",
  },
]

type Stage = "idle" | "videos" | "article" | "posts" | "done"

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  videos: "Finding your videos…",
  article: "Writing your authority article…",
  posts: "Generating Facebook posts…",
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
  const [retryingArticle, setRetryingArticle] = useState(false)
  const [retryingPosts, setRetryingPosts] = useState(false)

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
    setRetryingArticle(true)
    try {
      setArticle(await runArticle(context))
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    } finally {
      setRetryingArticle(false)
    }
  }

  const handleRetryPosts = async () => {
    setPostsError("")
    setRetryingPosts(true)
    try {
      const result = await runPosts(
        { productName: context.productName, niche: context.niche },
        article?.url ?? null,
      )
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    } finally {
      setRetryingPosts(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 page-enter">
      <PageHeader
        eyebrow="Premium"
        title="Done-For-You Profit"
        subtitle="Paste your affiliate link, pick a niche, and get 5 videos to comment on, an authority article, and Facebook posts in one run."
      />

      {/* How-to steps — blackbox PremiumStepsSection shape */}
      <section className="glass-card p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <CheckCircle2 className="h-[22px] w-[22px] text-sapphire-700" />
          <h2 className="text-xl font-medium text-foreground">How to Use This (3 Simple Steps)</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-200 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grad-sapphire text-sm font-medium text-white shadow-sapphire">
                {step.num}
              </div>
              <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Control card — blackbox PremiumControlCard shape */}
      <section className="glass-card overflow-hidden p-0">
        <div className="border-b border-border bg-sapphire-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--ds-line-sapphire)] bg-white text-sapphire-700">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-foreground">Generate your kit</p>
              <p className="text-sm text-muted-foreground">
                One click creates 5 comment-ready videos, a hosted authority article, and Facebook posts.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 md:p-6">
          <div className="space-y-2">
            <span className="block text-sm font-medium text-foreground">Affiliate link</span>
            {savedLinks.length > 0 ? (
              <SavedLinksPicker
                links={savedLinks}
                selectedId={selectedLinkId}
                onSelect={(link) => {
                  setSelectedLinkId(link.id)
                  setAffiliateUrl(link.affiliate_url)
                  setOfferName(link.offer_name)
                  setError("")
                }}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                No saved links yet. Paste a link below or{" "}
                <Link href="/share" className="font-medium text-sapphire-700 underline-offset-4 hover:underline">
                  open Link Vault
                </Link>
                .
              </p>
            )}
            <Input
              id="dfy-profit-affiliate-link"
              type="url"
              value={affiliateUrl}
              onChange={(event) => {
                setAffiliateUrl(event.target.value)
                setSelectedLinkId(null)
                setOfferName("")
                setError("")
              }}
              placeholder="https://..."
              disabled={generating}
              className="rounded-3xl"
            />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-foreground">2. Niche</legend>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-200/40 p-3">
              {NICHES.map((option) => {
                const selected = niche === option
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={generating}
                    aria-pressed={selected}
                    onClick={() => setNiche(option)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all disabled:opacity-50 ${
                      selected
                        ? "border-[2.5px] border-sapphire-700 bg-white text-sapphire-700 shadow-[0_0_0_3px_rgba(52,120,246,0.28),0_4px_14px_-4px_rgba(52,120,246,0.45)] ring-1 ring-sapphire-500/40"
                        : "border border-[var(--ds-line)] bg-card text-text-secondary hover:border-[var(--ds-line-sapphire)] hover:text-ink"
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5 shrink-0 text-sapphire-700" strokeWidth={2.75} aria-hidden />}
                    {option}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <Button
            type="button"
            disabled={generating}
            onClick={() => void handleGenerate()}
            className="btn-primary inline-flex h-11 items-center gap-2 transition-[transform,box-shadow,filter,background] duration-200 hover:-translate-y-1 hover:scale-[1.04] hover:brightness-110 hover:shadow-[0_10px_28px_-6px_rgba(52,120,246,0.65)] active:translate-y-0 active:scale-100 active:brightness-100 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-[var(--ds-shadow-sapphire)]"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Generating…" : videos.length > 0 ? "Generate another kit" : "Generate kit"}
          </Button>
        </div>
      </section>

      {generating && (
        <GenerationProgress
          label={STAGE_LABELS[stage as Exclude<Stage, "idle" | "done">]}
          offer="welcome"
        />
      )}

      <DfyResultPanel
        videos={videos}
        article={article}
        posts={posts}
        articleError={articleError}
        postsError={postsError}
        usedFallbackLink={usedFallbackLink}
        isGeneratingArticle={stage === "article"}
        isGeneratingPosts={stage === "posts"}
        retryingArticle={retryingArticle}
        retryingPosts={retryingPosts}
        onRetryArticle={() => void handleRetryArticle()}
        onRetryPosts={() => void handleRetryPosts()}
      />

      <p className="pb-4 text-center text-sm text-muted-foreground">
        Hosted articles appear in My Vault. Individual results vary.
      </p>
    </div>
  )
}
