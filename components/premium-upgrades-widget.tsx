"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import { PREMIUM_FEATURES } from "@/lib/premium-features"

export function PremiumUpgradesWidget() {
  const pathname = usePathname()

  return (
    <div className="premium-nav-section p-2">
      <div className="px-3 pb-3 pt-2.5">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0ea5e9]">
          <Sparkles className="premium-sparkle h-4 w-4" fill="currentColor" />
          Premium Upgrades
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[#a5c9e8]">
          Unlock the tools that drive the biggest results.
        </p>
      </div>

      <div className="space-y-2">
        {PREMIUM_FEATURES.map((feature, index) => {
          const isActive = pathname === feature.href
          const Icon = feature.icon

          return (
            <div
              key={feature.href}
              className="premium-stagger-item"
              style={{ animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <Link
                href={feature.href}
                className={`premium-upgrade-card group ${isActive ? "is-active" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-300 ${
                    isActive
                      ? "from-[#0ea5e9] to-[#06b6d4] text-white shadow-[0_0_16px_rgba(14,165,233,0.45)]"
                      : "from-[#0ea5e9]/25 to-[#06b6d4]/20 text-[#0ea5e9] group-hover:from-[#0ea5e9] group-hover:to-[#06b6d4] group-hover:text-white group-hover:shadow-[0_0_16px_rgba(14,165,233,0.45)]"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-bold tracking-wide ${
                      isActive ? "text-white" : "text-slate-100 group-hover:text-white"
                    }`}
                  >
                    {feature.label}
                  </span>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#7dd3fc]/80">
                    {feature.description}
                  </p>
                </div>

                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#0ea5e9]/30 text-white"
                      : "bg-white/5 text-slate-500 group-hover:translate-x-0.5 group-hover:bg-[#0ea5e9]/30 group-hover:text-white"
                  }`}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
