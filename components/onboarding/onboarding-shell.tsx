"use client"

import type { ReactNode } from "react"
import { ONBOARDING_STEPS, type OnboardingStepId } from "@/lib/onboarding/config"
import { OnboardingLogo } from "./onboarding-logo"

interface OnboardingShellProps {
  children: ReactNode
  step: OnboardingStepId
  showHeader?: boolean
}

export function OnboardingShell({ children, step, showHeader = true }: OnboardingShellProps) {
  const stepIndex = ONBOARDING_STEPS.indexOf(step)
  const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {showHeader && (
        <header className="shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex h-[72px] items-center justify-center px-6 sm:px-10">
            <OnboardingLogo size="header" />
          </div>
          <div className="h-1.5 w-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>
      )}

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  )
}
