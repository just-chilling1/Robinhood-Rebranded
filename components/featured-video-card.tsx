"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, PlayCircle, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { VideoOverlay } from "@/components/video-overlay"

export function FeaturedVideoCard() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="glass-strong border border-white/10 overflow-hidden shadow-lg">
      <CardContent className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <PlayCircle className="w-8 h-8 text-[#fbbf24]" />
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Welcome &amp; Getting Started</h3>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0d0a1a] to-[#1a1429]">
            {/* Video thumbnail preview */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/thumbnails/thumb-01-welcome-getting-started.webp"
                alt="Welcome & Getting Started thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 thumb-scrim" />

            {/* Large play button */}
            <Button
              size="lg"
              onClick={() => setIsPlaying(true)}
              className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] text-white shadow-lg hover:scale-105 transition-all duration-300 border-2 border-[#fbbf24]/30 glow-purple"
            >
              <Play className="w-9 h-9 ml-0.5 fill-white" />
            </Button>

            {/* Click to play text */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-lg md:text-xl font-bold drop-shadow-lg">
                ▶ This 5-minute video shows you exactly how to use Robinhood
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Training Academy */}
        <Link
          href="/training"
          className="flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-xl font-black text-white shadow-lg shadow-[#0ea5e9]/25 transition-all hover:from-[#06b6d4] hover:to-[#0ea5e9] hover:shadow-[#0ea5e9]/45"
        >
          Open Training Academy
          <ArrowRight className="h-6 w-6" />
        </Link>
      </CardContent>

      {isPlaying && (
        <VideoOverlay
          videoUrl="https://player.vimeo.com/video/1151044408"
          title="Welcome & Getting Started"
          onClose={() => setIsPlaying(false)}
        />
      )}
    </Card>
  )
}
