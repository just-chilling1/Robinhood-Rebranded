import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CommentPackViewer } from "./CommentPackViewer"
import ArticleContent from "./article-content"
import { parseArticlePayload } from "@/lib/dfy-profit/article-payload"

interface PageProps {
  params: Promise<{ slug: string }>
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const SELECT = "id, title, content, affiliate_link, status, views, created_at"

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  let { data: page } = await supabase
    .from("pages")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle()

  // Packs created before slugs were populated are linked by uuid.
  if (!page && UUID_RE.test(slug)) {
    const byId = await supabase.from("pages").select(SELECT).eq("id", slug).eq("status", "active").maybeSingle()
    page = byId.data
  }

  if (!page) {
    notFound()
  }

  const payload = parseArticlePayload(page.content)

  if (payload.kind === "pack") {
    return (
      <CommentPackViewer
        pageId={page.id}
        pack={{
          ...payload.pack,
          videoUrl: payload.pack.videoUrl || page.affiliate_link || "",
          videoTitle: payload.pack.videoTitle || page.title || "Comment Pack",
        }}
      />
    )
  }

  if (payload.kind === "html") {
    return (
      <ArticleContent
        page={{
          id: page.id,
          title: page.title,
          content: page.content,
          affiliate_link: page.affiliate_link,
          views: page.views ?? 0,
          created_at: page.created_at,
        }}
      />
    )
  }

  notFound()
}
