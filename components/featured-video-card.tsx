"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, PlayCircle, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { VideoOverlay } from "@/components/video-overlay"
import { PRODUCT_NAME } from "@/lib/brand"

export function FeaturedVideoCard() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="glass-strong border border-[var(--border)] overflow-hidden shadow-lg">
      <CardContent className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <PlayCircle className="w-8 h-8 text-[#2563EB]" />
          <h3 className="text-2xl md:text-3xl font-black text-[#102A43] tracking-tight">Welcome &amp; Getting Started</h3>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#102A43] to-[#486581]">
            <Button
              size="lg"
              onClick={() => setIsPlaying(true)}
              className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#2563EB] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#1D4ED8] text-white shadow-lg hover:scale-105 transition-all duration-300 border-2 border-[var(--border)] glow-blue"
            >
              <Play className="w-9 h-9 ml-0.5 fill-[#102A43]" />
            </Button>

            {/* Click to play text */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-[#102A43] text-lg md:text-xl font-bold drop-shadow-lg">
                ▶ This 5-minute video shows you exactly how to use {PRODUCT_NAME}
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Training Academy */}
        <Link
          href="/training"
          className="flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-xl font-black text-white shadow-lg shadow-[#2563EB]/25 transition-all hover:from-[#1D4ED8] hover:to-[#1D4ED8] hover:shadow-[#2563EB]/45"
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
