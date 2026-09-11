"use client"

import { DfyResultPanel } from "@/app/(protected)/upgrades/dfy-profit/DfyResultPanel"
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"

type DfyProfitPreviewClientProps = {
  niche: string
  videos: DfyVideoResult[]
  article: DfyArticleResult
  posts: DfyFacebookPost[]
}

export function DfyProfitPreviewClient({
  niche,
  videos,
  article,
  posts,
}: DfyProfitPreviewClientProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-ink">DFY Profit kit preview</h1>
      <DfyResultPanel
        niche={niche}
        videos={videos}
        article={article}
        posts={posts}
        articleError=""
        postsError=""
        usedFallbackLink={false}
        isGeneratingArticle={false}
        isGeneratingPosts={false}
        retryingArticle={false}
        retryingPosts={false}
        onRetryArticle={() => undefined}
        onRetryPosts={() => undefined}
      />
    </div>
  )
}
