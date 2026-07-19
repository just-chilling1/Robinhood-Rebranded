"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { EarningsBanner } from "@/components/earnings-banner"

/**
 * Shown while the app is generating something (videos, comments, posts...).
 * Renders an animated loading bar with the earnings banner directly below it,
 * so the offer is only visible during generation.
 */
export function GenerationProgress({ label = "AI is working on it..." }: { label?: string }) {
  const [progress, setProgress] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      // Ease toward 95% and wait there until the real work finishes
      setProgress((prev) => (prev >= 95 ? 95 : prev + Math.max(1, Math.round((95 - prev) / 10))))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#0ea5e9]" />
        <p className="text-base font-semibold text-white">{label}</p>
      </div>
      <div className="w-full h-3 rounded-full bg-[#231d35] overflow-hidden border border-[#0ea5e9]/30">
        <div
          className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#10b981] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <EarningsBanner />
    </div>
  )
}
