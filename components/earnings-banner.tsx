"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export type BannerSize = "compact" | "full"

export function EarningsBanner({ size = "full" }: { size?: BannerSize }) {
  const [dismissed, setDismissed] = useState(false)
  const compact = size === "compact"

  if (dismissed) return null

  return (
    <div
      className={`relative w-full border-2 border-[#fbbf24]/50 bg-gradient-to-b from-[#101726] to-[#0b0f18] mb-4 text-center ${
        compact
          ? "rounded-xl px-4 py-4 md:px-5 md:py-5"
          : "rounded-2xl px-6 py-10 md:px-12 md:py-12"
      }`}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close banner"
        className="absolute right-2 top-2 rounded-lg p-1 text-[#7dd3fc]/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </button>

      <span
        className={`inline-block rounded-md bg-[#ef4444] font-black uppercase tracking-widest text-white ${
          compact
            ? "mb-2 px-2.5 py-0.5 text-[10px] md:text-xs"
            : "mb-5 px-4 py-1.5 text-sm md:text-base"
        }`}
      >
        Free Training
      </span>

      <h2
        className={`mx-auto font-black uppercase leading-tight text-white ${
          compact
            ? "mb-2 max-w-2xl text-sm md:text-base"
            : "mb-4 max-w-4xl text-3xl md:text-5xl"
        }`}
      >
        Wake Up With An Extra{" "}
        <span className="text-[#fbbf24]">$1,000&ndash;$5,000</span>{" "}
        In Your Bank Account Tomorrow
      </h2>

      {!compact && (
        <p className="mx-auto mb-8 max-w-3xl text-lg md:text-2xl font-bold leading-snug text-[#d8e9fb]">
          Discover how to scale to $1,000&ndash;$5,000 every single day &mdash; without doing any extra work.
        </p>
      )}

      <Link
        href="https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] font-black uppercase text-[#1a1305] shadow-xl shadow-[#fbbf24]/40 transition-all duration-200 hover:scale-[1.04] hover:shadow-[#fbbf24]/60 ${
          compact
            ? "px-4 py-2 text-xs md:text-sm"
            : "px-10 py-5 text-xl md:text-2xl"
        }`}
      >
        Watch The Free Training &gt;&gt;
      </Link>

      {!compact && (
        <p className="mt-4 text-sm md:text-base font-black uppercase tracking-wide text-[#ef4444]">
          Warning: This will be taken down soon
        </p>
      )}
    </div>
  )
}
