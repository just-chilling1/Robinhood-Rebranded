"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { completeOnboarding } from "@/app/actions/onboarding"
import { onboardingConfig } from "@/lib/onboarding/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OnboardingLogo } from "./onboarding-logo"

export function OnboardingFlow() {
  const router = useRouter()
  const cfg = onboardingConfig
  const [firstName, setFirstName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [activationStep, setActivationStep] = useState(0)

  useEffect(() => {
    const timers = cfg.activation.infoSteps.map((_, i) =>
      window.setTimeout(() => setActivationStep(i + 1), 600 * (i + 1)),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [cfg.activation.infoSteps])

  const handleActivate = async () => {
    if (!firstName.trim()) return
    setSubmitting(true)
    const result = await completeOnboarding(firstName.trim())
    setSubmitting(false)
    if (result.success) {
      router.push(cfg.dashboardRoute)
      router.refresh()
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white p-8 lg:flex">
        <OnboardingLogo size="md" />
        <p className="mt-4 text-xl font-extrabold text-slate-900">{cfg.productName}</p>
        <p className="text-sm text-slate-500">{cfg.productTagline}</p>
        <ul className="mt-10 space-y-3">
          {cfg.activation.sidebarStatus.map((item, i) => (
            <li
              key={item.label}
              className={`rounded-xl border p-4 transition-all duration-500 ${
                activationStep > i
                  ? "border-emerald-200 bg-emerald-50 translate-x-0 opacity-100"
                  : "border-slate-100 bg-slate-50 opacity-60"
              }`}
            >
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="text-sm font-bold text-emerald-600">{item.status}</p>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12 sm:px-10">
          <div className="mb-8 flex justify-center lg:hidden">
            <OnboardingLogo size="md" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{cfg.activation.headline}</h1>
          <p className="mt-3 text-lg text-slate-600">{cfg.activation.subheadline}</p>

          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={cfg.activation.inputPlaceholder}
            className="mt-8 h-16 rounded-2xl border-2 border-slate-200 bg-white text-xl text-slate-900 shadow-sm focus:border-sky-400 focus:ring-sky-200"
            autoComplete="given-name"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && firstName.trim() && !submitting && handleActivate()}
          />

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-slate-900">{cfg.activation.infoTitle}</p>
            <ol className="space-y-3">
              {cfg.activation.infoSteps.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-start gap-3 text-sm transition-all duration-500 ${
                    activationStep > i ? "text-slate-700 opacity-100" : "text-slate-300 opacity-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      activationStep > i ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {activationStep > i ? "✓" : i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-5 text-sm font-medium text-amber-700">{cfg.activation.note}</p>

          <Button
            type="button"
            onClick={handleActivate}
            disabled={!firstName.trim() || submitting}
            className="mt-8 h-16 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-xl font-extrabold text-white shadow-lg shadow-sky-200 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 transition-all hover:-translate-y-0.5"
          >
            {submitting ? "Activating…" : cfg.activation.ctaLabel}
          </Button>
        </div>
      </main>
    </div>
  )
}
