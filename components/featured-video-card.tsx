"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Sparkles } from "lucide-react"
import { useState } from "react"

export function FeaturedVideoCard() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="glass-strong border border-[#a855f7]/40 glow-purple overflow-hidden shadow-lg shadow-[#a855f7]/20">
      <CardContent className="p-0">
        <div className="space-y-0">
          {/* Video Info - Clean header */}
          <div className="p-4 border-b border-[#a855f7]/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#fbbf24] animate-pulse" />
              <span className="text-[#fbbf24] font-semibold text-xs uppercase tracking-wider">Must Watch First</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Watch This Video To Get Started</h3>
            <p className="text-sm text-[#c4b5fd] font-medium">
              This 5-minute video shows you exactly how to use Robinhood
            </p>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0d0a1a] to-[#1a1429]">
                {/* Video thumbnail preview */}
                <div className="absolute inset-0">
                  <iframe
                    src="https://player.vimeo.com/video/1151044408?badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=1"
                    title="Robinhood Welcome Preview"
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Large play button */}
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] text-white shadow-lg hover:scale-105 transition-all duration-300 border-2 border-[#fbbf24]/30 glow-purple"
                >
                  <Play className="w-8 h-8 ml-0.5 fill-white" />
                </Button>

                {/* Click to play text */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm font-semibold drop-shadow-lg">▶ Click to Play Video</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <iframe
                  src="https://player.vimeo.com/video/1151044408?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&controls=1"
                  title="Robinhood Welcome"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
