"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, FileText, Loader2, Megaphone, RefreshCw, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  onRetryArticle: () => void
  onRetryPosts: () => void
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

export function DfyResultPanel(props: DfyResultPanelProps) {
  const { videos, article, posts, articleError, postsError, usedFallbackLink } = props
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  if (videos.length === 0 && !article && posts.length === 0 && !articleError && !postsError) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="ds-h2">Your Done-For-You kit</h2>

      {videos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-[#1d4ed8]" />
            <h3 className="ds-h3">Videos to comment on</h3>
            <span className="text-sm text-muted-foreground">{videos.length} ready</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((video) => (
              <Card key={video.videoId} className="glass-card border-border">
                <CardContent className="space-y-3 p-5">
                  <p className="font-medium leading-snug text-foreground">{video.title}</p>
                  <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1d4ed8]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open video
                  </a>
                  <div className="space-y-2 border-t border-border pt-3">
                    {video.comments.map((comment, index) => {
                      const id = `${video.videoId}-${index}`
                      return (
                        <div key={id} className="rounded-xl bg-muted/40 p-3">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{comment}</p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => copy(id, comment)}>
                            {copiedId === id ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                            {copiedId === id ? "Copied" : "Copy comment"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="glass-card border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#1d4ed8]" />
            <h3 className="ds-h3">Authority article</h3>
          </div>

          {props.isGeneratingArticle ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Writing your authority article...
            </p>
          ) : articleError ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{articleError}</p>
              <Button variant="outline" onClick={props.onRetryArticle}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry article
              </Button>
            </div>
          ) : article ? (
            <div className="space-y-3">
              <p className="font-medium text-foreground">{article.title}</p>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              {article.saveWarning && <p className="text-sm text-destructive">{article.saveWarning}</p>}
              <div className="flex flex-wrap gap-2">
                {article.url && (
                  <Button asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Open live article
                    </a>
                  </Button>
                )}
                {article.url && (
                  <Button variant="outline" onClick={() => copy("article-url", article.url!)}>
                    {copiedId === "article-url" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                    {copiedId === "article-url" ? "Copied" : "Copy link"}
                  </Button>
                )}
                <Button variant="outline" onClick={() => copy("article-text", htmlToText(article.html))}>
                  {copiedId === "article-text" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                  {copiedId === "article-text" ? "Copied" : "Copy text"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Your authority article will appear here.</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#1d4ed8]" />
            <h3 className="ds-h3">Facebook posts</h3>
          </div>

          {usedFallbackLink && posts.length > 0 && (
            <p className="text-sm text-muted-foreground">
              These posts use your affiliate link directly, because the article was not saved.
            </p>
          )}

          {props.isGeneratingPosts ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Facebook posts...
            </p>
          ) : postsError ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{postsError}</p>
              <Button variant="outline" onClick={props.onRetryPosts}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry Facebook posts
              </Button>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {posts.map((post, index) => (
                <div key={post.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#1d4ed8]">Post {index + 1}</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{post.body}</p>
                  <Button variant="outline" size="sm" className="mt-auto" onClick={() => copy(post.id, post.body)}>
                    {copiedId === post.id ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                    {copiedId === post.id ? "Copied" : "Copy post"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Your Facebook posts will appear here.</p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
