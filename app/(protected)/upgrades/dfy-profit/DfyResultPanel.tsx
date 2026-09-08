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
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"

interface DfyResultPanelProps {
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
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 border-b border-transparent bg-gradient-to-r from-sapphire-200 to-white px-4 py-3.5 transition-colors hover:bg-sapphire-200/30 group-open:border-border [&::-webkit-details-marker]:hidden">
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{title}</span>
        {count !== undefined && (
          <span className="shrink-0 rounded-full bg-sapphire-200 px-2.5 py-0.5 text-[13px] font-medium tabular-nums text-sapphire-700">
            {count}
          </span>
        )}
      </summary>
      <div className="space-y-3 bg-[var(--ds-canvas)]/40 p-3">{children}</div>
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

export function DfyResultPanel({
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
      <h2 className="text-lg font-medium text-foreground">Your Done-For-You kit</h2>

      <KitSection title="Videos to comment on" count={videos.length || undefined} defaultOpen={videos.length > 0}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-200 text-sapphire-700">
            <Youtube className="h-[18px] w-[18px]" />
          </div>
          <p className="text-sm text-muted-foreground">
            {videos.length > 0
              ? `${videos.length} videos with ready-to-copy comments`
              : "Your comment-ready videos will appear here."}
          </p>
        </div>

        {videos.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {videos.map((video) => (
              <article key={video.videoId} className="glass-card flex flex-col gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">{video.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{video.channelTitle}</p>
                </div>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex w-fit items-center gap-2 text-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open video
                </a>
                <div className="space-y-2 border-t border-border pt-3">
                  {video.comments.map((comment, index) => {
                    const id = `${video.videoId}-${index}`
                    const copied = copiedId === id
                    return (
                      <div key={id} className="rounded-xl border border-border bg-white p-3">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                          {comment}
                        </p>
                        <button
                          type="button"
                          onClick={() => void copyText(id, comment)}
                          className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium transition-colors ${
                            copied
                              ? "bg-sapphire-200 text-sapphire-700"
                              : "bg-sapphire-200/70 text-muted-foreground hover:bg-sapphire-200"
                          }`}
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </KitSection>

      <KitSection title="Authority article" count={article ? 1 : undefined} defaultOpen={Boolean(article)}>
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-[18px] w-[18px] shrink-0 text-sapphire-700" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{article?.title || "Authority article"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {article
                ? "Open the live page, or copy it to your blog, Medium, or LinkedIn."
                : retryingArticle || isGeneratingArticle
                  ? "Writing your authority article…"
                  : articleError || "Your copy-ready article will appear here."}
            </p>
          </div>
        </div>

        {isGeneratingArticle || retryingArticle ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generating your authority article…
          </p>
        ) : articleError ? (
          <button
            type="button"
            disabled={retryingArticle}
            onClick={onRetryArticle}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry article
          </button>
        ) : article ? (
          <div className="space-y-3">
            {article.saveWarning && (
              <p className="text-sm text-destructive">{article.saveWarning}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2 text-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open live article
                </a>
              )}
              {article.url && (
                <button
                  type="button"
                  onClick={() => void copyText("article-url", article.url!)}
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  {copiedId === "article-url" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === "article-url" ? "Copied" : "Copy URL"}
                </button>
              )}
            </div>
            <details open className="group overflow-hidden rounded-xl border border-border bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
                <FileText className="h-3.5 w-3.5 shrink-0 text-sapphire-700" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {article.title}
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    void copyText("article-html", article.html)
                  }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-sapphire-200 px-2.5 py-1 text-[13px] font-medium text-muted-foreground hover:bg-sapphire-200/70"
                >
                  {copiedId === "article-html" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedId === "article-html" ? "Copied" : "Copy HTML"}
                </button>
              </summary>
              <div
                className="prose prose-sm max-h-[560px] max-w-none overflow-y-auto border-t border-border bg-white px-5 py-6 text-foreground"
                dangerouslySetInnerHTML={{ __html: article.html }}
              />
              <div className="flex flex-wrap gap-2 border-t border-border p-3">
                <button
                  type="button"
                  onClick={() => void copyText("article-text", htmlToText(article.html))}
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  {copiedId === "article-text" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === "article-text" ? "Copied" : "Copy text"}
                </button>
              </div>
            </details>
          </div>
        ) : null}
      </KitSection>

      <KitSection title="Facebook posts" count={posts.length || undefined} defaultOpen={posts.length > 0}>
        <div className="flex items-start gap-3">
          <Megaphone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-sapphire-700" />
          <p className="text-sm text-muted-foreground">
            {posts.length > 0
              ? `${posts.length} ready-to-copy variants`
              : postsError || "Your Facebook post variants will appear here."}
          </p>
        </div>

        {usedFallbackLink && posts.length > 0 && (
          <p className="text-sm text-muted-foreground">
            These posts use your affiliate link directly, because the article was not saved.
          </p>
        )}

        {isGeneratingPosts && posts.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generating Facebook posts…
          </p>
        ) : postsError && posts.length === 0 ? (
          <button
            type="button"
            disabled={retryingPosts}
            onClick={onRetryPosts}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingPosts ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Retry Facebook posts
          </button>
        ) : posts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {posts.map((post, index) => {
              const copied = copiedId === post.id
              return (
                <article
                  key={post.id}
                  className="glass-card flex flex-col gap-3 p-4 transition-colors hover:border-[var(--ds-line-sapphire)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium uppercase tracking-wider text-sapphire-700">
                      Variant {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyText(post.id, post.body)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                        copied
                          ? "bg-sapphire-200 text-sapphire-700"
                          : "bg-sapphire-200/70 text-muted-foreground hover:bg-sapphire-200"
                      }`}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
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
