"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoOverlay } from "@/components/video-overlay"
import { VIDEO_THUMBNAILS } from "@/lib/video-thumbnails"

interface TrainingVideoProps {
  /** Vimeo video id */
  videoId: string
  title: string
}

/**
 * Preview tile for a training video. Clicking play opens the video
 * in the shared overlay (with the withdraw ad below the player).
 */
export function TrainingVideo({ videoId, title }: TrainingVideoProps) {
  const [open, setOpen] = useState(false)
  const thumbnail = VIDEO_THUMBNAILS[videoId]

  return (
    <>
      <div className="relative aspect-video bg-black">
        <div className="absolute inset-0">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={`${title} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&background=1&muted=1`}
              title={`${title} preview`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 w-full h-full border-0 pointer-events-none"
            />
          )}
        </div>
        <div className={`absolute inset-0 ${thumbnail ? "bg-black/10" : "bg-black/40"}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={() => setOpen(true)}
            className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] text-white shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white/20"
          >
            <Play className="w-10 h-10 ml-1 fill-white" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-sm font-semibold drop-shadow-lg">▶ Click to Play Video</p>
        </div>
      </div>

      {open && (
        <VideoOverlay
          videoUrl={`https://player.vimeo.com/video/${videoId}`}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
