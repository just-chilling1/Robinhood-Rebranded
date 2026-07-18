"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  Search, 
  Filter, 
  Youtube, 
  Copy, 
  Check, 
  Eye,
  TrendingUp,
  Flame,
  Zap,
  ExternalLink,
  Play,
  AlertTriangle
} from "lucide-react"
import { fetchDFYLibrary, searchDFYVideos, type DFYVideo } from "@/app/actions/fetch-dfy-library"

interface UserProduct {
  name: string
  link: string
}

export default function DFYVaultClient() {
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<DFYVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<DFYVideo[]>([])
  const [selectedNiche, setSelectedNiche] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [liveSearching, setLiveSearching] = useState(false)
  const [liveResults, setLiveResults] = useState<DFYVideo[] | null>(null)
  
  // User's product selection
  const [productName, setProductName] = useState("")
  const [productLink, setProductLink] = useState("")
  const [productSelected, setProductSelected] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  
  // Copy tracking
  const [copiedComment, setCopiedComment] = useState<string | null>(null)
  
  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

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

  // Match any word of the query against title, channel and niche —
  // a strict full-phrase title match almost always returned 0 results.
  const matchesQuery = (video: DFYVideo, query: string) => {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2)
    if (words.length === 0) return true
    const haystack = `${video.title} ${video.channelTitle} ${video.niche}`.toLowerCase()
    return words.some(w => haystack.includes(w))
  }

  const filterVideos = () => {
    let filtered = videos

    // Filter by niche
    if (selectedNiche !== "all") {
      filtered = filtered.filter(v => v.niche === selectedNiche)
    }

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(v => matchesQuery(v, searchQuery.trim()))
    }

    setFilteredVideos(filtered)
  }

  // When the library has nothing for this search, fetch fresh videos
  // straight from YouTube instead of showing "0 opportunities".
  useEffect(() => {
    const query = searchQuery.trim()
    setLiveResults(null)

    if (query.length < 3 || loading) {
      setLiveSearching(false)
      return
    }

    const localMatches = videos.filter(v =>
      (selectedNiche === "all" || v.niche === selectedNiche) && matchesQuery(v, query)
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

  const handleSelectProduct = () => {
    if (!productName.trim() || !productLink.trim()) {
      setProductError("Please enter both your product name and your affiliate link to continue.")
      return
    }
    setProductError(null)
    setProductSelected(true)
  }

  const handleCopyComment = async (comment: string, videoId: string, index: number) => {
    // Replace placeholders with user's product
    const personalizedComment = comment
      .replace(/\[PRODUCT\]/g, productName)
      .replace(/\[LINK\]/g, productLink)
    
    await navigator.clipboard.writeText(personalizedComment)
    setCopiedComment(`${videoId}-${index}`)
    setTimeout(() => setCopiedComment(null), 2000)
  }

  const niches = ["all", ...Array.from(new Set(videos.map(v => v.niche)))]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-[#0ea5e9] animate-spin mx-auto" />
          <p className="text-2xl text-white font-bold">Loading Accelerator Library...</p>
          <p className="text-[#7dd3fc]">Fetching 200+ viral opportunities across 6 niches</p>
        </div>
      </div>
    )
  }

  const displayedVideos = filteredVideos.length > 0 ? filteredVideos : (liveResults ?? [])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-white tracking-tight">
          💎 Accelerator
        </h1>
        <p className="text-2xl text-[#7dd3fc] font-bold">
          {videos.length} Pre-Loaded Viral Videos + 5 Comments Each
        </p>
        <p className="text-lg text-[#7dd3fc]">
          Select your product once, copy & paste comments on any video
        </p>
      </div>

      {/* Training Video */}
      <Card className="glass-strong border-2 border-[#ec4899]/40 overflow-hidden">
        <div className="p-6 border-b-2 border-[#ec4899]/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ec4899]/30 to-[#f97316]/30 flex items-center justify-center border-2 border-[#ec4899]/40">
              <Youtube className="w-6 h-6 text-[#ec4899]" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Accelerator Training</h2>
              <p className="text-[#7dd3fc] font-semibold">Watch this first to maximize your results with the 200+ DFY videos</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-video bg-black">
          {!isVideoPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0d0a1a] to-[#1a1429]">
              <div className="absolute inset-0">
                <iframe
                  src="https://player.vimeo.com/video/1151044893?badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=1"
                  title="DFY Training Preview"
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                />
              </div>
              <div className="absolute inset-0 bg-black/50" />
              <Button
                size="lg"
                onClick={() => setIsVideoPlaying(true)}
                className="relative z-10 h-28 w-28 rounded-full bg-gradient-to-br from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] text-white shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white/20"
              >
                <Play className="w-14 h-14 ml-1 fill-white" />
              </Button>
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white text-xl font-extrabold drop-shadow-lg">▶ Click to Play Training</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <iframe
                src="https://player.vimeo.com/video/1151044893?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&controls=1"
                title="DFY Vault Training"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Product Selection */}
      {!productSelected ? (
        <Card className="glass-strong border-2 border-[#fbbf24]/40 p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-[#fbbf24]/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fbbf24]/30 to-[#f97316]/30 flex items-center justify-center border-2 border-[#fbbf24]/40">
                <Zap className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Select Your Product</h2>
                <p className="text-[#7dd3fc] font-semibold">Your product will be inserted into all comments automatically</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white font-bold text-lg mb-2 block">Product Name</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Keto Weight Loss System"
                  className="h-14 text-lg glass border-2 border-[#0ea5e9]/30"
                />
              </div>
              <div>
                <Label className="text-white font-bold text-lg mb-2 block">Affiliate Link</Label>
                <Input
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  placeholder="https://..."
                  className="h-14 text-lg glass border-2 border-[#0ea5e9]/30"
                />
              </div>
            </div>

            {productError && (
              <Alert variant="destructive" className="glass-strong border-2 border-[#ef4444]/50 text-[#fca5a5]">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-[#fca5a5] font-semibold">{productError}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSelectProduct}
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-[#fbbf24] to-[#f97316] hover:from-[#f97316] hover:to-[#fbbf24] rounded-xl"
            >
              Unlock DFY Library →
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Selected Product Bar */}
          <Card className="glass-strong border-2 border-[#10b981]/40 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#7dd3fc] font-semibold mb-1">Your Product:</p>
                <p className="text-2xl font-black text-white">{productName}</p>
                <p className="text-sm text-[#7dd3fc] truncate max-w-xl">{productLink}</p>
              </div>
              <Button
                onClick={() => setProductSelected(false)}
                variant="outline"
                className="glass border-2 border-[#0ea5e9]/30 text-white font-bold"
              >
                Change Product
              </Button>
            </div>
          </Card>

          {/* Filters */}
          <Card className="glass-strong border-2 border-[#0ea5e9]/30 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7dd3fc]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos..."
                    className="h-14 pl-12 text-lg glass border-2 border-[#0ea5e9]/30"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {niches.map(niche => (
                  <Button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    variant={selectedNiche === niche ? "default" : "outline"}
                    className={`whitespace-nowrap font-bold ${
                      selectedNiche === niche
                        ? "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4]"
                        : "glass border-2 border-[#0ea5e9]/30 text-white"
                    }`}
                  >
                    {niche === "all" ? "All Niches" : niche}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-sm text-[#7dd3fc] font-semibold mt-4">
              {liveSearching
                ? `Searching YouTube for "${searchQuery.trim()}"...`
                : `Showing ${displayedVideos.length} opportunities`}
            </p>
          </Card>

          {/* While searching YouTube live */}
          {liveSearching && (
            <Card className="glass-strong border-2 border-[#0ea5e9]/30 p-10 text-center">
              <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin mx-auto mb-4" />
              <p className="text-xl font-black text-white">
                Finding fresh viral videos for "{searchQuery.trim()}"...
              </p>
            </Card>
          )}

          {/* Empty state after a live search found nothing */}
          {!liveSearching && searchQuery.trim() && displayedVideos.length === 0 && (
            <Card className="glass-strong border-2 border-[#0ea5e9]/30 p-10 text-center">
              <Search className="w-10 h-10 text-[#0ea5e9] mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">No videos found</h3>
              <p className="text-[#7dd3fc] font-semibold">
                Try a broader keyword like "crypto", "weight loss" or "side hustle".
              </p>
            </Card>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedVideos.map((video) => (
              <Card key={video.videoId} className="glass-strong border-2 border-[#0ea5e9]/30 hover:border-[#10b981]/50 transition-all p-6">
                <div className="space-y-4">
                  {/* Video Info */}
                  <div className="flex gap-4">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-32 h-18 object-cover rounded-lg border-2 border-[#0ea5e9]/40"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white line-clamp-2 mb-1">{video.title}</h3>
                      <p className="text-xs text-[#7dd3fc] font-semibold">{video.channelTitle}</p>
                      <p className="text-xs text-[#10b981] font-bold mt-1">💎 {video.niche}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="glass rounded-lg p-2 border border-[#0ea5e9]/30 text-center">
                      <Eye className="w-3 h-3 text-[#0ea5e9] mx-auto mb-1" />
                      <p className="text-sm font-black text-white">{formatNumber(video.viewCount)}</p>
                    </div>
                    <div className="glass rounded-lg p-2 border border-[#ec4899]/30 text-center">
                      <Flame className="w-3 h-3 text-[#ec4899] mx-auto mb-1" />
                      <p className="text-sm font-black text-white">{video.viralScore}</p>
                    </div>
                    <div className="glass rounded-lg p-2 border border-[#06b6d4]/30 text-center">
                      <TrendingUp className="w-3 h-3 text-[#06b6d4] mx-auto mb-1" />
                      <p className="text-sm font-black text-white">{video.estimatedClicks}</p>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-white">5 Ready Comments:</p>
                    {video.commentTemplates.map((template, index) => {
                      const preview = template
                        .replace(/\[PRODUCT\]/g, productName)
                        .replace(/\[LINK\]/g, productLink)
                      
                      return (
                        <div key={index} className="glass rounded-lg p-3 border border-[#0ea5e9]/20 hover:border-[#10b981]/40 transition-all">
                          <div className="flex items-start gap-3">
                            <p className="text-xs text-white flex-1 leading-relaxed line-clamp-2">{preview}</p>
                            <Button
                              onClick={() => handleCopyComment(template, video.videoId, index)}
                              size="sm"
                              className={`h-8 px-3 font-bold rounded-lg flex-shrink-0 ${
                                copiedComment === `${video.videoId}-${index}`
                                  ? "bg-[#10b981]"
                                  : "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4]"
                              }`}
                            >
                              {copiedComment === `${video.videoId}-${index}` ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Open Video */}
                  <Button
                    asChild
                    className="w-full h-12 font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] rounded-xl"
                  >
                    <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                      <Youtube className="w-4 h-4 mr-2" />
                      Open Video
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

