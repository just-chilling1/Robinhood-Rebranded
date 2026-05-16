"use client"

import type { ReactNode } from "react"
import { onboardingConfig, ONBOARDING_STEPS, type OnboardingStepId } from "@/lib/onboarding/config"
import { OnboardingLogo } from "./onboarding-logo"

interface OnboardingShellProps {
  children: ReactNode
  step: OnboardingStepId
  showHeader?: boolean
}

const stepLabels: Record<OnboardingStepId, string> = {
  preparing: "Setup",
  congratulations: "Selected",
  "beta-offer": "Beta Offer",
  qualification: "Qualify",
  "loading-66": "Loading",
  activation: "Activate",
}

export function OnboardingShell({ children, step, showHeader = true }: OnboardingShellProps) {
  const stepIndex = ONBOARDING_STEPS.indexOf(step)
  const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {showHeader && (
        <header className="shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
            <div className="flex items-center gap-3">
              <OnboardingLogo size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-extrabold text-slate-900">
                  {onboardingConfig.productName}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {onboardingConfig.productTagline}
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
            </p>
          </div>
          <div className="h-1.5 w-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-6 py-3 sm:px-10">
            {ONBOARDING_STEPS.map((id, index) => {
              const active = index === stepIndex
              const done = index < stepIndex
              return (
                <div
                  key={id}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                    active
                      ? "bg-sky-100 text-sky-700 ring-2 ring-sky-400/50 scale-105"
                      : done
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors ${
                      active
                        ? "bg-sky-500 text-white"
                        : done
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-300 text-white"
                    }`}
                  >
                    {done ? "✓" : index + 1}
                  </span>
                  <span className="hidden md:inline">{stepLabels[id]}</span>
                </div>
              )
            })}
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
