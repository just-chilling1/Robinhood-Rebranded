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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#0ea5e9]" />
        <p className="text-base font-semibold text-white">{label}</p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-[#0ea5e9]/30 bg-[#231d35]">
        <div
          className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#10b981] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {offer === "welcome" ? <WelcomeOfferBanner /> : <EarningsBanner />}
    </div>
  )
}
