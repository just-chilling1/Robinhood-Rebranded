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
  Eye,
  Flame,
  Youtube,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Lightbulb,
  Link2,
  MessageSquare,
  Rocket,
  Clock,
} from "lucide-react"
import { listAffiliateLinks, type AffiliateLink } from "@/app/actions/affiliate-links"
import { fetchVideoOpportunities, type VideoOpportunity } from "@/app/actions/fetch-video-opportunities"
import generateViralCommentsAction from "@/app/actions/generate-viral-comments"
import { GenerationProgress } from "@/components/generation-progress"
import { EarningsBanner } from "@/components/earnings-banner"
import { PageHeader } from "@/components/page-header"
import { SavedLinksPicker } from "@/components/saved-links-picker"
import { StepIndicator, type WizardStep } from "@/components/step-indicator"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { useScrollToResults, useScrollToId } from "@/lib/use-scroll-to-results"
import { cn } from "@/lib/utils"

const GOLD_RUSH_STEPS: WizardStep[] = [
  { number: 1, title: "Your Offer", description: "Product + affiliate link" },
  { number: 2, title: "Find Videos", description: "Viral Shorts to comment on" },
  { number: 3, title: "Get Comments", description: "Copy, post, earn" },
]

const primaryCtaClass =
  "rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] font-black text-white shadow-lg shadow-[#2563EB]/30 transition-[transform,box-shadow,filter,background] duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:from-[#1D4ED8] hover:to-[#1E40AF] hover:shadow-2xl hover:shadow-[#2563EB]/50 hover:brightness-110 active:translate-y-0 active:scale-[0.99]"

const outlineCtaClass =
  "glass rounded-xl border-2 border-[var(--border)] font-bold text-[#102A43] shadow-sm transition-[transform,box-shadow,background,border-color,color] duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:border-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#1D4ED8] hover:shadow-xl hover:shadow-[#2563EB]/25 active:translate-y-0 active:scale-[0.99]"

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

  const commentsGenerated = Object.values(generatedCommentsMap).some((list) => list.length > 0)
  const wizardStep = step === "product" ? 1 : commentsGenerated ? 3 : 2
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Gold Rush"
        title="Gold Rush Generator"
        subtitle="Find viral videos, generate money-making comments, explode your traffic."
      />

      <StepIndicator currentStep={wizardStep} steps={GOLD_RUSH_STEPS} />

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
          <Card className="glass-strong border-2 border-[var(--border-strong)] p-6">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-black uppercase tracking-wider text-[#2563EB]">Promoting</p>
                  <h2 className="text-xl font-black text-[#102A43] sm:text-2xl">{productName}</h2>
                  <p className="max-w-full truncate text-sm font-semibold text-[#486581] sm:max-w-lg">{affiliateLink}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep("product")}
                  className="glass shrink-0 border-2 border-[var(--border)] font-bold text-[#102A43]"
                >
                  Change Product
                </Button>
              </div>

              <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "trending" | "niche")} className="w-full">
                <TabsList className="glass grid h-14 w-full grid-cols-2 border-2 border-[var(--border)]">
                  <TabsTrigger
                    value="trending"
                    className="text-lg font-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB]/30 data-[state=active]:to-[#2563EB]/30"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Hot in Your Niche
                  </TabsTrigger>
                  <TabsTrigger
                    value="niche"
                    className="text-lg font-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB]/30 data-[state=active]:to-[#2563EB]/30"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search by Niche
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="mt-6 space-y-4">
                  <p className="text-sm font-semibold text-[#486581]">
                    Finds high-view Shorts related to <span className="text-[#102A43]">{productName}</span>
                  </p>
                  {loadingVideos ? (
                    <GenerationProgress label="AI finding videos for your niche..." />
                  ) : searched ? (
                    <EarningsBanner />
                  ) : null}
                  <Button
                    onClick={handleFindVideos}
                    disabled={loadingVideos}
                    className={cn("h-16 w-full text-xl", primaryCtaClass)}
                  >
                    {loadingVideos ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        AI finding videos for your niche...
                      </>
                    ) : (
                      <>
                        <Flame className="mr-2 h-6 w-6" />
                        Find Viral Videos for My Product
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="niche" className="mt-6 space-y-4">
                  <div>
                    <Label className="mb-2 block text-lg font-bold text-[#102A43]">Search for videos about...</Label>
                    <Input
                      value={nicheKeyword}
                      onChange={(e) => setNicheKeyword(e.target.value)}
                      placeholder="e.g., weight loss, crypto trading, dropshipping"
                      className="h-14 text-lg"
                    />
                  </div>
                  {loadingVideos ? (
                    <GenerationProgress label="AI finding videos for your niche..." />
                  ) : searched ? (
                    <EarningsBanner />
                  ) : null}
                  <Button
                    onClick={handleFindVideos}
                    disabled={loadingVideos || !nicheKeyword.trim()}
                    className={cn("h-16 w-full text-xl", primaryCtaClass)}
                  >
                    {loadingVideos ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        AI finding videos for your niche...
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
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h3 className="text-2xl font-black text-[#102A43] sm:text-3xl">
                  {videos.length} videos to comment on
                </h3>
                <p className="font-bold text-[#486581]">AI-matched to your product · sorted by views</p>
              </div>

              {videos.map((video) => {
                const comments = generatedCommentsMap[video.videoId]
                const hasComments = comments && comments.length > 0

                return (
                  <Card
                    key={video.videoId}
                    className={`glass-strong border-2 p-6 transition-all ${
                      hasComments
                        ? "border-[#1D4ED8]/50 shadow-xl shadow-[#1D4ED8]/20"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="space-y-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                        {video.thumbnailUrl ? (
                          <a
                            href={`https://youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block shrink-0 overflow-hidden rounded-xl border border-[var(--border)] sm:w-44"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={video.thumbnailUrl}
                              alt=""
                              className="aspect-video h-full w-full object-cover sm:aspect-[4/5]"
                            />
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-xs font-black text-white">
                              <Youtube className="h-3 w-3" />
                              SHORT
                            </span>
                          </a>
                        ) : null}

                        <div className="min-w-0 flex-1 space-y-4">
                          <div>
                            {!video.thumbnailUrl ? (
                              <div className="mb-2 inline-flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-xs font-black text-white">
                                <Youtube className="h-3 w-3" />
                                SHORT
                              </div>
                            ) : null}
                            <h4 className="mb-1 line-clamp-2 text-xl font-black text-[#102A43]">{video.title}</h4>
                            <p className="text-sm font-semibold text-[#486581]">{video.channelTitle}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="glass rounded-lg border-2 border-[var(--border)] p-3">
                              <Eye className="mb-1 h-4 w-4 text-[#2563EB]" />
                              <p className="text-lg font-black text-[#102A43]">{formatNumber(video.viewCount)}</p>
                              <p className="text-xs font-bold text-[#486581]">Views</p>
                            </div>
                            <div className="glass rounded-lg border-2 border-[var(--border)] p-3">
                              <Flame className="mb-1 h-4 w-4 text-[#2563EB]" />
                              <p className="text-lg font-black text-[#102A43]">{video.viralScore}/100</p>
                              <p className="flex items-center gap-1 text-xs font-bold text-[#486581]">
                                Viral Score
                                <InfoHint label="How likely this video is to keep getting lots of views. A higher number means more people may see your comment." />
                              </p>
                            </div>
                            <div className="glass rounded-lg border-2 border-[var(--border)] p-3">
                              <TrendingUp className="mb-1 h-4 w-4 text-[#2563EB]" />
                              <p className="text-lg font-black text-[#102A43]">{formatNumber(video.estimatedClicks)}</p>
                              <p className="flex items-center gap-1 text-xs font-bold text-[#486581]">
                                Est. Clicks
                                <InfoHint label="A rough guess of how many people could click your link if you comment on this video." />
                              </p>
                            </div>
                          </div>

                          {generatingFor === video.videoId ? (
                            <GenerationProgress label="AI writing your money-making comments..." />
                          ) : hasComments ? (
                            <EarningsBanner />
                          ) : null}

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleGenerateComments(video)}
                              disabled={generatingFor === video.videoId}
                              className="h-14 flex-1 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-lg font-black text-white hover:from-[#1D4ED8] hover:to-[#1D4ED8]"
                            >
                              {generatingFor === video.videoId ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Zap className="mr-2 h-5 w-5" />
                                  Generate Comments
                                </>
                              )}
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="glass h-14 border-2 border-[var(--border)] px-6 font-bold text-[#102A43]"
                            >
                              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {hasComments && (
                        <div id={`comments-${video.videoId}`} className="space-y-4 border-t-2 border-[#1D4ED8]/20 pt-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-[#1D4ED8]">Your generated comments</h3>
                            <Button
                              asChild
                              size="sm"
                              className="h-10 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 font-black hover:from-[#1D4ED8] hover:to-[#1E40AF]"
                            >
                              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                                <Youtube className="mr-2 h-4 w-4" />
                                Open Video
                              </a>
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {comments.map((comment, index) => (
                              <div
                                key={index}
                                className="glass rounded-xl border-2 border-[var(--border)] p-4 transition-all hover:border-[#1D4ED8]/50"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <p className="flex-1 text-base font-medium leading-relaxed text-[#102A43]">{comment}</p>
                                  <Button
                                    onClick={() => handleCopyComment(comment, video.videoId, index)}
                                    size="sm"
                                    className={`h-10 flex-shrink-0 rounded-lg px-4 font-black transition-all ${
                                      copiedIndex === `${video.videoId}-${index}`
                                        ? "bg-[#1D4ED8] text-[#102A43] hover:bg-[#1D4ED8]"
                                        : "bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white hover:from-[#1D4ED8] hover:to-[#1D4ED8]"
                                    }`}
                                  >
                                    {copiedIndex === `${video.videoId}-${index}` ? (
                                      <>
                                        <Check className="mr-1 h-4 w-4" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="mr-1 h-4 w-4" />
                                        Copy
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
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
