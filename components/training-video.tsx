"use client"

import { Play } from "lucide-react"

interface TrainingVideoProps {
  title: string
  onPlay: () => void
  caption?: string
  thumbnailSrc?: string | null
}

/**
 * Academy thumbnail tile. Playback happens in VideoOverlay from the parent card.
 */
export function TrainingVideo({
  title,
  onPlay,
  caption = "▶ Click to Play Video",
  thumbnailSrc,
}: TrainingVideoProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${title}`}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-border-dim/40 bg-black text-left transition-all duration-200 hover:border-[var(--ds-line-sapphire)] hover:shadow-md"
    >
      <div className="relative aspect-video w-full">
        {thumbnailSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-2 to-ink" />
        )}
        <div className="video-thumb-scrim absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-grad-sapphire text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
            <Play className="ml-1 h-8 w-8 fill-white sm:h-9 sm:w-9" />
          </span>
        </div>
        {caption ? (
          <p className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 text-center text-sm font-medium text-white drop-shadow-lg sm:text-base">
            {caption}
          </p>
        ) : null}
      </div>
    </button>
  )
}
