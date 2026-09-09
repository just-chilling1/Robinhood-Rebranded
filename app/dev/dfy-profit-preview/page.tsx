"use client"

import { DfyResultPanel } from "@/app/(protected)/upgrades/dfy-profit/DfyResultPanel"
import { buildFallbackArticle } from "@/lib/dfy-profit/article-fallback"
import { weaveAffiliateLinks } from "@/lib/dfy-profit/weave-affiliate-links"

const fallback = buildFallbackArticle({
  productName: "KetoMax",
  productContext: "a structured keto plan for beginners",
  niche: "Weight Loss",
})

/** Local preview only — middleware blocks /dev/* outside development. */
export default function DfyProfitPreviewPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-ink">DFY Profit kit preview</h1>
      <DfyResultPanel
        niche="Weight Loss"
        videos={[
          {
            videoId: "abc123",
            title: "He Left His Wife After This One Conversation",
            channelTitle: "Ai magical family",
            thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
            viewCount: 12000,
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            comments: [
              "I used to struggle with self-esteem around food. This honest sequence helped me stop guessing. https://example.com/offer",
              "If you keep restarting every Monday, skip the hype and try the weekly numbers approach in this guide: https://example.com/offer",
            ],
            usedFallbackComments: false,
          },
          {
            videoId: "def456",
            title: "The Weight Loss Tip Nobody Explains Clearly",
            channelTitle: "Everyday Health Talks",
            thumbnailUrl: "https://i.ytimg.com/vi/oHg5SJYRHA0/mqdefault.jpg",
            viewCount: 8400,
            videoUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
            comments: [
              "This is the first explanation that did not promise overnight results. Worth a read: https://example.com/offer",
            ],
            usedFallbackComments: false,
          },
        ]}
        article={{
          id: "preview",
          slug: "preview",
          url: "https://example.com/article/preview",
          title: fallback.title,
          excerpt: fallback.excerpt,
          html: weaveAffiliateLinks(fallback.html, "https://example.com/offer"),
        }}
        posts={[
          {
            id: "p1",
            body: "I wasted months collecting weight-loss tips that cancelled each other out. This guide finally put them in an order I could actually follow.\n\nhttps://example.com/article/preview",
          },
          {
            id: "p2",
            body: "If a plan only works on a motivated week, it is not a plan. This write-up is blunt about that, and it is the first one I have wanted to share.\n\nhttps://example.com/article/preview",
          },
          {
            id: "p3",
            body: "Curious why tracking three numbers beats a dashboard? I bookmarked this and started the weekly action the same day.\n\nhttps://example.com/article/preview",
          },
        ]}
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
