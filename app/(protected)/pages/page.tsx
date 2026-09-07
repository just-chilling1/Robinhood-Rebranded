import { redirect } from "next/navigation"
import { Fragment } from "react"
import Link from "next/link"
import { Calendar, Copy, Eye, Flame, MessageCircle, Youtube, Zap } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { EarningsBanner } from "@/components/earnings-banner"
import { PageHeader } from "@/components/page-header"
import { PageActions } from "@/components/page-actions"

const EMPTY_STEPS = [
  { n: 1, title: "Generate", body: "Open Gold Rush and create your first AI comment pack." },
  { n: 2, title: "Copy", body: "Pick a comment you like — one click and it’s on your clipboard." },
  { n: 3, title: "Paste", body: "Drop it on the YouTube Short so your profile sends traffic to your link." },
] as const

const USE_STEPS = [
  { n: 1, title: "View comments", body: "Open the pack and copy one." },
  { n: 2, title: "Open the Short", body: "Jump to the YouTube video." },
  { n: 3, title: "Paste & post", body: "Your profile drives the affiliate traffic." },
] as const

function parseComments(content: string | null | undefined): string[] {
  try {
    const pack = JSON.parse(content || '{"comments":[]}')
    if (Array.isArray(pack.comments)) return pack.comments
    if (Array.isArray(pack)) return pack
    return []
  } catch {
    return []
  }
}

export default async function MyVaultPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: pages } = await supabase
    .from("pages")
    .select(
      `
      *,
      niches (name, icon)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const isEmpty = !pages || pages.length === 0

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="My Vault"
        title="Your Comment Vault"
        subtitle="All your AI-generated comment packs in one place 🔥"
        actions={
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/create">
              <Flame className="h-5 w-5" />
              Generate New Pack
            </Link>
          </Button>
        }
      />

      {isEmpty ? (
        <EmptyVault />
      ) : (
        <div className="space-y-6">
          <HowToUseStrip />
          <div className="grid grid-cols-1 gap-5">
            {pages.map((page, index) => {
              const comments = parseComments(page.content)
              const niche = Array.isArray(page.niches) ? page.niches[0] : page.niches
              return (
                <Fragment key={page.id}>
                  <PackCard
                    offerName={page.offer_name || "Comment Pack"}
                    videoTitle={page.video_title || page.title}
                    nicheIcon={niche?.icon}
                    commentCount={comments.length}
                    views={page.views || 0}
                    clicks={page.clicks || 0}
                    createdAt={page.created_at}
                    pageId={page.id}
                    affiliateLink={page.video_url || page.affiliate_link || ""}
                    videoUrl={page.video_url}
                    comments={comments}
                  />
                  {(index + 1) % 2 === 0 ? <EarningsBanner size="compact" /> : null}
                </Fragment>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyVault() {
  return (
    <section className="page-section-card px-6 py-10 text-center sm:px-10 sm:py-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-200">
        <Zap className="h-8 w-8 text-sapphire-700" />
      </div>
      <h2 className="ds-h2">Your Vault is Empty</h2>
      <p className="ds-subtitle mx-auto mt-2">
        Fire up Gold Rush and create your first AI comment pack in about a minute.
      </p>

      <ol className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
        {EMPTY_STEPS.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] p-4"
          >
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-200 text-sm font-bold text-sapphire-700">
              {step.n}
            </span>
            <p className="text-sm font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">{step.body}</p>
          </li>
        ))}
      </ol>

      <Button asChild size="lg" className="mt-8">
        <Link href="/create">
          <Flame className="h-5 w-5" />
          Start Making Packs Now
        </Link>
      </Button>
    </section>
  )
}

function HowToUseStrip() {
  return (
    <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface)] p-4 shadow-card sm:px-5">
      <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-4">How to use a pack</p>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {USE_STEPS.map((step) => (
          <li key={step.n} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-200 text-xs font-bold text-sapphire-700">
              {step.n}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="text-sm text-ink-3">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function PackCard({
  offerName,
  videoTitle,
  nicheIcon,
  commentCount,
  views,
  clicks,
  createdAt,
  pageId,
  affiliateLink,
  videoUrl,
  comments,
}: {
  offerName: string
  videoTitle: string | null
  nicheIcon?: string | null
  commentCount: number
  views: number
  clicks: number
  createdAt: string
  pageId: string
  affiliateLink: string
  videoUrl?: string | null
  comments: string[]
}) {
  return (
    <article className="page-section-card transition-shadow hover:shadow-hover">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-200 text-2xl">
          {nicheIcon || "💎"}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="ds-h3 truncate">{offerName}</h2>
          {videoTitle ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-3">
              <Youtube className="h-4 w-4 shrink-0" />
              <span className="truncate">{videoTitle}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatChip icon={MessageCircle} label="Comments" value={commentCount} />
        <StatChip
          icon={Eye}
          label="Opens"
          value={views}
          hint="How many times people have opened this comment pack."
        />
        <StatChip
          icon={Copy}
          label="Copies"
          value={clicks}
          hint="How many times a comment from this pack has been copied."
        />
        <StatChip
          icon={Calendar}
          label="Created"
          value={new Date(createdAt).toLocaleDateString()}
        />
      </div>

      <PageActions pageId={pageId} affiliateLink={affiliateLink} videoUrl={videoUrl ?? undefined} comments={comments} />
    </article>
  )
}

function StatChip({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Eye
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] px-3 py-1.5">
      <Icon className="h-3.5 w-3.5 text-sapphire-700" />
      <span className="text-sm font-semibold tabular-nums text-ink">{value}</span>
      <span className="text-xs font-semibold text-ink-4">{label}</span>
      {hint ? <InfoHint label={hint} /> : null}
    </div>
  )
}
