"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { EarningsBanner } from "@/components/earnings-banner"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"

export type OfferBannerVariant = "earnings" | "welcome"

/**
 * Shown while the app is generating something (videos, comments, posts...).
 * Animated loading bar + contextual offer banner below it.
 * - earnings → Free Training (main tools: create / vault / share)
 * - welcome → former WelcomePopup Q-LAPS offer (premium feature CTAs)
 */
export function GenerationProgress({
  label = "AI is working on it...",
  offer = "earnings",
}: {
  label?: string
  offer?: OfferBannerVariant
}) {
  const [progress, setProgress] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + Math.max(1, Math.round((95 - prev) / 10))))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="generation-progress-card space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ds-r-md)] border border-[var(--ds-line-sapphire)] bg-sapphire-200">
            <Loader2 className="h-5 w-5 animate-spin text-sapphire-500" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-ink md:text-lg">{label}</p>
            <p className="mt-1 text-sm text-text-secondary">This usually takes a few seconds.</p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-black tabular-nums text-sapphire-700">{progress}%</span>
      </div>

      <div className="generation-progress-bar">
        <div className="generation-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-3 border-t border-[var(--ds-line)] pt-4">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-sapphire-700">
          While you wait
        </p>
        {offer === "welcome" ? (
          <WelcomeOfferBanner size="prominent" />
        ) : (
          <EarningsBanner size="prominent" />
        )}
      </div>
    </div>
  )
}
