"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { clsx } from "clsx"
import {
  Globe,
  Linkedin,
  BookOpen,
  HelpCircle,
  Rss,
  MousePointerClick,
} from "lucide-react"

const PLATFORMS = [
  {
    icon: Rss,
    name: "Your blog / site",
    steps: [
      "Copy the HTML version and paste into WordPress, Ghost, or your site editor.",
      "Set the meta description from the article excerpt for SEO.",
      "Add internal links to your sales page where relevant.",
      "Publish on a schedule — one article per week builds long-term traffic.",
    ],
  },
  {
    icon: BookOpen,
    name: "Medium",
    steps: [
      "Copy the plain-text version and paste into a new Medium story.",
      "Add 3–5 relevant tags for your niche at the bottom.",
      "Keep your affiliate link in the closing CTA — Medium allows external links in articles.",
      "Submit to a niche publication for extra reach, or publish on your profile.",
    ],
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    steps: [
      "Use plain text for a LinkedIn article, or paste HTML into your blog CMS and link from a short LinkedIn post.",
      "Lead with a personal hook in the first two lines — they show before “see more.”",
      "End with a clear CTA and your affiliate link.",
      "Post a shorter teaser on your feed linking to the full article.",
    ],
  },
  {
    icon: HelpCircle,
    name: "Quora",
    steps: [
      "Search for questions in your niche with lots of followers but thin answers.",
      "Adapt a section of the article into a direct answer — lead with the takeaway, not a link.",
      "Add your article or offer link at the end as “further reading” — Quora allows relevant links, but link-only answers get collapsed.",
      "Answer 2–3 related questions using different sections of the same article.",
    ],
  },
  {
    icon: Globe,
    name: "Cross-posting workflow",
    steps: [
      "Publish the full article on one platform first (your blog or Medium).",
      "Adapt the intro for LinkedIn and Quora — don’t paste identical copy everywhere.",
      "Track which platform drives clicks and double down on what works.",
      "Keep your offer links organized in Link Vault so you can reuse the same CTA across platforms.",
    ],
  },
] as const

type PlatformName = (typeof PLATFORMS)[number]["name"]

export function CrossPlatformGuide() {
  const [selected, setSelected] = useState<PlatformName | null>(null)

  const platform = PLATFORMS.find((p) => p.name === selected)

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-card">
      <div className="flex flex-col lg:flex-row">
        <div className="flex items-center gap-4 bg-ink px-5 py-5 text-white sm:px-6 lg:w-[220px] lg:flex-col lg:items-start lg:justify-center lg:py-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <Globe size={22} aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">Where to use it</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-white">Publishing guide</p>
          </div>
        </div>

        <div className="flex-1 p-5 sm:p-7">
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            These long-form articles work best on platforms that reward depth. Choose a destination to
            see the posting steps — your offer link is already woven in.
          </p>

          <div className="mt-5 flex flex-wrap gap-2" role="tablist">
            {PLATFORMS.map((p) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={selected === p.name}
                onClick={() => setSelected((prev) => (prev === p.name ? null : p.name))}
                className={clsx(
                  "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
                  selected === p.name
                    ? "bg-primary text-white shadow-[var(--ds-shadow-sapphire)]"
                    : "border border-[var(--ds-line-strong)] bg-card text-ink hover:border-primary hover:bg-primary-light hover:text-sapphire-700",
                )}
              >
                <p.icon size={15} aria-hidden />
                {p.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {platform ? (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-5 rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5"
              >
                <ol className="space-y-3">
                  {platform.steps.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 rounded-xl border border-[var(--ds-line)] bg-card p-3.5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-relaxed text-ink">{step}</p>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-[var(--ds-line)] bg-surface-nested/70 px-4 py-5 text-sm text-ink"
              >
                <MousePointerClick size={15} className="shrink-0 text-sapphire-700" aria-hidden />
                Select a platform above to see how to post there.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
