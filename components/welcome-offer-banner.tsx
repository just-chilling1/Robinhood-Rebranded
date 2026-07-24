"use client"

import { useState } from "react"
import { X } from "lucide-react"

/** Q-LAPS offer — same link as the old WelcomePopup (do not change). */
const CTA_URL = "https://jvz4.com/c/3547097/442443/"

/**
 * Same shell as EarningsBanner, but with the former WelcomePopup copy.
 * Used on premium feature generation CTAs (Accelerator, Recurring Streams, Social Payouts).
 */
import type { BannerSize } from "@/components/earnings-banner"

export function WelcomeOfferBanner({ size = "full" }: { size?: BannerSize }) {
  const [dismissed, setDismissed] = useState(false)
  const compact = size === "compact"

  if (dismissed) return null

  return (
    <div
      className={`relative mb-4 w-full border-2 border-[#fbbf24]/50 bg-gradient-to-b from-[#101726] to-[#0b0f18] text-center ${
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
        You&apos;ve Been Selected
      </span>

      <h2
        className={`mx-auto font-black uppercase leading-tight text-white ${
          compact
            ? "mb-2 max-w-2xl text-sm md:text-base"
            : "mb-4 max-w-4xl text-3xl md:text-5xl"
        }`}
      >
        Limited Free Training — Learn How To Make{" "}
        <span className="text-[#fbbf24]">$1,000&ndash;$5,000</span> Per Day
      </h2>

      {!compact && (
        <>
          <p className="mx-auto mb-6 max-w-3xl text-lg font-bold leading-snug text-[#d8e9fb] md:text-2xl">
            With no extra work. Fully automated commission system revealed — works in just 20 minutes per day.
          </p>

          <ul className="mx-auto mb-8 max-w-xl space-y-2 text-left text-base font-semibold text-[#d8e9fb] md:text-lg">
            <li className="flex gap-2">
              <span className="text-[#fbbf24]">★</span>
              Fully automated commission system revealed
            </li>
            <li className="flex gap-2">
              <span className="text-[#fbbf24]">★</span>
              No tech skills or experience needed
            </li>
            <li className="flex gap-2">
              <span className="text-[#fbbf24]">★</span>
              Works in just 20 minutes per day
            </li>
          </ul>
        </>
      )}

      <a
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] font-black uppercase text-[#1a1305] shadow-xl shadow-[#fbbf24]/40 transition-all duration-200 hover:scale-[1.04] hover:shadow-[#fbbf24]/60 ${
          compact
            ? "px-4 py-2 text-xs md:text-sm"
            : "px-10 py-5 text-xl md:text-2xl"
        }`}
      >
        Claim My Free Spot &gt;&gt;
      </a>

      {!compact && (
        <>
          <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#ef4444] md:text-base">
            Warning: Only a few free spots remaining
          </p>
          <p className="mt-2 text-xs text-[#7dd3fc]/70">100% Free — No credit card required</p>
        </>
      )}
    </div>
  )
}
