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
  MessageSquare,
  Rocket,
  Clock,
} from "lucide-react"
import { fetchDFYLibrary, searchDFYVideos, type DFYVideo } from "@/app/actions/fetch-dfy-library"
import { GenerationProgress } from "@/components/generation-progress"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import { PageHeader } from "@/components/page-header"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { cn } from "@/lib/utils"

const primaryCtaClass =
  "rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] font-black text-white shadow-lg shadow-[#2563EB]/30 transition-[transform,box-shadow,filter,background] duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:from-[#1D4ED8] hover:to-[#1E40AF] hover:shadow-2xl hover:shadow-[#2563EB]/50 hover:brightness-110 active:translate-y-0 active:scale-[0.99]"

const outlineCtaClass =
  "glass rounded-xl border-2 border-[var(--border)] font-bold text-[#102A43] shadow-sm transition-[transform,box-shadow,background,border-color,color] duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:border-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#1D4ED8] hover:shadow-xl hover:shadow-[#2563EB]/25 active:translate-y-0 active:scale-[0.99]"

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
        <Loader2 className="h-12 w-12 animate-spin text-[#2563EB]" />
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
        eyebrow={PREMIUM_FEATURE_LABELS.dfyVault}
        title={
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/10">
              <Gem className="h-5 w-5 text-[#2563EB]" />
            </span>
            {PREMIUM_FEATURE_LABELS.dfyVault}
          </span>
        }
        subtitle={`${libraryCountLabel} Select your product once, then copy and paste comments on any video.`}
      />

      <PremiumVideoTutorial
        vimeoId={getPremiumTrainingVimeoId("accelerator")}
        title={`${PREMIUM_FEATURE_LABELS.dfyVault} Training`}
        description="Watch how to browse pre-loaded viral videos, select your product once, and copy ready-made comments — all in under two minutes."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.dfyVault} training video`}
      />

      {!productSelected ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-strong border border-[var(--border)] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#2563EB]" />
                <h3 className="text-lg font-black text-[#102A43]">How it works</h3>
              </div>
              <ol className="space-y-4">
                {[
                  {
                    icon: Link2,
                    title: "Lock in your offer",
                    body: "Add the product name and money link once. Unlimited inserts them for you.",
                  },
                  {
                    icon: Search,
                    title: "Browse ready videos",
                    body: "Open a vault of high-view Shorts already matched to popular niches.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Copy and post",
                    body: "Each video has 5 comments with your offer inside. Paste and go.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[#2563EB]/8">
                      <item.icon className="h-5 w-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="font-black text-[#102A43]">{item.title}</p>
                      <p className="text-sm font-semibold leading-relaxed text-[#486581]">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/8 to-transparent p-6">
              <div className="mb-3 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-[#2563EB]" />
                <h3 className="text-lg font-black text-[#102A43]">What you walk away with</h3>
              </div>
              <ul className="space-y-2 text-sm font-semibold text-[#486581]">
                <li>Viral videos you can comment on immediately</li>
                <li>Five ready comments on every video</li>
                <li>Your product and link already filled in</li>
              </ul>
            </Card>
          </div>

          <Card className="glass-strong border-2 border-[var(--border-strong)] p-6 sm:p-8">
            <form className="space-y-6" onSubmit={handleSelectProduct} noValidate>
              <div className="flex items-start justify-between gap-4 border-b-2 border-[#2563EB]/45 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-gradient-to-br from-[#2563EB]/20 to-[#2563EB]/10 sm:h-14 sm:w-14">
                    <Zap className="h-6 w-6 text-[#2563EB] sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">Select Your Product</h2>
                    <p className="font-semibold text-[#486581]">Your product goes into every comment automatically</p>
                  </div>
                </div>
                <p className="shrink-0 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/8 px-2.5 py-1 text-[11px] font-black text-[#2563EB] sm:px-3 sm:text-xs">
                  {filledCount}/2 ready
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="unlimited-product-name" className="mb-2 flex items-center gap-2 text-lg font-bold text-[#102A43]">
                    Product Name
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
                    className="h-14 text-lg"
                  />
                  {fieldErrors.productName ? (
                    <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.productName}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="unlimited-affiliate-link" className="mb-2 flex items-center gap-2 text-lg font-bold text-[#102A43]">
                    Affiliate Link
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
                    className="h-14 text-lg"
                  />
                  {fieldErrors.productLink ? (
                    <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.productLink}</p>
                  ) : null}
                </div>
              </div>

              {productError && (
                <Alert variant="destructive" className="glass-strong border-2 border-[#C53030]/50 text-[#C53030]">
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

              <Button type="submit" disabled={unlocking} className={cn("h-16 w-full text-xl", primaryCtaClass)}>
                {unlocking ? (
                  "Unlocking..."
                ) : (
                  <>
                    Unlock {PREMIUM_FEATURE_LABELS.dfyVault} Library
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <>
          <WelcomeOfferBanner />

          <div ref={libraryResultsRef} className="space-y-6">
            <Card className="glass-strong border-2 border-[#1D4ED8]/40 p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-black uppercase tracking-wider text-[#2563EB]">Promoting</p>
                  <p className="text-2xl font-black text-[#102A43]">{productName}</p>
                  <p className="max-w-xl truncate text-sm font-semibold text-[#486581]">{productLink}</p>
                </div>
                <Button
                  onClick={() => setProductSelected(false)}
                  variant="outline"
                  className={cn("shrink-0", outlineCtaClass)}
                >
                  Change Product
                </Button>
              </div>
            </Card>

            <Card className="glass-strong border-2 border-[var(--border)] p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#486581]" />
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
                          ? "bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white"
                          : outlineCtaClass
                      }`}
                    >
                      {niche === "all" ? "All Niches" : niche}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#486581]">
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
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-[#2563EB]/10">
                  <Search className="h-8 w-8 text-[#2563EB]" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-[#102A43]">No videos found</h3>
                <p className="mx-auto max-w-md font-semibold text-[#486581]">
                  Try a broader keyword like &quot;crypto&quot;, &quot;weight loss&quot; or &quot;side hustle&quot;.
                </p>
              </Card>
            )}

            <div ref={searchResultsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {displayedVideos.map((video) => (
                <Card
                  key={video.videoId}
                  className="glass-strong border-2 border-[var(--border)] p-6 transition-all hover:border-[#1D4ED8]/50 hover:shadow-xl hover:shadow-[#2563EB]/10"
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
                        <h3 className="mb-1 line-clamp-2 text-lg font-black text-[#102A43]">{video.title}</h3>
                        <p className="text-xs font-semibold text-[#486581]">{video.channelTitle}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#1D4ED8]">
                          <Gem className="h-3 w-3" />
                          {video.niche}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="glass rounded-lg border border-[var(--border)] p-2 text-center">
                        <Eye className="mx-auto mb-1 h-3 w-3 text-[#2563EB]" />
                        <p className="text-sm font-black text-[#102A43]">{formatNumber(video.viewCount)}</p>
                        <p className="text-[10px] font-bold text-[#486581]">Views</p>
                      </div>
                      <div className="glass rounded-lg border border-[var(--border)] p-2 text-center">
                        <Flame className="mx-auto mb-1 h-3 w-3 text-[#2563EB]" />
                        <p className="text-sm font-black text-[#102A43]">{video.viralScore}</p>
                        <p className="text-[10px] font-bold text-[#486581]">Viral</p>
                      </div>
                      <div className="glass rounded-lg border border-[var(--border)] p-2 text-center">
                        <TrendingUp className="mx-auto mb-1 h-3 w-3 text-[#2563EB]" />
                        <p className="text-sm font-black text-[#102A43]">{video.estimatedClicks}</p>
                        <p className="text-[10px] font-bold text-[#486581]">Est. clicks</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-[#102A43]">5 ready comments</p>
                      {video.commentTemplates.map((template, index) => {
                        const preview = template
                          .replace(/\[PRODUCT\]/g, productName)
                          .replace(/\[LINK\]/g, productLink)

                        return (
                          <div
                            key={index}
                            className="glass rounded-lg border border-[#2563EB]/45 p-3 transition-all hover:border-[#1D4ED8]/50"
                          >
                            <div className="flex items-start gap-3">
                              <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-[#102A43]">{preview}</p>
                              <Button
                                onClick={() => handleCopyComment(template, video.videoId, index)}
                                size="sm"
                                className={`h-8 flex-shrink-0 rounded-lg px-3 font-bold transition-[transform,box-shadow,background] duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                  copiedComment === `${video.videoId}-${index}`
                                    ? "bg-[#16875C] text-white"
                                    : "bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white hover:from-[#1D4ED8] hover:to-[#1D4ED8]"
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
