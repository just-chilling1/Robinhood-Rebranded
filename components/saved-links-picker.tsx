"use client"

import Link from "next/link"
import { Bookmark, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export type SavedLinkOption = {
  id: string
  offer_name: string
  affiliate_url: string
}

type SavedLinksPickerProps = {
  links: SavedLinkOption[]
  selectedId: string | null
  onSelect: (link: SavedLinkOption) => void
}

function shortUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export function SavedLinksPicker({ links, selectedId, onSelect }: SavedLinksPickerProps) {
  if (links.length === 0) return null

  return (
    <div className="rounded-xl border-2 border-[color-mix(in_srgb,var(--ds-sapphire-500)_28%,var(--ds-line))] bg-white p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-tight text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
            <Bookmark className="h-3.5 w-3.5" aria-hidden />
          </span>
          Use a saved link
        </p>
        <Link
          href="/share"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--ds-line-strong)] bg-white px-3 font-sans text-xs font-semibold text-sapphire-700 transition-colors hover:border-sapphire-700 hover:bg-sapphire-100"
        >
          Manage in Link Vault
          <ExternalLink className="h-3 w-3" aria-hidden />
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => {
          const selected = selectedId === link.id
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelect(link)}
              className={cn(
                "rounded-xl border-2 px-3.5 py-2.5 text-left font-sans transition-colors",
                selected
                  ? "border-sapphire-700 bg-grad-sapphire text-white shadow-sapphire"
                  : "border-[var(--ds-line-strong)] bg-[var(--ds-surface-sub)] text-ink hover:border-sapphire-700 hover:bg-sapphire-100",
              )}
            >
              <span className="block truncate text-sm font-semibold">{link.offer_name}</span>
              <span
                className={cn(
                  "mt-0.5 block truncate text-[12px] font-medium",
                  selected ? "text-white/80" : "text-text-secondary",
                )}
              >
                {shortUrl(link.affiliate_url)}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 font-sans text-xs font-medium text-text-secondary">Or paste a new link below</p>
    </div>
  )
}
