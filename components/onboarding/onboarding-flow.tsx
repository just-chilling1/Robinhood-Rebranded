"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Confetti from "react-confetti"
import { Check, Loader2 } from "lucide-react"
import { completeOnboarding } from "@/app/actions/onboarding"
import {
  ONBOARDING_FINAL_CTA_URL,
  ONBOARDING_UPGRADES_VIDEO_URL,
  onboardingConfig,
} from "@/lib/onboarding/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OnboardingContinueButton } from "./onboarding-continue-button"
import { OnboardingLogo } from "./onboarding-logo"
import { OnboardingShell } from "./onboarding-shell"

type Step =
  | "preparing"
  | "upgrades"
  | "congratulations"
  | "beta-offer"
  | "qualification"
  | "loading-66"
  | "activation"

const ROW_DELAY_MS = 900

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("preparing")
  const [completedRows, setCompletedRows] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const cfg = onboardingConfig
  const rowCount = cfg.preparing.rows.length
  const allRowsDone = completedRows >= rowCount

  useEffect(() => {
    if (step !== "preparing") return

    setCompletedRows(0)
    let current = 0

    const interval = window.setInterval(() => {
      current += 1
      setCompletedRows(current)
      if (current >= rowCount) {
        window.clearInterval(interval)
      }
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
    const t = window.setTimeout(() => setStep("activation"), 2200)
    return () => window.clearTimeout(t)
  }, [step])

  useEffect(() => {
    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const goTo = useCallback((next: Step) => setStep(next), [])

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

  if (step === "preparing") {
    return (
      <OnboardingShell maxWidth="md">
        <h1 className="text-center text-2xl font-extrabold text-white sm:text-3xl">
          {cfg.preparing.title}
        </h1>
        <p className="mt-2 text-center text-[#7dd3fc]">{cfg.preparing.subtitle}</p>

        <ul className="mt-8 space-y-3">
          {cfg.preparing.rows.map((row, index) => {
            const done = index < completedRows
            const loading = index === completedRows && !allRowsDone
            return (
              <li
                key={row.label}
                className="flex items-center gap-3 rounded-2xl border border-[#0ea5e9]/20 bg-[#0f172a]/80 px-4 py-3"
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    done ? "bg-[#06b6d4]/20" : "bg-[#1e293b]"
                  }`}
                >
                  {done ? (
                    <Check className="h-4 w-4 text-[#06b6d4]" strokeWidth={3} />
                  ) : loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0ea5e9]" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[#334155]" />
                  )}
                </div>
                <span className={`text-sm font-semibold ${done ? "text-white" : "text-[#7dd3fc]/70"}`}>
                  {row.label}
                </span>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 rounded-2xl border border-[#fbbf24]/30 bg-[#fbbf24]/10 p-4 text-sm leading-relaxed text-[#fde68a]">
          {cfg.preparing.tip}
        </p>

        <OnboardingContinueButton
          label={cfg.preparing.continueLabel}
          onClick={() => goTo("upgrades")}
          disabled={!allRowsDone}
        />
      </OnboardingShell>
    )
  }

  if (step === "upgrades") {
    const videoSrc = ONBOARDING_UPGRADES_VIDEO_URL

    return (
      <OnboardingShell maxWidth="xl">
        <h1 className="text-center text-2xl font-extrabold text-white sm:text-3xl">
          {cfg.upgrades.title}
        </h1>
        <p className="mt-4 text-[#7dd3fc] leading-relaxed">
          {cfg.upgrades.intro(cfg.productName)}
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/90">
          {cfg.upgrades.steps.map((s) => (
            <li key={s} className="text-sm sm:text-base">
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-[#0ea5e9]/30 bg-[#0f172a] aspect-video">
          {videoSrc ? (
            <video
              src={videoSrc}
              controls
              playsInline
              className="h-full w-full object-cover"
              title="How to find your upgrades"
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center">
              <p className="text-sm font-semibold text-[#7dd3fc]">{cfg.upgrades.videoPlaceholder}</p>
            </div>
          )}
        </div>

        <OnboardingContinueButton
          label={cfg.upgrades.continueLabel}
          onClick={() => goTo("congratulations")}
        />
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
            numberOfPieces={400}
            colors={["#0ea5e9", "#ec4899", "#06b6d4", "#fbbf24", "#22d38b"]}
          />
        )}
        <OnboardingShell maxWidth="md">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#fbbf24]/40 bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 text-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(251,191,36,0.25) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden
            />
            <p className="relative text-sm font-extrabold uppercase tracking-widest text-[#fbbf24]">
              {cfg.congratulations.badge}
            </p>
            <h1 className="relative mt-4 text-3xl font-black text-white sm:text-4xl">
              {cfg.congratulations.headline}
            </h1>
          </div>
          <OnboardingContinueButton
            label={cfg.congratulations.continueLabel}
            onClick={() => goTo("beta-offer")}
            className="bg-gradient-to-r from-[#fbbf24] to-[#f97316] hover:from-[#f97316] hover:to-[#fbbf24] shadow-[#fbbf24]/30"
          />
        </OnboardingShell>
      </>
    )
  }

  if (step === "beta-offer") {
    return (
      <OnboardingShell maxWidth="lg">
        <p className="text-lg font-bold leading-relaxed text-white">{cfg.betaOffer.headline}</p>
        <p className="mt-4 text-[#7dd3fc]">{cfg.betaOffer.subcopy(cfg.productName)}</p>

        <div className="mt-6 rounded-2xl border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 p-5">
          <p className="text-sm font-semibold leading-relaxed text-white">{cfg.betaOffer.infoCard}</p>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-[#22d38b]/40 bg-[#22d38b]/10 p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#7dd3fc]">
            {cfg.betaOffer.payLabel}
          </p>
          <p className="mt-2 text-4xl font-black text-[#22d38b]">{cfg.betaOffer.payAmount}</p>
        </div>

        <Button
          type="button"
          onClick={() => goTo("qualification")}
          className="mt-6 h-14 w-full rounded-2xl text-lg font-extrabold bg-gradient-to-r from-[#22d38b] to-[#06b6d4] hover:opacity-90 text-white"
        >
          {cfg.betaOffer.ctaLabel}
        </Button>

        <OnboardingContinueButton
          label={cfg.betaOffer.continueLabel}
          onClick={() => goTo("qualification")}
          className="mt-3 bg-transparent border-2 border-[#0ea5e9]/40 text-[#7dd3fc] hover:bg-[#0ea5e9]/10 shadow-none"
        />
      </OnboardingShell>
    )
  }

  if (step === "qualification") {
    return (
      <OnboardingShell maxWidth="lg">
        <p className="text-center text-sm font-extrabold uppercase tracking-widest text-[#22d38b]">
          {cfg.qualification.badge}
        </p>
        <h1 className="mt-3 text-center text-2xl font-black text-white sm:text-3xl">
          {cfg.qualification.headline}
        </h1>

        <ul className="mt-8 space-y-3">
          {cfg.qualification.requirements.map((req) => (
            <li
              key={req}
              className="flex items-center gap-3 rounded-2xl border border-[#0ea5e9]/25 bg-[#0f172a]/80 px-5 py-4"
            >
              <Check className="h-5 w-5 flex-shrink-0 text-[#06b6d4]" strokeWidth={3} />
              <span className="font-semibold text-white">{req}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center font-bold text-[#fbbf24]">{cfg.qualification.footer}</p>

        <Button
          type="button"
          onClick={handleClaimBeta}
          className="mt-6 h-14 w-full rounded-2xl text-lg font-extrabold bg-gradient-to-r from-[#22d38b] to-[#0ea5e9] hover:opacity-90 text-white shadow-lg"
        >
          {cfg.qualification.claimCta}
        </Button>

        <OnboardingContinueButton
          label={cfg.qualification.continueLabel}
          onClick={() => goTo("loading-66")}
          className="mt-3 border-2 border-[#0ea5e9]/30 bg-transparent text-[#7dd3fc] hover:bg-[#0ea5e9]/10 shadow-none"
        />

        <p className="mt-4 text-center text-xs text-[#7dd3fc]/60">
          {cfg.qualification.finePrint(cfg.productName)}
        </p>
      </OnboardingShell>
    )
  }

  if (step === "loading-66") {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020617] px-6">
        <OnboardingLogo size="lg" />
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#7dd3fc]">
          {cfg.productName}
        </p>
        <div className="relative mt-10 flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(14,165,233,0.15)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - 0.66)}`}
            />
          </svg>
          <span className="absolute text-2xl font-black text-white">
            {cfg.loading66.progressLabel}
          </span>
        </div>
        <p className="mt-8 text-sm text-[#7dd3fc]/70">{cfg.loading66.footerTagline}</p>
      </div>
    )
  }

  // activation
  return (
    <div className="fixed inset-0 z-[200] flex bg-[#020617]">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-[#0ea5e9]/20 bg-gradient-to-b from-[#020617] to-[#0f172a] p-6 lg:flex">
        <OnboardingLogo size="md" />
        <p className="mt-4 text-lg font-extrabold text-white">{cfg.productName}</p>
        <p className="text-xs text-[#7dd3fc]">{cfg.productTagline}</p>
        <ul className="mt-10 space-y-4">
          {cfg.activation.sidebarStatus.map((item) => (
            <li key={item.label} className="rounded-xl border border-[#0ea5e9]/20 bg-[#0f172a]/60 p-3">
              <p className="text-xs text-[#7dd3fc]">{item.label}</p>
              <p className="text-sm font-bold text-[#06b6d4]">{item.status}</p>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="glass-strong w-full max-w-lg rounded-3xl border-2 border-[#0ea5e9]/30 p-6 sm:p-8 glow-cyan">
          <div className="mb-6 flex justify-center lg:hidden">
            <OnboardingLogo size="md" />
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{cfg.activation.headline}</h1>
          <p className="mt-2 text-[#7dd3fc]">{cfg.activation.subheadline}</p>

          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={cfg.activation.inputPlaceholder}
            className="mt-6 h-14 rounded-2xl border-2 border-[#0ea5e9]/30 bg-[#0f172a]/80 text-lg text-white"
            autoComplete="given-name"
          />

          <div className="mt-6 rounded-2xl border border-[#0ea5e9]/25 bg-[#0ea5e9]/5 p-5">
            <p className="mb-3 text-sm font-bold text-white">{cfg.activation.infoTitle}</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-[#7dd3fc]">
              {cfg.activation.infoSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>

          <p className="mt-4 text-sm font-medium text-[#fbbf24]/90">{cfg.activation.note}</p>

          <Button
            type="button"
            onClick={handleActivate}
            disabled={!firstName.trim() || submitting}
            className="mt-8 h-14 w-full rounded-2xl text-lg font-extrabold glow-cyan bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9]"
          >
            {submitting ? "Activating…" : cfg.activation.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
