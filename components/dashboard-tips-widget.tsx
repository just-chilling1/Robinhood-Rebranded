"use client"

import { useEffect, useState } from "react"
import { Lightbulb } from "lucide-react"

const TIPS = [
  {
    title: "What to do next",
    body: "Post comments on videos with 10k+ views for better reach.",
  },
  {
    title: "Tip",
    body: "Save your best comment packs in My Vault so you can reuse them.",
  },
  {
    title: "Tip",
    body: "Watch the Getting Started video before your first Gold Rush run.",
  },
  {
    title: "Tip",
    body: "Add your affiliate links in Your Links before promoting.",
  },
  {
    title: "Tip",
    body: "Individual results vary — consistency beats one-off spikes.",
  },
]

export function DashboardTipsWidget() {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 12000)
    return () => window.clearInterval(timer)
  }, [])

  const tip = TIPS[tipIndex]

  return (
    <section className="dashboard-container min-w-0">
      <div className="flex items-center gap-3 border-b border-border-dim/60 pb-4">
        <div className="dashboard-section-icon">
          <Lightbulb size={18} />
        </div>
        <div className="min-w-0">
          <p className="ds-h4">{tip.title}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-muted">{tip.body}</p>
      <p className="mt-3 text-xs italic text-text-muted">Individual results vary.</p>
    </section>
  )
}
