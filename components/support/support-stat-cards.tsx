"use client"

import { Clock, Shield, Star } from "lucide-react"
import { clsx } from "clsx"
import { support } from "@/lib/support"

const STAT_ICONS = {
  clock: Clock,
  star: Star,
  shield: Shield,
} as const

export function SupportStatCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {support.stats.map((stat) => {
        const Icon = STAT_ICONS[stat.icon as keyof typeof STAT_ICONS] ?? Star

        return (
          <li
            key={stat.label}
            className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 text-sm shadow-card"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100">
              <Icon size={20} className="text-sapphire-700" />
            </div>
            <span className="min-w-0 leading-snug">
              <span className="mb-0.5 block text-[12px] font-semibold uppercase tracking-wide text-text-muted">
                {stat.label}
              </span>
              <span className={clsx("text-base font-semibold", stat.highlightClass ?? "text-text-primary")}>
                {stat.highlight}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
