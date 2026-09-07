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
  const [error, setError] = useState<string | null>(null)
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
    setError(null)
    const result = await completeOnboarding(firstName.trim())
    setSubmitting(false)
    if (result.success) {
      router.push(cfg.dashboardRoute)
      router.refresh()
      return
    }
    setError(result.error || "Could not activate your account. Please try again.")
  }

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen bg-background">
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-[var(--border)] bg-card p-8 lg:flex">
        <OnboardingLogo size="md" />
        <p className="mt-4 text-xl font-extrabold text-[#102A43]">{cfg.productName}</p>
        <p className="text-sm text-[#486581]">{cfg.productTagline}</p>
        <ul className="mt-10 space-y-3">
          {cfg.activation.sidebarStatus.map((item, i) => (
            <li
              key={item.label}
              className={`rounded-xl border p-4 transition-all duration-500 ${
                activationStep > i
                  ? "border-[#DDF7EC] bg-[#DDF7EC] translate-x-0 opacity-100"
                  : "border-border bg-surface-nested opacity-60"
              }`}
            >
              <p className="text-xs font-medium text-[#486581]">{item.label}</p>
              <p className="text-sm font-bold text-[#16875C]">{item.status}</p>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12 sm:px-10">
          <div className="mb-8 flex justify-center lg:hidden">
            <OnboardingLogo size="md" />
          </div>
          <h1 className="text-3xl font-black text-[#102A43] sm:text-4xl">{cfg.activation.headline}</h1>
          <p className="mt-3 text-lg text-[#486581]">{cfg.activation.subheadline}</p>

          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={cfg.activation.inputPlaceholder}
            className="mt-8 h-16 rounded-2xl border-2 border-[var(--border-strong)] bg-card text-xl text-foreground shadow-card focus:border-primary focus:ring-primary"
            autoComplete="given-name"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && firstName.trim() && !submitting && handleActivate()}
          />

          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-card p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-[#102A43]">{cfg.activation.infoTitle}</p>
            <ol className="space-y-3">
              {cfg.activation.infoSteps.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-start gap-3 text-sm transition-all duration-500 ${
                    activationStep > i ? "text-[#102A43] opacity-100" : "text-[#486581] opacity-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      activationStep > i ? "bg-[#16875C] text-white" : "bg-[#ECF6FB] text-[#829AB1]"
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

          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            onClick={handleActivate}
            disabled={!firstName.trim() || submitting}
            className="mt-8 h-16 w-full rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-xl font-extrabold text-white shadow-lg shadow-[#2563EB]/30 hover:from-[#1D4ED8] hover:to-[#1D4ED8] disabled:opacity-50 transition-all hover:-translate-y-0.5"
          >
            {submitting ? "Activating…" : cfg.activation.ctaLabel}
          </Button>
        </div>
      </main>
    </div>
  )
}
