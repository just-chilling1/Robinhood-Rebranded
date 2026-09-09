"use client"

import { useState } from "react"
import { Brain, Clock } from "lucide-react"
import { TrainingVideo } from "@/components/training-video"
import { VideoOverlay } from "@/components/video-overlay"
import { getVideoThumbnail, type VideoThumbnailSlug } from "@/lib/video-thumbnails"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"

export type TrainingCardVideo = {
  id: string
  title: string
  description: string
  duration?: string
  badge?: string
  step?: number
  thumbnailSlug?: VideoThumbnailSlug
}

export function TrainingVideoCard({ video }: { video: TrainingCardVideo }) {
  const [open, setOpen] = useState(false)
  const hasVideo = Boolean(video.id.trim())
  const thumbnail = getVideoThumbnail({ slug: video.thumbnailSlug, vimeoId: video.id })

  const headerIcon =
    video.badge === "Mindset" ? (
      <Brain className="h-3.5 w-3.5 shrink-0" aria-hidden />
    ) : video.step != null ? (
      video.step
    ) : video.badge ? (
      <span className="text-[11px] font-bold uppercase leading-none">{video.badge.charAt(0)}</span>
    ) : null

  return (
    <>
      <article className="glass-card flex h-full flex-col overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_360px]">
        <div className="flex min-h-[3.25rem] items-center gap-3 border-b border-border-dim/60 px-4 py-3 sm:px-5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[13px] font-medium text-sapphire-700"
            aria-hidden={video.badge === "Mindset" ? undefined : true}
            aria-label={video.badge === "Mindset" ? "Mindset video" : undefined}
          >
            {headerIcon}
          </span>
          <h3 className="min-w-0 flex-1 text-sm font-medium leading-snug text-ink sm:text-base">
            {video.title}
          </h3>
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <TrainingVideo
            title={video.title}
            thumbnailSrc={thumbnail}
            onPlay={() => {
              if (hasVideo) setOpen(true)
            }}
            caption={hasVideo ? "▶ Click to Play Video" : "Video coming soon"}
          />
        </div>

        <div className="flex flex-1 flex-col space-y-2 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <p className="flex-1 text-[13px] leading-relaxed text-text-secondary">{video.description}</p>
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
