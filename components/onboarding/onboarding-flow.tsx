"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Confetti from "react-confetti"
import { Check, Loader2, Sparkles } from "lucide-react"
import { completeOnboarding } from "@/app/actions/onboarding"
import { ONBOARDING_FINAL_CTA_URL, onboardingConfig, type OnboardingStepId } from "@/lib/onboarding/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OnboardingContinueButton } from "./onboarding-continue-button"
import { OnboardingLogo } from "./onboarding-logo"
import { OnboardingShell } from "./onboarding-shell"

const ROW_DELAY_MS = 900

function StepContent({
  children,
  stepKey,
}: {
  children: React.ReactNode
  stepKey: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = window.setTimeout(() => setVisible(true), 50)
    return () => window.clearTimeout(t)
  }, [stepKey])

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
    </div>
  )
}

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStepId>("preparing")
  const [completedRows, setCompletedRows] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [checkedReqs, setCheckedReqs] = useState([false, false, false])
  const [loadProgress, setLoadProgress] = useState(0)
  const [activationStep, setActivationStep] = useState(0)

  const cfg = onboardingConfig
  const rowCount = cfg.preparing.rows.length
  const allRowsDone = completedRows >= rowCount
  const allReqsChecked = checkedReqs.every(Boolean)

  useEffect(() => {
    if (step !== "preparing") return
    setCompletedRows(0)
    let current = 0
    const interval = window.setInterval(() => {
      current += 1
      setCompletedRows(current)
      if (current >= rowCount) window.clearInterval(interval)
    }, ROW_DELAY_MS)
    return () => window.clearInterval(interval)
  }, [step, rowCount])

  useEffect(() => {
    if (step === "congratulations") {
      setShowConfetti(true)
      const t = window.setTimeout(() => setShowConfetti(false), 5000)
      return () => window.clearTimeout(t)
    }
    setShowConfetti(false)
  }, [step])

  useEffect(() => {
    if (step !== "loading-66") return
    setLoadProgress(0)
    const interval = window.setInterval(() => {
      setLoadProgress((p) => {
        if (p >= 66) {
          window.clearInterval(interval)
          return 66
        }
        return p + 2
      })
    }, 40)
    const advance = window.setTimeout(() => setStep("activation"), 2400)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(advance)
    }
  }, [step])

  useEffect(() => {
    if (step !== "activation") return
    setActivationStep(0)
    const timers = cfg.activation.infoSteps.map((_, i) =>
      window.setTimeout(() => setActivationStep(i + 1), 600 * (i + 1)),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [step, cfg.activation.infoSteps])

  useEffect(() => {
    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const goTo = useCallback((next: OnboardingStepId) => setStep(next), [])

  const toggleReq = (index: number) => {
    setCheckedReqs((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleClaimBeta = async () => {
    await completeOnboarding()
    if (ONBOARDING_FINAL_CTA_URL) {
      window.open(ONBOARDING_FINAL_CTA_URL, "_blank", "noopener,noreferrer")
      goTo("loading-66")
      return
    }
    router.push(cfg.dashboardRoute)
    router.refresh()
  }

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

  const handleSkipToDashboard = async () => {
    setSubmitting(true)
    const result = await completeOnboarding()
    setSubmitting(false)
    if (result.success) {
      router.push(cfg.dashboardRoute)
      router.refresh()
    }
  }

  if (step === "preparing") {
    return (
      <OnboardingShell step="preparing">
        <StepContent stepKey="preparing">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <OnboardingLogo size="lg" />
              <h1 className="mt-8 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
                {cfg.preparing.title}
              </h1>
              <p className="mt-3 text-lg text-slate-600">{cfg.preparing.subtitle}</p>
            </div>
            <div>
              <ul className="space-y-3">
                {cfg.preparing.rows.map((row, index) => {
                  const done = index < completedRows
                  const loading = index === completedRows && !allRowsDone
                  return (
                    <li
                      key={row.label}
                      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-500 ${
                        done
                          ? "border-emerald-200 bg-emerald-50 shadow-sm"
                          : loading
                            ? "border-sky-200 bg-sky-50 shadow-md scale-[1.02]"
                            : "border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                          done ? "bg-emerald-500" : loading ? "bg-sky-500" : "bg-slate-200"
                        }`}
                      >
                        {done ? (
                          <Check className="h-5 w-5 text-white" strokeWidth={3} />
                        ) : loading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                        )}
                      </div>
                      <span
                        className={`font-semibold ${done ? "text-emerald-800" : loading ? "text-sky-800" : "text-slate-400"}`}
                      >
                        {row.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                <Sparkles className="mb-2 inline h-4 w-4 text-amber-500" /> {cfg.preparing.tip}
              </p>
              <OnboardingContinueButton
                label={cfg.preparing.continueLabel}
                onClick={() => goTo("congratulations")}
                disabled={!allRowsDone}
              />
            </div>
          </div>
        </StepContent>
      </OnboardingShell>
    )
  }

  if (step === "congratulations") {
    return (
      <>
        {showConfetti && windowSize.width > 0 && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            colors={["#0ea5e9", "#06b6d4", "#22c55e", "#fbbf24", "#ec4899"]}
          />
        )}
        <OnboardingShell step="congratulations">
          <StepContent stepKey="congratulations">
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <p className="animate-pulse text-sm font-extrabold uppercase tracking-[0.2em] text-amber-600">
                {cfg.congratulations.badge}
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl">
                {cfg.congratulations.headline}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-600">
                Your Robinhood account has been flagged for an exclusive opportunity. Tap continue to
                see what&apos;s waiting for you.
              </p>
              <OnboardingContinueButton
                label={cfg.congratulations.continueLabel}
                onClick={() => goTo("beta-offer")}
                variant="success"
                className="mx-auto"
              />
            </div>
          </StepContent>
        </OnboardingShell>
      </>
    )
  }

  if (step === "beta-offer") {
    return (
      <OnboardingShell step="beta-offer">
        <StepContent stepKey="beta-offer">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                {cfg.betaOffer.headline}
              </h1>
              <p className="mt-5 text-lg text-slate-600">{cfg.betaOffer.subcopy(cfg.productName)}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-base font-semibold leading-relaxed text-slate-800">
                  {cfg.betaOffer.infoCard}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center shadow-lg transition-transform hover:scale-[1.02]">
                <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                  {cfg.betaOffer.payLabel}
                </p>
                <p className="mt-2 text-5xl font-black text-emerald-600">{cfg.betaOffer.payAmount}</p>
              </div>
              <Button
                type="button"
                onClick={() => goTo("qualification")}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-lg font-extrabold text-white shadow-lg hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-0.5 transition-all"
              >
                {cfg.betaOffer.ctaLabel}
              </Button>
            </div>
          </div>
        </StepContent>
      </OnboardingShell>
    )
  }

  if (step === "qualification") {
    return (
      <OnboardingShell step="qualification">
        <StepContent stepKey="qualification">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-600">
              {cfg.qualification.badge}
            </p>
            <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              {cfg.qualification.headline}
            </h1>
            <p className="mt-2 text-slate-500">Tap each requirement to confirm</p>

            <ul className="mt-10 space-y-4 text-left">
              {cfg.qualification.requirements.map((req, index) => {
                const checked = checkedReqs[index]
                return (
                  <li key={req}>
                    <button
                      type="button"
                      onClick={() => toggleReq(index)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                        checked
                          ? "border-emerald-400 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                          checked
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {checked && <Check className="h-5 w-5 text-white" strokeWidth={3} />}
                      </div>
                      <span
                        className={`text-lg font-semibold ${checked ? "text-emerald-800" : "text-slate-700"}`}
                      >
                        {req}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <p
              className={`mt-8 text-lg font-bold transition-colors ${allReqsChecked ? "text-emerald-600" : "text-slate-400"}`}
            >
              {allReqsChecked ? cfg.qualification.footer : "Check all three to qualify"}
            </p>

            <Button
              type="button"
              onClick={handleClaimBeta}
              disabled={!allReqsChecked}
              className="mt-6 h-14 w-full max-w-md rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-lg font-extrabold text-white shadow-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              {cfg.qualification.claimCta}
            </Button>

            <OnboardingContinueButton
              label={cfg.qualification.continueLabel}
              onClick={() => goTo("loading-66")}
              variant="secondary"
              className="mx-auto"
            />

            <p className="mt-6 text-xs text-slate-400">{cfg.qualification.finePrint(cfg.productName)}</p>
          </div>
        </StepContent>
      </OnboardingShell>
    )
  }

  if (step === "loading-66") {
    const circumference = 2 * Math.PI * 52
    return (
      <OnboardingShell step="loading-66" showHeader={false}>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <OnboardingLogo size="lg" />
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-500">
            {cfg.productName}
          </p>
          <div className="relative mt-12 flex h-40 w-40 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - loadProgress / 100)}
                className="transition-all duration-100"
              />
            </svg>
            <span className="absolute text-3xl font-black text-slate-900">{loadProgress}%</span>
          </div>
          <p className="mt-8 animate-pulse text-base text-slate-500">{cfg.loading66.footerTagline}</p>
        </div>
      </OnboardingShell>
    )
  }

  // activation — full screen light, no box
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
            onKeyDown={(e) => e.key === "Enter" && firstName.trim() && handleActivate()}
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

          <Button
            type="button"
            onClick={handleSkipToDashboard}
            disabled={submitting}
            variant="ghost"
            className="mt-4 h-12 w-full text-base font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            {cfg.activation.skipCtaLabel}
          </Button>
        </div>
      </main>
    </div>
  )
}
