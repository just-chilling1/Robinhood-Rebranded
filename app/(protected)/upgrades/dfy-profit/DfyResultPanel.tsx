"use client"

import { useCallback, useState, type ReactNode } from "react"
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Megaphone,
  RefreshCw,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"
import { cn } from "@/lib/utils"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:shadow-sapphire"

const outlineCtaClass =
  "rounded-xl border-2 border-[var(--ds-line-strong)] bg-white font-medium !text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:!text-sapphire-700 hover:shadow-hover"

const POST_ACCENTS = [
  {
    bar: "border-l-primary",
    chip: "bg-sapphire-200 text-sapphire-700",
    card: "bg-sapphire-100",
  },
  {
    bar: "border-l-[var(--ds-line-sapphire)]",
    chip: "bg-grad-sapphire text-white",
    card: "bg-[var(--ds-canvas)]",
  },
  {
    bar: "border-l-[var(--ds-sapphire-500)]",
    chip: "bg-[var(--ds-offer-green-200)] text-sapphire-700",
    card: "bg-[var(--ds-offer-green-100)]",
  },
] as const

interface DfyResultPanelProps {
  niche: string
  videos: DfyVideoResult[]
  article: DfyArticleResult | null
  posts: DfyFacebookPost[]
  articleError: string
  postsError: string
  usedFallbackLink: boolean
  isGeneratingArticle: boolean
  isGeneratingPosts: boolean
  retryingArticle: boolean
  retryingPosts: boolean
  onRetryArticle: () => void
  onRetryPosts: () => void
}

function KitSection({
  title,
  count,
  defaultOpen = true,
  tone = "neutral",
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  tone?: "neutral" | "video" | "social"
  children: ReactNode
}) {
  const toneClass = {
    neutral: "border-[var(--ds-line-strong)]",
    video: "border-[var(--ds-line-sapphire)]",
    social: "border-[var(--ds-line-offer)]",
  }[tone]
  const headerClass = {
    neutral: "bg-surface-nested",
    video: "bg-sapphire-200",
    social: "bg-[var(--ds-offer-green-200)]",
  }[tone]

  return (
    <details
      open={defaultOpen}
      className={cn("group overflow-hidden rounded-2xl border-2 bg-white shadow-[var(--ds-shadow-raised)]", toneClass)}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-3 border-b-2 border-transparent px-4 py-3.5 transition-colors hover:bg-surface-hover group-open:border-[var(--ds-line-strong)] [&::-webkit-details-marker]:hidden",
          headerClass,
        )}
      >
        <ChevronDown className="h-4 w-4 shrink-0 text-ink transition-transform group-open:rotate-180" />
        <span className="min-w-0 flex-1 text-sm font-semibold text-ink">{title}</span>
        {count !== undefined && (
          <span className="shrink-0 rounded-full bg-grad-sapphire px-2.5 py-0.5 text-[13px] font-medium tabular-nums text-white">
            {count}
          </span>
        )}
      </summary>
      <div className="space-y-3 bg-[var(--ds-canvas)] p-3 sm:p-4">{children}</div>
    </details>
  )
}

function htmlToText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function CopyButton({
  copied,
  onClick,
  label = "Copy",
  copiedLabel = "Copied",
  size = "sm",
}: {
  copied: boolean
  onClick: () => void
  label?: string
  copiedLabel?: string
  size?: "sm" | "md"
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        size === "sm" ? "h-10 px-4 text-sm" : "h-11 px-4",
        copied ? "rounded-xl bg-sapphire-500 font-semibold text-white hover:bg-sapphire-500" : primaryCtaClass,
      )}
    >
      {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
      {copied ? copiedLabel : label}
    </Button>
  )
}

export function DfyResultPanel({
  niche,
  videos,
  article,
  posts,
  articleError,
  postsError,
  usedFallbackLink,
  isGeneratingArticle,
  isGeneratingPosts,
  retryingArticle,
  retryingPosts,
  onRetryArticle,
  onRetryPosts,
}: DfyResultPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyText = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* ignore */
    }
  }, [])

  if (
    videos.length === 0 &&
    !article &&
    posts.length === 0 &&
    !articleError &&
    !postsError
  ) {
    return null
  }

  return (
    <section id="dfy-profit-results" className="scroll-mt-24 space-y-4">
      <h2 className="text-lg font-semibold text-ink">Your Done-For-You kit</h2>

      <KitSection
        title="Videos to comment on"
        count={videos.length || undefined}
        defaultOpen={videos.length > 0}
        tone="video"
      >
        <div className="flex items-center gap-3 rounded-xl border border-[var(--ds-line-sapphire)] bg-white px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
            <Youtube className="h-[18px] w-[18px]" />
          </div>
          <p className="text-sm font-medium text-ink">
            {videos.length > 0
              ? `${videos.length} videos with ready-to-copy comments`
              : "Your comment-ready videos will appear here."}
          </p>
        </div>

        {videos.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((video) => (
              <article
                key={video.videoId}
                className="overflow-hidden rounded-2xl border-2 border-[var(--ds-line-sapphire)] bg-card shadow-[var(--ds-shadow-card)]"
              >
                <div className="flex gap-3 bg-sapphire-100 p-4 text-ink">
                  {video.thumbnailUrl ? (
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-[4.75rem] w-[8.5rem] shrink-0 overflow-hidden rounded-lg bg-white/10"
                      aria-label={`Open ${video.title} on YouTube`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-sapphire-700">
                      {video.channelTitle}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-ink">
                      {video.title}
                    </p>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "mt-3 inline-flex h-10 items-center gap-2 px-4 text-sm",
                        primaryCtaClass,
                      )}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open video
                    </a>
                  </div>
                </div>
                <div className="space-y-2.5 bg-sapphire-200 p-4">
                  {video.comments.map((comment, index) => {
                    const id = `${video.videoId}-${index}`
                    const copied = copiedId === id
                    return (
                      <div
                        key={id}
                        className="flex flex-col gap-3 rounded-xl border-2 border-[var(--ds-line-strong)] border-l-4 border-l-primary bg-white p-3.5 shadow-sm sm:flex-row sm:items-start"
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[11px] font-bold text-sapphire-700">
                            {index + 1}
                          </span>
                          <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-ink">
                            {comment}
                          </p>
                        </div>
                        <CopyButton copied={copied} onClick={() => void copyText(id, comment)} />
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </KitSection>

      {isGeneratingArticle || retryingArticle ? (
        <section className="overflow-hidden rounded-2xl border-2 border-[var(--ds-line-strong)] bg-card shadow-[var(--ds-shadow-card)]">
          <div className="flex items-center gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 px-5 py-4 text-ink md:px-6">
            <FileText className="h-5 w-5 shrink-0 text-sapphire-700" aria-hidden />
            <p className="text-sm font-semibold">Writing your authority article…</p>
          </div>
          <p className="inline-flex items-center gap-2 px-5 py-6 text-sm font-medium text-ink">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generating a long-form guide with your offer woven in.
          </p>
        </section>
      ) : articleError ? (
        <section className="overflow-hidden rounded-2xl border-2 border-[var(--ds-line-strong)] bg-card p-5 shadow-[var(--ds-shadow-card)]">
          <p className="text-sm font-medium text-destructive">{articleError}</p>
          <Button
            type="button"
            disabled={retryingArticle}
            onClick={onRetryArticle}
            variant="outline"
            className={cn("mt-3 h-11 px-4 disabled:opacity-50", outlineCtaClass)}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retry article
          </Button>
        </section>
      ) : article ? (
        <section className="overflow-hidden rounded-2xl border-2 border-[var(--ds-line-strong)] bg-card shadow-[var(--ds-shadow-card)]">
          {article.saveWarning ? (
            <p className="border-b border-[var(--ds-line)] bg-[#FDE4E4] px-5 py-3 text-sm font-medium text-[#C53030]">
              {article.saveWarning}
            </p>
          ) : null}
          <div className="flex items-start justify-between gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 px-5 py-4 text-ink md:px-6">
            <div className="min-w-0">
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-sapphire-700">
                {niche || "Authority article"}
              </p>
              <h3 className="mt-1 text-lg font-medium leading-snug text-ink">{article.title}</h3>
              {article.excerpt ? (
                <p className="mt-2 text-sm leading-relaxed text-ink-3">{article.excerpt}</p>
              ) : null}
            </div>
            <FileText className="mt-1 h-5 w-5 shrink-0 text-sapphire-700" aria-hidden />
          </div>
          <div
            className="article-body max-h-[min(70vh,720px)] max-w-none overflow-y-auto bg-card px-5 py-6 md:px-8 md:py-8"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.html) }}
          />
          <div className="flex flex-wrap gap-2 border-t-2 border-[var(--ds-line-strong)] bg-surface-nested px-5 py-4 md:px-6">
            {article.url ? (
              <Button asChild className={cn("h-11 px-4", primaryCtaClass)}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open live article
                </a>
              </Button>
            ) : null}
            {article.url ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void copyText("article-url", article.url!)}
                className={cn("h-11 px-4", outlineCtaClass)}
              >
                {copiedId === "article-url" ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copiedId === "article-url" ? "Copied" : "Copy URL"}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => void copyText("article-text", `${article.title}\n\n${htmlToText(article.html)}`)}
              className={cn("h-11 px-4", outlineCtaClass)}
            >
              {copiedId === "article-text" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copiedId === "article-text" ? "Copied" : "Copy plain text"}
            </Button>
            <Button
              type="button"
              onClick={() => void copyText("article-html", article.html)}
              className={cn(
                "h-11 px-4",
                copiedId === "article-html"
                  ? "rounded-xl bg-sapphire-500 font-semibold text-white hover:bg-sapphire-500"
                  : primaryCtaClass,
              )}
            >
              {copiedId === "article-html" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copiedId === "article-html" ? "Copied" : "Copy HTML"}
            </Button>
          </div>
        </section>
      ) : null}

      <KitSection
        title="Facebook posts"
        count={posts.length || undefined}
        defaultOpen={posts.length > 0}
        tone="social"
      >
        <div className="flex items-start gap-3 rounded-xl border border-[var(--ds-line-offer)] bg-white px-3 py-3">
          <Megaphone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-sapphire-700" />
          <p className="text-sm font-medium text-ink">
            {posts.length > 0
              ? `${posts.length} ready-to-copy variants`
              : postsError || "Your Facebook post variants will appear here."}
          </p>
        </div>

        {usedFallbackLink && posts.length > 0 && (
          <p className="text-sm font-medium text-ink">
            These posts use your affiliate link directly, because the article was not saved.
          </p>
        )}

        {isGeneratingPosts && posts.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generating Facebook posts…
          </p>
        ) : postsError && posts.length === 0 ? (
          <Button
            type="button"
            disabled={retryingPosts}
            onClick={onRetryPosts}
            variant="outline"
            className={cn("h-11 px-4 disabled:opacity-50", outlineCtaClass)}
          >
            {retryingPosts ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
            )}
            Retry Facebook posts
          </Button>
        ) : posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post, index) => {
              const copied = copiedId === post.id
              const accent = POST_ACCENTS[index % POST_ACCENTS.length]
              return (
                <article
                  key={post.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border-2 border-[var(--ds-line-strong)] border-l-4 p-4 shadow-[var(--ds-shadow-card)]",
                    accent.bar,
                    accent.card,
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                        accent.chip,
                      )}
                    >
                      Variant {index + 1}
                    </p>
                    <CopyButton copied={copied} onClick={() => void copyText(post.id, post.body)} />
                  </div>
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-ink">
                    {post.body}
                  </p>
                </article>
              )
            })}
          </div>
        ) : null}
      </KitSection>
    </section>
  )
}
