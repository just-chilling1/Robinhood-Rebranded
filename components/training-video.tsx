"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoOverlay } from "@/components/video-overlay"
import { VIDEO_THUMBNAILS } from "@/lib/video-thumbnails"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"

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
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              width={1280}
              height={720}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a1a] to-[#1a1429]" />
          )}
        </div>
        <div className={`absolute inset-0 ${thumbnail ? "thumb-scrim" : "bg-black/40"}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={() => setOpen(true)}
            className="relative z-10 h-20 w-20 rounded-full border-4 border-white/20 bg-gradient-to-br from-[#a855f7] to-[#d946ef] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-[#d946ef] hover:to-[#a855f7]"
          >
            <Play className="ml-1 h-10 w-10 fill-white" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-sm font-semibold text-white drop-shadow-lg">▶ Click to Play Video</p>
        </div>
      </div>

      {open && (
        <VideoOverlay
          videoUrl={buildVimeoEmbedUrl(videoId)}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
