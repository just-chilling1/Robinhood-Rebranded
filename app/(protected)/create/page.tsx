"use client"

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoHint } from "@/components/ui/info-hint"
import {
  TrendingUp,
  Search,
  Zap,
  Flame,
  Loader2,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Lightbulb,
  Link2,
  MessageSquare,
  Rocket,
  Clock,
  Sparkles,
  Pencil,
  ExternalLink,
} from "lucide-react"
import { GoldRushVideoCard } from "@/components/gold-rush-video-card"
import { listAffiliateLinks, type AffiliateLink } from "@/app/actions/affiliate-links"
import { fetchVideoOpportunities } from "@/app/actions/fetch-video-opportunities"
import type { VideoOpportunity } from "@/lib/video-opportunity"
import generateViralCommentsAction from "@/app/actions/generate-viral-comments"
import { GenerationProgress } from "@/components/generation-progress"
import { PageHeader } from "@/components/page-header"
import { SavedLinksPicker } from "@/components/saved-links-picker"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { useScrollToResults, useScrollToId } from "@/lib/use-scroll-to-results"
import { cn } from "@/lib/utils"

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-black text-white shadow-sapphire transition-[transform,box-shadow,background] duration-[160ms] hover:-translate-y-px hover:bg-grad-sapphire-hover hover:shadow-[0_10px_24px_-6px_rgba(37,99,235,0.65)] active:translate-y-0"

const outlineCtaClass =
  "glass rounded-xl border-2 border-[var(--ds-line-strong)] font-bold text-ink shadow-sm transition-[transform,box-shadow,background,border-color,color] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:text-sapphire-700 hover:shadow-hover active:translate-y-0"

type FieldKey = "productName" | "productDescription" | "affiliateLink"
type FieldErrors = Partial<Record<FieldKey, string>>

export default function GoldRushPage() {
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [savedLinks, setSavedLinks] = useState<AffiliateLink[]>([])
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null)
  const [step, setStep] = useState<"product" | "videos">("product")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [searchMode, setSearchMode] = useState<"trending" | "niche">("trending")
  const [nicheKeyword, setNicheKeyword] = useState("")
  const [videos, setVideos] = useState<VideoOpportunity[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [generatedCommentsMap, setGeneratedCommentsMap] = useState<Record<string, string[]>>({})
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [scrollToCommentsFor, setScrollToCommentsFor] = useState<string | null>(null)
  const prevLoadingVideos = useRef(false)

  const videoResultsRef = useScrollToResults(
    prevLoadingVideos.current && !loadingVideos && videos.length > 0
  )

  useEffect(() => {
    prevLoadingVideos.current = loadingVideos
  }, [loadingVideos])

  useEffect(() => {
    let cancelled = false
    listAffiliateLinks().then((result) => {
      if (cancelled || !result.success) return
      setSavedLinks(result.links)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const clearScrollToComments = useCallback(() => setScrollToCommentsFor(null), [])
  useScrollToId(
    scrollToCommentsFor ? `comments-${scrollToCommentsFor}` : null,
    clearScrollToComments
  )

  const filledCount = [productName, productDescription, affiliateLink].filter((value) => value.trim()).length

  const clearFieldError = (key: FieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validateOffer = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!productName.trim()) {
      next.productName = "Add the name of the product or offer you're promoting."
    }
    if (!productDescription.trim()) {
      next.productDescription = "Tell the AI what your product does so it can write better comments."
    } else if (productDescription.trim().length < 12) {
      next.productDescription = "Add a bit more detail — a sentence or two works best."
    }
    if (!affiliateLink.trim()) {
      next.affiliateLink = "Paste your affiliate link so it can go inside the comments."
    } else if (!isValidAffiliateUrl(affiliateLink)) {
      next.affiliateLink = "Use a full link that starts with http:// or https://"
    }
    return next
  }

  const handleProductSubmit = (event?: FormEvent) => {
    event?.preventDefault()
    const nextErrors = validateOffer()
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setError("Fill in the highlighted fields to continue.")
      return
    }
    setFieldErrors({})
    setError(null)
    setNicheKeyword(productName.trim())
    setStep("videos")
  }

  const handleFindVideos = async () => {
    if (searchMode === "niche" && !nicheKeyword.trim()) {
      setError("Please type a topic to search for, like \"weight loss\" or \"crypto\".")
      return
    }
    setError(null)
    setLoadingVideos(true)
    setSearched(true)
    setGeneratedCommentsMap({})
    try {
      const results = await fetchVideoOpportunities({
        productName,
        productDescription,
        keyword: searchMode === "niche" ? nicheKeyword : undefined,
        mode: searchMode,
      })

      setVideos(results)
    } catch (fetchError) {
      console.error("Error fetching videos:", fetchError)
      setError("We couldn't load videos right now. Please try again in a moment.")
    }
    setLoadingVideos(false)
  }

  const handleGenerateComments = async (video: VideoOpportunity) => {
    setGeneratingFor(video.videoId)
    setError(null)

    try {
      const result = await generateViralCommentsAction({
        videoId: video.videoId,
        videoTitle: video.title,
        channelTitle: video.channelTitle,
        productName,
        productDescription,
        affiliateLink,
      })

      if (result.success && result.comments) {
        setGeneratedCommentsMap((prev) => ({
          ...prev,
          [video.videoId]: result.comments,
        }))
        setScrollToCommentsFor(video.videoId)
      } else {
        setError(result.error || "We couldn't create comments for this video. Please try again.")
      }
    } catch (generateError) {
      console.error("Error:", generateError)
      setError("Something went wrong while creating comments. Please try again.")
    }

    setGeneratingFor(null)
  }

  const handleCopyComment = async (comment: string, videoId: string, index: number) => {
    await navigator.clipboard.writeText(comment)
    setCopiedIndex(`${videoId}-${index}`)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Gold Rush"
        title="Gold Rush Generator"
        subtitle="Find viral videos, generate money-making comments, explode your traffic."
      />

      {error && (
        <Alert variant="destructive" className="glass-strong border-2 border-[#C53030]/50 text-[#C53030]">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold text-[#C53030]">{error}</AlertDescription>
        </Alert>
      )}

      {step === "product" && (
        <div className="grid items-start gap-6 xl:grid-cols-5">
          <Card className="glass-strong border-2 border-[var(--border-strong)] p-6 sm:p-8 xl:col-span-3">
            <form className="space-y-6" onSubmit={handleProductSubmit} noValidate>
              <div className="flex items-start justify-between gap-4 border-b-2 border-[#2563EB]/45 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-gradient-to-br from-[#2563EB]/20 to-[#2563EB]/10 sm:h-14 sm:w-14">
                    <Zap className="h-6 w-6 text-[#2563EB] sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">Add your affiliate link</h2>
                    <p className="font-semibold text-[#486581]">What are you promoting today?</p>
                  </div>
                </div>
                <p className="shrink-0 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/8 px-2.5 py-1 text-[11px] font-black text-[#2563EB] sm:px-3 sm:text-xs">
                  {filledCount}/3 ready
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="product-name" className="mb-2 flex items-center gap-2 text-lg font-bold text-[#102A43]">
                    Product/Offer Name
                    <InfoHint label="The product or service you're sharing — like a weight-loss program, a course, or an app." />
                  </Label>
                  <Input
                    id="product-name"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value)
                      setSelectedSavedId(null)
                      clearFieldError("productName")
                    }}
                    placeholder="e.g., Weight Loss System, Crypto Course"
                    aria-invalid={Boolean(fieldErrors.productName)}
                    className="h-14 text-lg"
                  />
                  {fieldErrors.productName ? (
                    <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.productName}</p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="product-description" className="mb-2 block text-lg font-bold text-[#102A43]">
                    What does your product do?
                  </Label>
                  <Textarea
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => {
                      setProductDescription(e.target.value)
                      clearFieldError("productDescription")
                    }}
                    placeholder="e.g., Teaches people how to lose weight with keto diet in 90 days without gym"
                    aria-invalid={Boolean(fieldErrors.productDescription)}
                    className="min-h-28 resize-none text-lg"
                  />
                  {fieldErrors.productDescription ? (
                    <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.productDescription}</p>
                  ) : (
                    <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#486581]">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#B7791F]" />
                      The more details, the better comments AI can create
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="affiliate-link" className="mb-2 flex items-center gap-2 text-lg font-bold text-[#102A43]">
                    Your Affiliate Link
                    <InfoHint label="Your personal sharing link. You earn a commission when someone buys through it. You can get a free link from sites like DigiStore24 or ClickBank." />
                  </Label>
                  <div className="space-y-3">
                    <SavedLinksPicker
                      links={savedLinks}
                      selectedId={selectedSavedId}
                      onSelect={(link) => {
                        setSelectedSavedId(link.id)
                        setProductName(link.offer_name)
                        setAffiliateLink(link.affiliate_url)
                        clearFieldError("productName")
                        clearFieldError("affiliateLink")
                      }}
                    />
                    <Input
                      id="affiliate-link"
                      type="url"
                      value={affiliateLink}
                      onChange={(e) => {
                        setAffiliateLink(e.target.value)
                        setSelectedSavedId(null)
                        clearFieldError("affiliateLink")
                      }}
                      placeholder="https://digistore24.com/..."
                      aria-invalid={Boolean(fieldErrors.affiliateLink)}
                      className="h-14 text-lg"
                    />
                  </div>
                  {fieldErrors.affiliateLink ? (
                    <p className="mt-2 text-sm font-semibold text-[#C53030]">{fieldErrors.affiliateLink}</p>
                  ) : null}
                </div>
              </div>

              <Button
                type="submit"
                className={cn("h-16 w-full text-xl", primaryCtaClass)}
              >
                Find Viral Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Card>

          <aside className="space-y-4 xl:col-span-2">
            <Card className="glass-strong border border-[var(--border)] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#2563EB]" />
                <h3 className="text-lg font-black text-[#102A43]">How it works</h3>
              </div>
              <ol className="space-y-4">
                {[
                  {
                    icon: Link2,
                    title: "Drop in your offer",
                    body: "Name, what it does, and your money link. That's all the AI needs.",
                  },
                  {
                    icon: Search,
                    title: "We find viral Shorts",
                    body: "Gold Rush hunts high-view YouTube videos that match your product.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Copy comments that sell",
                    body: "Get ready-to-post comments with your link already inside.",
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
                <li>Videos already getting traffic in your niche</li>
                <li>Comments written to sound like a real viewer</li>
                <li>Your affiliate link baked in — copy and post</li>
              </ul>
            </Card>
          </aside>
        </div>
      )}

      {step === "videos" && (
        <>
          <Card className="glass-card overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-[var(--ds-line)] px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="dashboard-section-icon">
                  <Zap className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="page-eyebrow mb-1">Promoting</p>
                  <h2 className="ds-h2 truncate text-[1.375rem] sm:text-[1.625rem]">{productName}</h2>
                  {affiliateLink ? (
                    <a
                      href={affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 flex max-w-full items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-sapphire-700 sm:max-w-lg"
                    >
                      <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="truncate">{affiliateLink}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("product")}
                className="h-10 shrink-0 rounded-xl border border-[var(--ds-line-strong)] bg-white px-4 text-sm font-semibold text-ink hover:border-primary hover:bg-primary-light hover:text-sapphire-700"
              >
                <Pencil className="mr-2 h-4 w-4" aria-hidden />
                Change Product
              </Button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "trending" | "niche")} className="w-full gap-5">
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] p-1 sm:h-14">
                  <TabsTrigger
                    value="trending"
                    className="rounded-lg text-sm font-semibold text-[#14213d] shadow-none data-[state=active]:bg-white data-[state=active]:text-sapphire-700 data-[state=active]:shadow-sm sm:text-base"
                  >
                    <TrendingUp className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                    <span className="sm:hidden">Hot Niche</span>
                    <span className="hidden sm:inline">Hot in Your Niche</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="niche"
                    className="rounded-lg text-sm font-semibold text-[#14213d] shadow-none data-[state=active]:bg-white data-[state=active]:text-sapphire-700 data-[state=active]:shadow-sm sm:text-base"
                  >
                    <Search className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                    <span className="sm:hidden">Search</span>
                    <span className="hidden sm:inline">Search by Niche</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="mt-0 space-y-4">
                  <div>
                    <p className="text-sm font-medium leading-relaxed text-text-secondary">
                      Finds high-view Shorts related to{" "}
                      <span className="font-semibold text-[#14213d]">{productName}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-line)] bg-white px-2.5 py-1 text-[12px] font-medium text-text-secondary">
                        <Flame className="h-3.5 w-3.5 text-[#b7791f]" aria-hidden />
                        High-view Shorts
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-line)] bg-white px-2.5 py-1 text-[12px] font-medium text-text-secondary">
                        <Sparkles className="h-3.5 w-3.5 text-sapphire-700" aria-hidden />
                        Matched to your offer
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-line)] bg-white px-2.5 py-1 text-[12px] font-medium text-text-secondary">
                        <TrendingUp className="h-3.5 w-3.5 text-sapphire-700" aria-hidden />
                        Sorted by views
                      </span>
                    </div>
                  </div>
                  {loadingVideos ? (
                    <GenerationProgress label="AI finding videos for your niche..." />
                  ) : null}
                  <Button
                    type="button"
                    onClick={handleFindVideos}
                    disabled={loadingVideos}
                    className={cn("h-14 w-full text-lg sm:h-16 sm:text-xl", primaryCtaClass)}
                  >
                    {loadingVideos ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        AI finding videos for your niche...
                      </>
                    ) : searched ? (
                      <>
                        <RotateCw className="mr-2 h-6 w-6" />
                        Find New Videos
                      </>
                    ) : (
                      <>
                        <Flame className="mr-2 h-6 w-6" />
                        Find Viral Videos for My Product
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="niche" className="mt-0 space-y-4">
                  <div>
                    <Label htmlFor="niche-keyword" className="mb-2 block text-sm font-semibold text-[#14213d]">
                      Search for videos about
                    </Label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" aria-hidden />
                      <Input
                        id="niche-keyword"
                        value={nicheKeyword}
                        onChange={(e) => setNicheKeyword(e.target.value)}
                        placeholder="e.g., weight loss, crypto trading, dropshipping"
                        className="h-12 pl-11 text-base sm:h-14 sm:text-lg"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-text-secondary">
                      Use a topic people already watch — then we surface the Shorts getting views.
                    </p>
                  </div>
                  {loadingVideos ? (
                    <GenerationProgress label="AI finding videos for your niche..." />
                  ) : null}
                  <Button
                    type="button"
                    onClick={handleFindVideos}
                    disabled={loadingVideos || !nicheKeyword.trim()}
                    className={cn("h-14 w-full text-lg sm:h-16 sm:text-xl", primaryCtaClass)}
                  >
                    {loadingVideos ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        AI finding videos for your niche...
                      </>
                    ) : searched ? (
                      <>
                        <RotateCw className="mr-2 h-6 w-6" />
                        Search Again
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-6 w-6" />
                        Search Viral Videos
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {videos.length > 0 && (
            <div ref={videoResultsRef} className="space-y-4">
              <div className="glass-card flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="dashboard-section-icon">
                    <Flame className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="ds-h2 text-[1.5rem] sm:text-[1.625rem]">
                      {videos.length} videos to comment on
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-text-secondary">
                      Pick a Short, generate comments, and post your link
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-warning inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    AI-matched to your product
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] px-3 py-1 text-[13px] font-medium text-text-secondary">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                    Sorted by views
                  </span>
                </div>
              </div>

              {videos.map((video, index) => (
                <GoldRushVideoCard
                  key={video.videoId}
                  video={video}
                  rank={index + 1}
                  comments={generatedCommentsMap[video.videoId]}
                  generating={generatingFor === video.videoId}
                  copiedIndex={copiedIndex}
                  onGenerate={() => handleGenerateComments(video)}
                  onCopyComment={(comment, commentIndex) =>
                    handleCopyComment(comment, video.videoId, commentIndex)
                  }
                />
              ))}
            </div>
          )}

          {searched && !loadingVideos && videos.length === 0 && (
            <Card className="glass-strong border-2 border-[var(--border)] p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-[#2563EB]/10">
                <Search className="h-8 w-8 text-[#2563EB]" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-[#102A43]">No videos found</h3>
              <p className="mx-auto mb-6 max-w-md font-semibold text-[#486581]">
                We couldn&apos;t find Shorts about your product right now. Try the &quot;Search by Niche&quot; tab with a
                keyword like &quot;crypto trading&quot; or &quot;bitcoin investing&quot;.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  onClick={handleFindVideos}
                  disabled={loadingVideos}
                  className={cn("h-12 px-6", primaryCtaClass)}
                >
                  <RotateCw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep("product")}
                  className={cn("h-12 px-6", outlineCtaClass)}
                >
                  Back to Step 1
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
