"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoHint } from "@/components/ui/info-hint"
import { TrendingUp, Search, Zap, Eye, Flame, Youtube, Loader2, ExternalLink, Copy, Check, AlertTriangle, RotateCw } from "lucide-react"
import { fetchVideoOpportunities, type VideoOpportunity } from "@/app/actions/fetch-video-opportunities"
import generateViralCommentsAction from "@/app/actions/generate-viral-comments"

export default function GoldRushPage() {
  // Step 1: Product Info
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [step, setStep] = useState<"product" | "videos">("product")
  
  // Step 2: Video Search
  const [searchMode, setSearchMode] = useState<"trending" | "niche">("trending")
  const [nicheKeyword, setNicheKeyword] = useState("")
  const [videos, setVideos] = useState<VideoOpportunity[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  // Inline form/validation messages (shown on screen instead of browser alerts)
  const [error, setError] = useState<string | null>(null)
  
  // Step 3: Generated Comments (per video)
  const [generatedCommentsMap, setGeneratedCommentsMap] = useState<Record<string, string[]>>({})
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleProductSubmit = () => {
    if (!productName.trim() || !productDescription.trim() || !affiliateLink.trim()) {
      setError("Please add your product name, a short description, and your affiliate link to continue.")
      return
    }
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
    setGeneratedCommentsMap({}) // Clear previous comments
    try {
      const results = await fetchVideoOpportunities({
        productName,
        productDescription,
        keyword: searchMode === "niche" ? nicheKeyword : undefined,
        mode: searchMode,
      })

      setVideos(results)
    } catch (error) {
      console.error("Error fetching videos:", error)
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
        affiliateLink
      })

      if (result.success && result.comments) {
        setGeneratedCommentsMap(prev => ({
          ...prev,
          [video.videoId]: result.comments
        }))
      } else {
        setError(result.error || "We couldn't create comments for this video. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          💰 Gold Rush Generator
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-[#7dd3fc] font-bold">
          Find viral videos, generate money-making comments, explode your traffic
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="glass-strong border-2 border-[#ef4444]/50 text-[#fca5a5]">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-[#fca5a5] font-semibold">{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Product Info */}
      {step === "product" && (
        <Card className="glass-strong border-2 border-[#0ea5e9]/40 p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-[#0ea5e9]/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9]/30 to-[#ec4899]/30 flex items-center justify-center border-2 border-[#0ea5e9]/40">
                <Zap className="w-7 h-7 text-[#0ea5e9]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Step 1: Add your affiliate link</h2>
                <p className="text-[#7dd3fc] font-semibold">What are you promoting today?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  Product/Offer Name
                  <InfoHint label="The product or service you're sharing — like a weight-loss program, a course, or an app." />
                </Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Weight Loss System, Crypto Course"
                  className="h-14 text-lg glass border-2 border-[#0ea5e9]/30 focus:border-[#ec4899]/50"
                />
              </div>

              <div>
                <Label className="text-white font-bold text-lg mb-2 block">What does your product do?</Label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g., Teaches people how to lose weight with keto diet in 90 days without gym"
                  className="w-full h-24 text-lg glass border-2 border-[#0ea5e9]/30 focus:border-[#ec4899]/50 rounded-xl p-4 bg-[#0a0f1e]/50 text-white placeholder:text-gray-500 resize-none"
                />
                <p className="text-sm text-[#7dd3fc] mt-2 font-semibold">
                  💡 The more details, the better comments AI can create
                </p>
              </div>

              <div>
                <Label className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  Your Affiliate Link
                  <InfoHint label="Your personal sharing link. You earn a commission when someone buys through it. You can get a free link from sites like DigiStore24 or ClickBank." />
                </Label>
                <Input
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  placeholder="https://digistore24.com/..."
                  className="h-14 text-lg glass border-2 border-[#0ea5e9]/30 focus:border-[#ec4899]/50"
                />
              </div>
            </div>

            <Button
              onClick={handleProductSubmit}
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-[#0ea5e9] to-[#ec4899] hover:from-[#ec4899] hover:to-[#0ea5e9] rounded-xl"
            >
              Find Viral Opportunities →
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Video Search */}
      {step === "videos" && (
        <>
          <Card className="glass-strong border-2 border-[#ec4899]/40 p-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white">Promoting: {productName}</h2>
                  <p className="text-[#7dd3fc] font-semibold text-sm truncate max-w-full sm:max-w-lg">{affiliateLink}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep("product")}
                  className="glass border-2 border-[#0ea5e9]/30 text-white font-bold shrink-0"
                >
                  Change Product
                </Button>
              </div>

              <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "trending" | "niche")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-14 glass border-2 border-[#0ea5e9]/30">
                  <TabsTrigger value="trending" className="text-lg font-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9]/30 data-[state=active]:to-[#ec4899]/30">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Hot in Your Niche
                  </TabsTrigger>
                  <TabsTrigger value="niche" className="text-lg font-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9]/30 data-[state=active]:to-[#ec4899]/30">
                    <Search className="w-5 h-5 mr-2" />
                    Search by Niche
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="space-y-4 mt-6">
                  <p className="text-[#7dd3fc] font-semibold text-sm">
                    Finds high-view Shorts related to <span className="text-white">{productName}</span>
                  </p>
                  <Button
                    onClick={handleFindVideos}
                    disabled={loadingVideos}
                    className="w-full h-16 text-xl font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] rounded-xl"
                  >
                    {loadingVideos ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        AI finding videos for your niche...
                      </>
                    ) : (
                      <>
                        <Flame className="w-6 h-6 mr-2" />
                        Find Viral Videos for My Product
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="niche" className="space-y-4 mt-6">
                  <div>
                    <Label className="text-white font-bold text-lg mb-2 block">Search for videos about...</Label>
                    <Input
                      value={nicheKeyword}
                      onChange={(e) => setNicheKeyword(e.target.value)}
                      placeholder="e.g., weight loss, crypto trading, dropshipping"
                      className="h-14 text-lg glass border-2 border-[#0ea5e9]/30"
                    />
                  </div>
                  <Button
                    onClick={handleFindVideos}
                    disabled={loadingVideos || !nicheKeyword.trim()}
                    className="w-full h-16 text-xl font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] rounded-xl"
                  >
                    {loadingVideos ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        AI finding videos for your niche...
                      </>
                    ) : (
                      <>
                        <Search className="w-6 h-6 mr-2" />
                        Search Viral Videos
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Video Results */}
          {videos.length > 0 && (
            <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                💎 {videos.length} Videos to comment on
              </h3>
              <p className="text-[#7dd3fc] font-bold">AI-matched to your product · sorted by views</p>
            </div>

              {videos.map((video) => {
                const comments = generatedCommentsMap[video.videoId]
                const hasComments = comments && comments.length > 0

                return (
                  <Card key={video.videoId} className={`glass-strong border-2 transition-all p-6 ${
                    hasComments 
                      ? "border-[#10b981]/50 shadow-xl shadow-[#10b981]/20" 
                      : "border-[#0ea5e9]/30 hover:border-[#ec4899]/50"
                  }`}>
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full sm:w-48 h-auto sm:h-27 object-cover rounded-xl border-2 border-[#0ea5e9]/40"
                          />
                          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-black px-2 py-1 rounded">
                            <Youtube className="w-3 h-3 inline mr-1" />
                            SHORT
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="text-xl font-black text-white mb-1 line-clamp-2">{video.title}</h4>
                            <p className="text-sm text-[#7dd3fc] font-semibold">{video.channelTitle}</p>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="glass rounded-lg p-3 border-2 border-[#0ea5e9]/30">
                              <Eye className="w-4 h-4 text-[#0ea5e9] mb-1" />
                              <p className="text-lg font-black text-white">{formatNumber(video.viewCount)}</p>
                              <p className="text-xs text-[#7dd3fc] font-bold">Views</p>
                            </div>
                            <div className="glass rounded-lg p-3 border-2 border-[#ec4899]/30">
                              <Flame className="w-4 h-4 text-[#ec4899] mb-1" />
                              <p className="text-lg font-black text-white">{video.viralScore}/100</p>
                              <p className="text-xs text-[#7dd3fc] font-bold flex items-center gap-1">
                                Viral Score
                                <InfoHint label="How likely this video is to keep getting lots of views. A higher number means more people may see your comment." />
                              </p>
                            </div>
                            <div className="glass rounded-lg p-3 border-2 border-[#06b6d4]/30">
                              <TrendingUp className="w-4 h-4 text-[#06b6d4] mb-1" />
                              <p className="text-lg font-black text-white">{formatNumber(video.estimatedClicks)}</p>
                              <p className="text-xs text-[#7dd3fc] font-bold flex items-center gap-1">
                                Est. Clicks
                                <InfoHint label="A rough guess of how many people could click your link if you comment on this video." />
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleGenerateComments(video)}
                              disabled={generatingFor === video.videoId}
                              className="flex-1 h-14 text-lg font-black bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] rounded-xl"
                            >
                              {generatingFor === video.videoId ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-5 h-5 mr-2" />
                                  Generate Comments
                                </>
                              )}
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="h-14 px-6 glass border-2 border-[#0ea5e9]/30 text-white font-bold"
                            >
                              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Generated Comments (shown in card) */}
                      {hasComments && (
                        <div className="pt-6 border-t-2 border-[#10b981]/20 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-[#10b981]">Your generated comments</h3>
                            <Button
                              asChild
                              size="sm"
                              className="h-10 px-4 font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] rounded-lg"
                            >
                              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                                <Youtube className="w-4 h-4 mr-2" />
                                Open Video
                              </a>
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {comments.map((comment, index) => (
                              <div key={index} className="glass rounded-xl p-4 border-2 border-[#0ea5e9]/30 hover:border-[#10b981]/50 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                  <p className="text-base text-white font-medium flex-1 leading-relaxed">{comment}</p>
                                  <Button
                                    onClick={() => handleCopyComment(comment, video.videoId, index)}
                                    size="sm"
                                    className={`h-10 px-4 font-black rounded-lg transition-all flex-shrink-0 ${
                                      copiedIndex === `${video.videoId}-${index}`
                                        ? "bg-[#10b981] hover:bg-[#10b981]"
                                        : "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9]"
                                    }`}
                                  >
                                    {copiedIndex === `${video.videoId}-${index}` ? (
                                      <>
                                        <Check className="w-4 h-4 mr-1" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4 mr-1" />
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

          {/* Empty state: a search ran but returned nothing */}
          {searched && !loadingVideos && videos.length === 0 && (
            <Card className="glass-strong border-2 border-[#0ea5e9]/30 p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0ea5e9]/10 flex items-center justify-center border-2 border-[#0ea5e9]/30 mb-5">
                <Search className="w-8 h-8 text-[#0ea5e9]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">No videos found</h3>
              <p className="text-[#7dd3fc] font-semibold max-w-md mx-auto mb-6">
                We couldn't find live Shorts about your product with 50K+ views. Try a more specific niche keyword like "crypto trading" or "bitcoin investing".
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleFindVideos}
                  disabled={loadingVideos}
                  className="h-12 px-6 font-black bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] rounded-xl"
                >
                  <RotateCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep("product")}
                  className="h-12 px-6 glass border-2 border-[#0ea5e9]/30 text-white font-bold rounded-xl"
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
