"use client"

import type { ReactNode } from "react"
import { onboardingConfig } from "@/lib/onboarding/config"
import { OnboardingLogo } from "./onboarding-logo"

interface OnboardingShellProps {
  children: ReactNode
  showLogo?: boolean
  maxWidth?: "md" | "lg" | "xl"
}

const maxWidthClass = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
}

export function OnboardingShell({
  children,
  showLogo = true,
  maxWidth = "lg",
}: OnboardingShellProps) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-y-auto bg-[#020617] px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(14,165,233,0.15) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.12) 0%, transparent 45%)",
        }}
        aria-hidden
      />

      <div className={`relative z-10 w-full ${maxWidthClass[maxWidth]}`}>
        {showLogo && (
          <div className="mb-8 flex flex-col items-center gap-3">
            <OnboardingLogo size="lg" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#7dd3fc]">
              {onboardingConfig.productName}
            </p>
            <p className="text-sm text-[#7dd3fc]/70">{onboardingConfig.productTagline}</p>
          </div>
        )}
        <div className="glass-strong rounded-3xl border-2 border-[#0ea5e9]/30 p-6 sm:p-8 glow-cyan">
          {children}
        </div>
      </div>
    </div>
  )
}
