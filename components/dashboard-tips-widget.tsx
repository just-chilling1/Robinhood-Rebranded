"use client"

import { useEffect, useState } from "react"

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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-[#d8e9fb]">{tip.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#a5c9e8]">{tip.body}</p>
      <p className="mt-3 text-xs text-[#7dd3fc]/70">Individual results vary.</p>
    </div>
  )
}
