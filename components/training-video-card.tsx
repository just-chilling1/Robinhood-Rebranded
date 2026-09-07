"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { TrainingVideo } from "@/components/training-video"
import { VideoOverlay } from "@/components/video-overlay"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"

export type TrainingCardVideo = {
  id: string
  title: string
  description: string
  duration?: string
  badge?: string
  step?: number
}

export function TrainingVideoCard({ video }: { video: TrainingCardVideo }) {
  const [open, setOpen] = useState(false)
  const hasVideo = Boolean(video.id.trim())

  return (
    <>
      <article className="glass-card flex flex-col overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_360px]">
        <div className="border-b border-border-dim/60 px-4 py-3 sm:px-5">
          <div className="flex items-start gap-3">
            {video.step != null ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[13px] font-medium text-sapphire-700">
                {video.step}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              {video.badge ? (
                <span className="mb-1 inline-block text-[13px] font-medium uppercase tracking-widest text-sapphire-700">
                  {video.badge}
                </span>
              ) : null}
              <h3 className="text-sm font-medium text-ink sm:text-base">{video.title}</h3>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <TrainingVideo
            title={video.title}
            onPlay={() => {
              if (hasVideo) setOpen(true)
            }}
            caption={hasVideo ? "▶ Click to Play Video" : "Video coming soon"}
          />
        </div>

        <div className="space-y-2 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <p className="text-[13px] leading-relaxed text-text-secondary">{video.description}</p>
          {video.duration ? (
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {video.duration}
            </p>
          ) : null}
        </div>
      </article>

      {hasVideo && open ? (
        <VideoOverlay
          videoUrl={buildVimeoEmbedUrl(video.id)}
          title={video.title}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
