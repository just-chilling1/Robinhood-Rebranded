"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Filter,
  FolderOpen,
  Loader2,
  BookOpen,
  X,
} from "lucide-react"
import type { AffiliateLink } from "@/app/actions/affiliate-links"
import { CrossPlatformGuide } from "@/components/cross-platform-guide"
import { GenerationProgress } from "@/components/generation-progress"
import { PageHeader } from "@/components/page-header"
import { PremiumFeatureBanner, PremiumSteps } from "@/components/premium-feature-chrome"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import { wrapArticleWithTitle } from "@/lib/high-ticket-payouts/article-content"
import {
  ARTICLE_CATALOG,
  HIGH_TICKET_ARTICLE_TARGET_COUNT,
  HIGH_TICKET_NICHES,
  weaveAffiliateLink,
  type HighTicketArticle,
} from "@/lib/high-ticket-payouts/catalog"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 24
const LINK_STORAGE_KEY = "wifi_code_high_ticket_link_id"
const PASTE_MODE = "__paste__"

const fieldClassName =
  "w-full min-w-0 rounded-xl border-[1.5px] border-[var(--border-strong)] bg-card px-3.5 py-3 text-sm leading-normal text-foreground placeholder:text-muted-foreground hover:border-[var(--ds-sapphire-300)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary"

const STEPS = [
  {
    num: "1",
    title: "Pick your offer link",
    desc: "Choose a saved Link Vault offer, or paste any affiliate URL. We weave it into every article automatically.",
  },
  {
    num: "2",
    title: "Preview an article",
    desc: "Filter by niche, open any of the 100 long-form templates, and confirm your link sits in the CTA.",
  },
  {
    num: "3",
    title: "Publish anywhere",
    desc: "Copy plain text for Medium / LinkedIn, or HTML for your blog. One article per week builds lasting traffic.",
  },
] as const

function formatAngle(angle: string): string {
  return angle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function linkLabel(link: AffiliateLink): string {
  return link.niche ? `${link.offer_name} · ${link.niche}` : link.offer_name
}

export function HighTicketPayoutsContent({ links }: { links: AffiliateLink[] }) {
  const [niche, setNiche] = useState("all")
  const [selectedLinkId, setSelectedLinkId] = useState("")
  const [pastedLink, setPastedLink] = useState("")
  const [previewId, setPreviewId] = useState<number | null>(null)
  const [articleHtml, setArticleHtml] = useState<Record<number, string>>({})
  const [loadingAction, setLoadingAction] = useState<{
    articleId: number
    action: "view" | "copy"
  } | null>(null)
  const [copiedMode, setCopiedMode] = useState<"text" | "html" | null>(null)
  const [copiedArticleId, setCopiedArticleId] = useState<number | null>(null)
  const [page, setPage] = useState(0)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)

  const resultsRef = useScrollToResults(showResults && previewId != null)

  useEffect(() => {
    if (links.length === 0) return

    let fromStorage: string | null = null
    try {
      fromStorage = localStorage.getItem(LINK_STORAGE_KEY)
    } catch {
      /* ignore */
    }

    const preferred =
      fromStorage && links.some((l) => l.id === fromStorage) ? fromStorage : links[0].id
    setSelectedLinkId(preferred)
  }, [links])

  useEffect(() => {
    if (!selectedLinkId || selectedLinkId === PASTE_MODE) return
    try {
      localStorage.setItem(LINK_STORAGE_KEY, selectedLinkId)
    } catch {
      /* ignore */
    }
  }, [selectedLinkId])

  const selectedVaultLink = useMemo(
    () => links.find((l) => l.id === selectedLinkId) ?? null,
    [links, selectedLinkId],
  )

  const activeAffiliateUrl = useMemo(() => {
    if (selectedLinkId === PASTE_MODE) return pastedLink.trim()
    return selectedVaultLink?.affiliate_url.trim() ?? ""
  }, [pastedLink, selectedLinkId, selectedVaultLink])

  const filteredArticles = useMemo(() => {
    if (niche === "all") return ARTICLE_CATALOG
    return ARTICLE_CATALOG.filter((a) => a.niche === niche)
  }, [niche])

  useEffect(() => {
    setPage(0)
    setPreviewId(null)
  }, [niche])

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const paged = useMemo(
    () => filteredArticles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filteredArticles, page],
  )

  const previewArticle =
    previewId != null ? (ARTICLE_CATALOG.find((a) => a.id === previewId) ?? null) : null

  const personalizeArticle = async (
    article: HighTicketArticle,
    action: "view" | "copy",
  ): Promise<string | null> => {
    if (!activeAffiliateUrl) {
      setError("Select a Link Vault offer or paste your affiliate link first.")
      return null
    }

    if (articleHtml[article.id]) {
      setError("")
      return articleHtml[article.id]
    }

    setLoadingAction({ articleId: article.id, action })
    setError("")
    setShowResults(false)

    await new Promise((resolve) => setTimeout(resolve, 1800))

    const woven = weaveAffiliateLink(article.html, activeAffiliateUrl)
    setArticleHtml((prev) => ({ ...prev, [article.id]: woven }))
    setLoadingAction(null)
    setShowResults(true)
    return woven
  }

  const openPreview = async (articleId: number) => {
    if (previewId === articleId) {
      setPreviewId(null)
      return
    }
    const article = ARTICLE_CATALOG.find((a) => a.id === articleId)
    if (!article) return
    const html = await personalizeArticle(article, "view")
    if (html) setPreviewId(articleId)
  }

  const copyArticleFromCard = async (articleId: number) => {
    const article = ARTICLE_CATALOG.find((a) => a.id === articleId)
    if (!article) return
    const html = await personalizeArticle(article, "copy")
    if (!html) return

    const exportHtml = wrapArticleWithTitle(article.title, html)
    const payload = `${article.title}\n\n${htmlToPlainText(exportHtml)}`
    await navigator.clipboard.writeText(payload)
    setCopiedArticleId(articleId)
    setTimeout(() => setCopiedArticleId(null), 2000)
  }

  const copyArticle = async (mode: "text" | "html") => {
    if (previewId == null) return
    const html = articleHtml[previewId]
    const article = ARTICLE_CATALOG.find((a) => a.id === previewId)
    if (!html || !article) return

    const exportHtml = wrapArticleWithTitle(article.title, html)
    const payload =
      mode === "html" ? exportHtml : `${article.title}\n\n${htmlToPlainText(exportHtml)}`

    await navigator.clipboard.writeText(payload)
    setCopiedMode(mode)
    setTimeout(() => setCopiedMode(null), 2000)
  }

  useEffect(() => {
    setArticleHtml({})
    setPreviewId(null)
  }, [activeAffiliateUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-7xl space-y-10 pb-16"
    >
      <PageHeader
        eyebrow="Premium"
        title={PREMIUM_FEATURE_LABELS.highTicketPayouts}
        subtitle={`${HIGH_TICKET_ARTICLE_TARGET_COUNT} long-form authority articles — pick a Link Vault offer, preview with your affiliate link woven in, and publish on Medium, LinkedIn, Quora, or your own blog.`}
      />

      <PremiumVideoTutorial
        vimeoId={getPremiumTrainingVimeoId("highTicketPayouts")}
        title={`${PREMIUM_FEATURE_LABELS.highTicketPayouts} Training`}
        description="A short walkthrough: pick a template, preview with your offer link inside, then publish on Medium, LinkedIn, or your blog."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.highTicketPayouts} training video`}
      />

      <PremiumFeatureBanner
        icon={BookOpen}
        kicker="Authority library"
        title={`${HIGH_TICKET_ARTICLE_TARGET_COUNT} ready articles`}
        description="Weave your offer link into a long-form template, preview it, then copy plain text or HTML for Medium, LinkedIn, or your blog."
        chip="Publish anywhere"
      />

      <PremiumSteps title="Three quiet steps" steps={STEPS} />

      <section className="rounded-xl border border-[var(--ds-line)] bg-card p-5 sm:p-8">
        <div className="mb-6">
          <p className="page-eyebrow mb-2">Your offer</p>
          <h2 className="text-xl font-medium text-ink">Select your offer link</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Previews weave this URL into every article CTA. You can switch offers anytime.
          </p>
        </div>

        <div className="space-y-5">
          {links.length === 0 && selectedLinkId !== PASTE_MODE ? (
            <div className="rounded-xl border border-dashed border-[var(--ds-line)] bg-surface-nested px-5 py-8 text-center">
              <FolderOpen className="mx-auto mb-3 h-6 w-6 text-text-secondary" aria-hidden />
              <p className="text-sm text-text-secondary">
                Save an offer in Link Vault first, or paste a link below.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Button asChild size="sm" className="font-medium">
                  <Link href="/share">Open Link Vault</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-medium"
                  onClick={() => setSelectedLinkId(PASTE_MODE)}
                >
                  Paste a link instead
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="offer-link" className={labelClassName}>
                  Link Vault offer
                </Label>
                <select
                  id="offer-link"
                  value={selectedLinkId}
                  onChange={(e) => setSelectedLinkId(e.target.value)}
                  className={fieldClassName}
                >
                  {links.map((link) => (
                    <option key={link.id} value={link.id}>
                      {linkLabel(link)}
                    </option>
                  ))}
                  <option value={PASTE_MODE}>Paste a link instead…</option>
                </select>
              </div>

              {selectedVaultLink && selectedLinkId !== PASTE_MODE ? (
                <p
                  role="status"
                  className="flex items-start gap-2.5 rounded-lg border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-3.5 py-2.5 text-sm font-medium text-[#147551]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16875C]" aria-hidden />
                  <span>
                    Link armed from Link Vault
                    {selectedVaultLink.niche ? ` · ${selectedVaultLink.niche}` : ""}. Previews will
                    weave this URL into each article.
                  </span>
                </p>
              ) : null}
            </>
          )}

          {(selectedLinkId === PASTE_MODE || links.length === 0) && (
            <div>
              <Label htmlFor="pasted-affiliate-link" className={labelClassName}>
                Paste your affiliate link
              </Label>
              <Input
                id="pasted-affiliate-link"
                type="url"
                placeholder="https://your-affiliate-link.com"
                value={pastedLink}
                onChange={(e) => {
                  setPastedLink(e.target.value)
                  if (selectedLinkId !== PASTE_MODE) setSelectedLinkId(PASTE_MODE)
                }}
                className={fieldClassName}
              />
              {pastedLink.trim() ? (
                <p
                  role="status"
                  className="mt-2 flex items-start gap-2.5 rounded-lg border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-3.5 py-2.5 text-sm font-medium text-[#147551]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16875C]" aria-hidden />
                  <span>Link ready — previews will weave this URL into each article.</span>
                </p>
              ) : null}
            </div>
          )}

          <div>
            <p className={cn(labelClassName, "mb-3 flex items-center gap-2")}>
              <Filter className="h-3.5 w-3.5" aria-hidden />
              Filter by niche
            </p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by niche">
              <button
                type="button"
                onClick={() => setNiche("all")}
                aria-pressed={niche === "all"}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                  niche === "all"
                    ? "bg-grad-sapphire text-white shadow-sapphire"
                    : "border border-[var(--ds-line)] bg-surface-nested text-text-secondary hover:border-[var(--ds-line-sapphire)] hover:text-ink",
                )}
              >
                All niches
              </button>
              {HIGH_TICKET_NICHES.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setNiche(n)}
                  aria-pressed={niche === n}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                    niche === n
                      ? "bg-grad-sapphire text-white shadow-sapphire"
                      : "border border-[var(--ds-line)] bg-surface-nested text-text-secondary hover:border-[var(--ds-line-sapphire)] hover:text-ink",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200/80 bg-red-50/80 px-3.5 py-2.5 text-sm text-red-700"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}
        </div>
      </section>

      <CrossPlatformGuide />

      {loadingAction ? (
        <GenerationProgress
          offer="welcome"
          label="Personalizing article with your affiliate link..."
        />
      ) : showResults ? (
        <WelcomeOfferBanner />
      ) : null}

      <AnimatePresence>
        {previewArticle && articleHtml[previewArticle.id] ? (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="scroll-mt-24 overflow-hidden rounded-xl border border-[var(--ds-line)] bg-card"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--ds-line)] px-5 py-4 md:px-6">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sapphire-700">
                  {previewArticle.niche}
                </p>
                <h2 className="mt-1 text-lg font-medium text-ink">{previewArticle.title}</h2>
                <span className="mt-2 inline-block rounded-full bg-surface-nested px-2.5 py-0.5 text-[12px] font-medium text-text-secondary">
                  {formatAngle(previewArticle.angle)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewId(null)}
                className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-nested hover:text-ink"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="article-body max-h-[min(70vh,720px)] max-w-none overflow-y-auto bg-[var(--card)] px-5 py-6 md:px-8 md:py-8"
              dangerouslySetInnerHTML={{
                __html: wrapArticleWithTitle(previewArticle.title, articleHtml[previewArticle.id]),
              }}
            />
            <div className="flex flex-wrap gap-2 border-t border-[var(--ds-line)] px-5 py-4 md:px-6">
              <Button
                type="button"
                onClick={() => void copyArticle("text")}
                variant="outline"
                size="sm"
                className="font-medium"
              >
                {copiedMode === "text" ? (
                  <Check size={14} className="mr-2" />
                ) : (
                  <Copy size={14} className="mr-2" />
                )}
                {copiedMode === "text" ? "Copied" : "Copy plain text"}
              </Button>
              <Button type="button" onClick={() => void copyArticle("html")} size="sm" className="font-medium">
                {copiedMode === "html" ? (
                  <Check size={14} className="mr-2" />
                ) : (
                  <Copy size={14} className="mr-2" />
                )}
                {copiedMode === "html" ? "Copied" : "Copy HTML"}
              </Button>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="page-eyebrow mb-1">Library</p>
            <h2 className="text-xl font-medium text-ink">Authority articles</h2>
          </div>
          <p className="text-sm text-text-secondary">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
            {niche !== "all" ? ` in ${niche}` : ""}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((article) => (
            <article
              key={article.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-[var(--ds-line)] bg-card p-4 transition-colors",
                previewId === article.id
                  ? "border-[var(--ds-line-sapphire)] bg-sapphire-200/30"
                  : "hover:border-[var(--ds-line-strong)]",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sapphire-700">
                    {article.niche}
                  </p>
                  <span className="shrink-0 rounded-full bg-surface-nested px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                    {formatAngle(article.angle)}
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-ink">
                  {article.title}
                </h3>
                {article.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-secondary">
                    {article.excerpt}
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex gap-2">
                <Button
                  type="button"
                  disabled={loadingAction?.articleId === article.id || !activeAffiliateUrl}
                  onClick={() => void openPreview(article.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 font-medium disabled:opacity-40"
                >
                  {loadingAction?.articleId === article.id && loadingAction.action === "view" ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Eye size={14} className="mr-1.5" />
                  )}
                  {previewId === article.id ? "Close" : "View"}
                </Button>
                <Button
                  type="button"
                  disabled={loadingAction?.articleId === article.id || !activeAffiliateUrl}
                  onClick={() => void copyArticleFromCard(article.id)}
                  size="sm"
                  className="flex-1 font-medium disabled:opacity-40"
                >
                  {loadingAction?.articleId === article.id && loadingAction.action === "copy" ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : copiedArticleId === article.id ? (
                    <Check size={14} className="mr-1.5" />
                  ) : (
                    <Copy size={14} className="mr-1.5" />
                  )}
                  {copiedArticleId === article.id ? "Copied" : "Copy"}
                </Button>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">No articles in this niche yet.</p>
        ) : null}

        {pageCount > 1 ? (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              variant="outline"
              size="sm"
              className="font-medium disabled:opacity-40"
            >
              <ChevronLeft size={14} className="mr-1" />
              Prev
            </Button>
            <span className="text-xs text-text-secondary">
              Page {page + 1} of {pageCount}
            </span>
            <Button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              variant="outline"
              size="sm"
              className="font-medium disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        ) : null}
      </section>
    </motion.div>
  )
}
