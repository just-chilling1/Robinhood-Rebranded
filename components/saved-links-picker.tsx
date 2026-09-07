"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { AffiliateLink } from "@/app/actions/affiliate-links"

export function SavedLinksPicker({
  links,
  selectedId,
  onSelect,
}: {
  links: AffiliateLink[]
  selectedId: string | null
  onSelect: (link: AffiliateLink) => void
}) {
  if (links.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[#102A43]">Use a saved link</p>
        <Link
          href="/share"
          className="text-sm font-semibold text-[#2563EB] underline-offset-4 hover:underline"
        >
          Manage in Link Vault
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => {
          const selected = selectedId === link.id
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelect(link)}
              className={cn(
                "max-w-full rounded-full border px-3 py-1.5 text-left text-sm font-semibold transition-colors",
                selected
                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                  : "border-[var(--border)] bg-[var(--ds-surface-sub)] text-[#102A43] hover:border-[#2563EB]",
              )}
            >
              <span className="block truncate">{link.offer_name}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs font-semibold text-[#486581]">Or paste a new link below</p>
    </div>
  )
}
