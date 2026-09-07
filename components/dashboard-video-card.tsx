"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { VideoOverlay } from "@/components/video-overlay"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"
import {
  isPlayableVimeoId,
  type DashboardTrainingVideo,
} from "@/lib/dashboard-training-videos"

type Props = {
  video: DashboardTrainingVideo
}

export function DashboardVideoCard({ video }: Props) {
  const [playing, setPlaying] = useState(false)
  const canPlay = isPlayableVimeoId(video.id)

  return (
    <>
      <Card className="glass-strong overflow-hidden border border-border shadow-card">
        <CardContent className="p-0">
          <div className="p-5 pb-3">
            <h3 className="text-lg font-bold text-[#102A43] md:text-xl">{video.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{video.description}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (canPlay) setPlaying(true)
            }}
            aria-label={canPlay ? `Play ${video.title}` : video.title}
            aria-disabled={!canPlay}
            className="group relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-[#102A43] to-[#486581] ring-1 ring-white/[0.06]"
          >
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card/95 text-[#102A43] shadow-2xl ring-4 ring-black/30 transition-transform group-hover:scale-105">
                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-white drop-shadow-lg">Click to Play Video</span>
            </span>
          </button>
        </CardContent>
      </Card>

      {playing && (
        <VideoOverlay
          videoUrl={buildVimeoEmbedUrl(video.id)}
          title={video.title}
          onClose={() => setPlaying(false)}
        />
      )}
    </>
  )
}
