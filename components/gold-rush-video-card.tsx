"use client"

import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { GenerationProgress } from "@/components/generation-progress"
import type { VideoOpportunity } from "@/lib/video-opportunity"
import { cn } from "@/lib/utils"
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Flame,
  Play,
  TrendingUp,
  Youtube,
  Zap,
  Loader2,
} from "lucide-react"

const generateCtaClass =
  "rounded-xl bg-grad-sapphire font-black text-white shadow-sapphire transition-[transform,box-shadow,background] duration-[160ms] hover:-translate-y-px hover:bg-grad-sapphire-hover hover:shadow-[0_10px_24px_-6px_rgba(37,99,235,0.65)] active:translate-y-0"

type Props = {
  video: VideoOpportunity
  rank: number
  comments?: string[]
  generating: boolean
  copiedIndex: string | null
  onGenerate: () => void
  onCopyComment: (comment: string, index: number) => void
}

function formatNumber(num: number) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

function formatPublished(publishedAt: string) {
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime()) || !publishedAt.includes("T")) {
    return publishedAt
  }
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000))
  if (days < 1) return "Today"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function viralBarClass(score: number) {
  if (score >= 85) return "bg-gold-grad"
  if (score >= 60) return "bg-gradient-to-r from-[#60a5fa] to-[#2563eb]"
  return "bg-[#94a3b8]"
}

export function GoldRushVideoCard({
  video,
  rank,
  comments,
  generating,
  copiedIndex,
  onGenerate,
  onCopyComment,
}: Props) {
  const hasComments = Boolean(comments && comments.length > 0)
  const watchUrl = `https://youtube.com/watch?v=${video.videoId}`
  const published = formatPublished(video.publishedAt)

  return (
    <article
      className={cn(
        "glass-card overflow-hidden p-0 transition-[border-color,box-shadow] duration-200 hover:border-[var(--ds-line-sapphire)]",
        rank <= 3 && "accent-card",
        hasComments && "border-[var(--ds-line-sapphire)] shadow-[0_8px_24px_-8px_rgba(52,120,246,0.35)]",
      )}
    >
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {video.thumbnailUrl ? (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${video.title} on YouTube`}
            className="group relative block aspect-[9/16] w-[5.75rem] shrink-0 self-start overflow-hidden rounded-[12px] bg-ink sm:w-[7.75rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="video-thumb-scrim absolute inset-0" />
            <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm sm:left-2 sm:top-2 sm:px-2 sm:text-[11px]">
              <Youtube className="h-3 w-3" aria-hidden />
              Short
            </span>
            <span
              className={cn(
                "absolute bottom-1.5 left-1.5 flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-bold tabular-nums shadow-sm sm:bottom-2 sm:left-2 sm:h-7 sm:min-w-7 sm:text-xs",
                rank === 1 ? "bg-gold-grad text-white" : "bg-white/95 text-[#14213d]",
              )}
            >
              {rank}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sapphire-700 opacity-90 shadow-md transition-transform duration-200 group-hover:scale-110 sm:h-11 sm:w-11">
                <Play className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5" aria-hidden />
              </span>
            </span>
          </a>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          {rank === 1 || hasComments || !video.thumbnailUrl ? (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {rank === 1 ? (
                <span className="inline-flex items-center rounded-full bg-[var(--gold-200)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#92600f]">
                  Top pick
                </span>
              ) : null}
              {hasComments ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  Comments ready
                </span>
              ) : null}
              {!video.thumbnailUrl ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  <Youtube className="h-3 w-3" aria-hidden />
                  Short
                </span>
              ) : null}
            </div>
          ) : null}

          <h4 className="ds-h4 line-clamp-2 text-[1.05rem] leading-snug sm:text-[1.1875rem]">
            {video.title}
          </h4>
          <p className="mt-1 truncate text-sm font-medium text-text-secondary">
            {video.channelTitle}
            {published ? <span className="text-text-muted"> · {published}</span> : null}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#14213d]">
              <Eye className="h-4 w-4 text-sapphire-700" aria-hidden />
              {formatNumber(video.viewCount)}
              <span className="font-medium text-text-muted">views</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#14213d]">
              <TrendingUp className="h-4 w-4 text-sapphire-700" aria-hidden />
              {formatNumber(video.estimatedClicks)}
              <span className="inline-flex items-center gap-1 font-medium text-text-muted">
                est. clicks
                <InfoHint
                  side="bottom"
                  label="A rough guess of how many people could click your link if you comment on this video."
                />
              </span>
            </span>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                <Flame className="h-3.5 w-3.5 text-[#b7791f]" aria-hidden />
                Viral score
                <InfoHint
                  side="bottom"
                  label="How likely this video is to keep getting lots of views. A higher number means more people may see your comment."
                />
              </p>
              <p className="text-xs font-bold tabular-nums text-[#14213d]">
                {video.viralScore}
                <span className="font-medium text-text-muted">/100</span>
              </p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-sapphire-200">
              <div
                className={cn("h-full rounded-full transition-[width] duration-500", viralBarClass(video.viralScore))}
                style={{ width: `${Math.min(100, Math.max(0, video.viralScore))}%` }}
              />
            </div>
          </div>

          {generating ? (
            <div className="mt-4">
              <GenerationProgress label="AI writing your money-making comments..." />
            </div>
          ) : null}

          <div className="mt-auto flex gap-2 pt-4">
            <Button
              type="button"
              onClick={onGenerate}
              disabled={generating}
              className={cn("h-12 flex-1 text-base sm:h-14 sm:text-lg", generateCtaClass)}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5 fill-current" />
                  {hasComments ? "Regenerate Comments" : "Generate Comments"}
                </>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              className="glass h-12 w-12 shrink-0 border-2 border-[var(--border)] px-0 font-bold text-[#14213d] sm:h-14 sm:w-auto sm:px-4"
            >
              <a href={watchUrl} target="_blank" rel="noopener noreferrer" aria-label="Open video on YouTube">
                <ExternalLink className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Open</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {hasComments && comments ? (
        <div
          id={`comments-${video.videoId}`}
          className="space-y-3 border-t border-[var(--ds-line-sapphire)] bg-[var(--ds-sapphire-100)] px-4 py-5 sm:px-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[#14213d] sm:text-xl">Your generated comments</h3>
            <Button
              asChild
              size="sm"
              className="h-9 shrink-0 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-3 font-bold hover:from-[#1D4ED8] hover:to-[#1E40AF]"
            >
              <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Open Video</span>
              </a>
            </Button>
          </div>

          <div className="space-y-2.5">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-[var(--ds-line)] bg-white p-3.5 transition-colors hover:border-[var(--ds-line-sapphire)] sm:flex-row sm:items-start"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[11px] font-bold text-sapphire-700">
                    {index + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-[#14213d] sm:text-base">
                    {comment}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => onCopyComment(comment, index)}
                  size="sm"
                  className={cn(
                    "h-9 w-full shrink-0 rounded-lg px-3 font-bold transition-all sm:w-auto",
                    copiedIndex === `${video.videoId}-${index}`
                      ? "bg-[#16875c] text-white hover:bg-[#16875c]"
                      : "bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white hover:from-[#1D4ED8] hover:to-[#1D4ED8]",
                  )}
                >
                  {copiedIndex === `${video.videoId}-${index}` ? (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}
