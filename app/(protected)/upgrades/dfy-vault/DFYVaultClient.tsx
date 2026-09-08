"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoHint } from "@/components/ui/info-hint"
import {
  Loader2,
  Search,
  Youtube,
  Copy,
  Check,
  Eye,
  TrendingUp,
  Flame,
  Zap,
  AlertTriangle,
  ArrowRight,
  Gem,
  Link2,
  Tag,
} from "lucide-react"
import { fetchDFYLibrary, searchDFYVideos, type DFYVideo } from "@/app/actions/fetch-dfy-library"
import { GenerationProgress } from "@/components/generation-progress"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import { PageHeader } from "@/components/page-header"
import { PremiumFeatureBanner, PremiumSteps } from "@/components/premium-feature-chrome"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { cn } from "@/lib/utils"

const UNLIMITED_STEPS = [
  {
    num: "1",
    title: "Lock in your offer",
    desc: "Add the product name and money link once. Unlimited inserts them for you.",
  },
  {
    num: "2",
    title: "Browse ready videos",
    desc: "Open a vault of high-view Shorts already matched to popular niches.",
  },
  {
    num: "3",
    title: "Copy and post",
    desc: "Each video has 5 comments with your offer inside. Paste and go.",
  },
] as const

const primaryCtaClass =
  "rounded-xl bg-primary font-semibold text-white shadow-[var(--ds-shadow-sapphire)] transition-colors hover:bg-primary-hover"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line)] bg-card font-semibold text-ink transition-colors hover:border-ink hover:bg-surface-nested"

type FieldKey = "productName" | "productLink"
type FieldErrors = Partial<Record<FieldKey, string>>

export default function DFYVaultClient() {
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<DFYVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<DFYVideo[]>([])
  const [selectedNiche, setSelectedNiche] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [liveSearching, setLiveSearching] = useState(false)
  const [liveResults, setLiveResults] = useState<DFYVideo[] | null>(null)

  const [productName, setProductName] = useState("")
  const [productLink, setProductLink] = useState("")
  const [productSelected, setProductSelected] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [productError, setProductError] = useState<string | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const prevUnlocking = useRef(false)
  const prevLiveSearching = useRef(false)

  const libraryResultsRef = useScrollToResults(prevUnlocking.current && !unlocking && productSelected)
  const searchResultsRef = useScrollToResults(
    prevLiveSearching.current &&
      !liveSearching &&
      searchQuery.trim().length > 0 &&
      (liveResults?.length ?? 0) > 0
  )

  useEffect(() => {
    prevUnlocking.current = unlocking
  }, [unlocking])

  useEffect(() => {
    prevLiveSearching.current = liveSearching
  }, [liveSearching])

  const [copiedComment, setCopiedComment] = useState<string | null>(null)

  useEffect(() => {
    loadLibrary()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [selectedNiche, searchQuery, videos])

  const loadLibrary = async () => {
    setLoading(true)
    const library = await fetchDFYLibrary()
    setVideos(library)
    setFilteredVideos(library)
    setLoading(false)
  }

  const matchesQuery = (video: DFYVideo, query: string) => {
    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length >= 2)
    if (words.length === 0) return true
    const haystack = `${video.title} ${video.channelTitle} ${video.niche}`.toLowerCase()
    return words.some((w) => haystack.includes(w))
  }

  const filterVideos = () => {
    let filtered = videos

    if (selectedNiche !== "all") {
      filtered = filtered.filter((v) => v.niche === selectedNiche)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((v) => matchesQuery(v, searchQuery.trim()))
    }

    setFilteredVideos(filtered)
  }

  useEffect(() => {
    const query = searchQuery.trim()
    setLiveResults(null)

    if (query.length < 3 || loading) {
      setLiveSearching(false)
      return
    }

    const localMatches = videos.filter(
      (v) => (selectedNiche === "all" || v.niche === selectedNiche) && matchesQuery(v, query)
    )
    if (localMatches.length > 0) {
      setLiveSearching(false)
      return
    }

    let cancelled = false
    setLiveSearching(true)

    const timer = setTimeout(async () => {
      const results = await searchDFYVideos(query)
      if (cancelled) return
      setLiveResults(results)
      setLiveSearching(false)
    }, 700)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchQuery, selectedNiche, videos, loading])

  const clearFieldError = (key: FieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validateProduct = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!productName.trim()) {
      next.productName = "Add the name of the product or offer you're promoting."
    }
    if (!productLink.trim()) {
      next.productLink = "Paste your affiliate link so it can go inside the comments."
    } else if (!isValidAffiliateUrl(productLink)) {
      next.productLink = "Use a full link that starts with http:// or https://"
    }
    return next
  }

  const handleSelectProduct = (event?: FormEvent) => {
    event?.preventDefault()
    const nextErrors = validateProduct()
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setProductError("Fill in the highlighted fields to continue.")
      return
    }
    setFieldErrors({})
    setProductError(null)
    setUnlocking(true)
    setTimeout(() => {
      setUnlocking(false)
      setProductSelected(true)
    }, 4000)
  }

  const handleCopyComment = async (comment: string, videoId: string, index: number) => {
    const personalizedComment = comment
      .replace(/\[PRODUCT\]/g, productName)
      .replace(/\[LINK\]/g, productLink)

    await navigator.clipboard.writeText(personalizedComment)
    setCopiedComment(`${videoId}-${index}`)
    setTimeout(() => setCopiedComment(null), 2000)
  }

  const niches = ["all", ...Array.from(new Set(videos.map((v) => v.niche)))]
  const filledCount = [productName, productLink].filter((value) => value.trim()).length

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  const displayedVideos = filteredVideos.length > 0 ? filteredVideos : (liveResults ?? [])
  const libraryCountLabel =
    videos.length > 0
      ? `${videos.length} pre-loaded viral videos + 5 comments each.`
      : "Pre-loaded viral videos + 5 comments each."

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Premium"
        title={PREMIUM_FEATURE_LABELS.dfyVault}
        subtitle={`${libraryCountLabel} Select your product once, then copy and paste comments on any video.`}
      />

      <PremiumVideoTutorial
        vimeoId={getPremiumTrainingVimeoId("accelerator")}
        title={`${PREMIUM_FEATURE_LABELS.dfyVault} Training`}
        description="Watch how to browse pre-loaded viral videos, select your product once, and copy ready-made comments — all in under two minutes."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.dfyVault} training video`}
      />

      <PremiumFeatureBanner
        icon={Gem}
        kicker="Comment vault"
        title="Ready-made viral videos"
        description="Lock your offer once. Every comment already includes the product name and your link."
        chip={videos.length > 0 ? `${videos.length} videos loaded` : "Library ready"}
      />

      {!productSelected ? (
        <div className="space-y-6">
          <PremiumSteps title="Three steps to post" steps={UNLIMITED_STEPS} />

          <Card className="overflow-hidden border border-[var(--ds-line)] bg-card p-0">
            <form onSubmit={handleSelectProduct} noValidate>
              <div className="flex flex-col lg:flex-row">
                <div className="flex items-center gap-4 bg-ink px-5 py-5 text-white sm:px-6 lg:w-[220px] lg:flex-col lg:items-start lg:justify-center lg:py-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                    <Zap size={22} aria-hidden />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                      Step 1 of 3
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-white">
                      Lock in your offer
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-6 p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-ink sm:text-2xl">Select your product</h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        Your name and link drop into every ready-made comment.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide",
                          filledCount === 2
                            ? "bg-[#DDF7EC] text-[#147551]"
                            : filledCount === 1
                              ? "bg-primary text-white"
                              : "border border-[#F5D998] bg-[#FFF3D6] text-[#7A4F0C]",
                        )}
                      >
                        {filledCount}/2 ready
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-nested">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        filledCount === 2 ? "bg-[#147551]" : "bg-primary",
                      )}
                      style={{ width: `${(filledCount / 2) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4">
                      <Label
                        htmlFor="unlimited-product-name"
                        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-ink text-white">
                          <Tag size={12} aria-hidden />
                        </span>
                        Product name
                        <InfoHint label="The product or offer you're promoting. It gets dropped into every ready-made comment." />
                      </Label>
                      <Input
                        id="unlimited-product-name"
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value)
                          clearFieldError("productName")
                        }}
                        placeholder="e.g., Keto Weight Loss System"
                        aria-invalid={Boolean(fieldErrors.productName)}
                        className="h-12 bg-card text-base"
                      />
                      {fieldErrors.productName ? (
                        <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.productName}</p>
                      ) : (
                        <p className="mt-2 text-xs text-text-muted">Shown inside each comment as the offer name.</p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4">
                      <Label
                        htmlFor="unlimited-affiliate-link"
                        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white">
                          <Link2 size={12} aria-hidden />
                        </span>
                        Affiliate link
                        <InfoHint label="Your personal sharing link. You earn a commission when someone buys through it." />
                      </Label>
                      <Input
                        id="unlimited-affiliate-link"
                        type="url"
                        value={productLink}
                        onChange={(e) => {
                          setProductLink(e.target.value)
                          clearFieldError("productLink")
                        }}
                        placeholder="https://digistore24.com/..."
                        aria-invalid={Boolean(fieldErrors.productLink)}
                        className="h-12 bg-card text-base"
                      />
                      {fieldErrors.productLink ? (
                        <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.productLink}</p>
                      ) : (
                        <p className="mt-2 text-xs text-text-muted">Must start with http:// or https://</p>
                      )}
                    </div>
                  </div>

                  {productError && (
                    <Alert variant="destructive" className="border border-[#C53030]/40 bg-[#FDE4E4] text-[#C53030]">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="font-semibold text-[#C53030]">{productError}</AlertDescription>
                    </Alert>
                  )}

                  {unlocking && (
                    <GenerationProgress
                      offer="welcome"
                      label={`Unlocking your ${PREMIUM_FEATURE_LABELS.dfyVault} library...`}
                    />
                  )}

                  <Button
                    type="submit"
                    disabled={unlocking}
                    className={cn("h-12 w-full text-base sm:h-14 sm:text-lg", primaryCtaClass)}
                  >
                    {unlocking ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Unlocking library…
                      </span>
                    ) : (
                      <>
                        Unlock {PREMIUM_FEATURE_LABELS.dfyVault} library
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        <>
          <WelcomeOfferBanner />

          <div ref={libraryResultsRef} className="space-y-6">
            <Card className="overflow-hidden border border-[var(--ds-line)] bg-card p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="flex items-center gap-3 bg-[#147551] px-5 py-4 text-white sm:w-[180px] sm:flex-col sm:items-start sm:justify-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#147551]">
                    <Check size={16} aria-hidden />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                    Offer locked
                  </p>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Promoting</p>
                    <p className="text-lg font-semibold text-ink">{productName}</p>
                    <p className="max-w-xl truncate text-sm text-text-secondary">{productLink}</p>
                  </div>
                  <Button
                    onClick={() => setProductSelected(false)}
                    variant="outline"
                    className={cn("shrink-0", outlineCtaClass)}
                  >
                    Change product
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border border-[var(--ds-line)] bg-card p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search videos..."
                      className="h-14 pl-12 text-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {niches.map((niche) => (
                    <Button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      variant={selectedNiche === niche ? "default" : "outline"}
                      className={`whitespace-nowrap font-bold ${
                        selectedNiche === niche
                          ? "bg-ink text-white hover:bg-ink"
                          : outlineCtaClass
                      }`}
                    >
                      {niche === "all" ? "All Niches" : niche}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-text-secondary">
                {liveSearching
                  ? `Searching YouTube for "${searchQuery.trim()}"...`
                  : `Showing ${displayedVideos.length} opportunities`}
              </p>
            </Card>

            {liveSearching ? (
              <GenerationProgress
                offer="welcome"
                label={`AI finding fresh viral videos for "${searchQuery.trim()}"...`}
              />
            ) : searchQuery.trim() ? (
              <WelcomeOfferBanner />
            ) : null}

            {!liveSearching && searchQuery.trim() && displayedVideos.length === 0 && (
              <Card className="glass-strong border-2 border-[var(--border)] p-10 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-white">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-ink">No videos found</h3>
                <p className="mx-auto max-w-md font-semibold text-text-secondary">
                  Try a broader keyword like &quot;crypto&quot;, &quot;weight loss&quot; or &quot;side hustle&quot;.
                </p>
              </Card>
            )}

            <div ref={searchResultsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {displayedVideos.map((video) => (
                <Card
                  key={video.videoId}
                  className="border border-[var(--ds-line)] bg-card p-6 transition-colors hover:border-ink/30"
                >
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      {video.thumbnailUrl ? (
                        <a
                          href={`https://youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={video.thumbnailUrl}
                            alt=""
                            className="aspect-[4/5] h-full w-full object-cover"
                          />
                        </a>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 line-clamp-2 text-lg font-black text-ink">{video.title}</h3>
                        <p className="text-xs font-semibold text-text-secondary">{video.channelTitle}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-sapphire-700">
                          <Gem className="h-3 w-3" />
                          {video.niche}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="glass rounded-lg border border-[var(--border)] p-2 text-center">
                        <Eye className="mx-auto mb-1 h-3 w-3 text-sapphire-700" />
                        <p className="text-sm font-black text-ink">{formatNumber(video.viewCount)}</p>
                        <p className="text-[10px] font-bold text-text-secondary">Views</p>
                      </div>
                      <div className="glass rounded-lg border border-[var(--border)] p-2 text-center">
                        <Flame className="mx-auto mb-1 h-3 w-3 text-sapphire-700" />
                        <p className="text-sm font-black text-ink">{video.viralScore}</p>
                        <p className="text-[10px] font-bold text-text-secondary">Viral</p>
                      </div>
                      <div className="glass rounded-lg border border-[var(--border)] p-2 text-center">
                        <TrendingUp className="mx-auto mb-1 h-3 w-3 text-sapphire-700" />
                        <p className="text-sm font-black text-ink">{video.estimatedClicks}</p>
                        <p className="text-[10px] font-bold text-text-secondary">Est. clicks</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-ink">5 ready comments</p>
                      {video.commentTemplates.map((template, index) => {
                        const preview = template
                          .replace(/\[PRODUCT\]/g, productName)
                          .replace(/\[LINK\]/g, productLink)

                        return (
                          <div
                            key={index}
                            className="rounded-lg border border-[var(--ds-line)] bg-surface-nested p-3"
                          >
                            <div className="flex items-start gap-3">
                              <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-ink">{preview}</p>
                              <Button
                                onClick={() => handleCopyComment(template, video.videoId, index)}
                                size="sm"
                                className={`h-8 flex-shrink-0 rounded-lg px-3 font-bold transition-[transform,box-shadow,background] duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                  copiedComment === `${video.videoId}-${index}`
                                    ? "bg-[#147551] text-white"
                                    : "bg-ink text-white hover:bg-ink/90"
                                }`}
                              >
                                {copiedComment === `${video.videoId}-${index}` ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <Button asChild className={cn("h-12 w-full", primaryCtaClass)}>
                      <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" />
                        Open Video
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
