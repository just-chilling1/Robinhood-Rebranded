"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowRight, Check, X } from "lucide-react"

const ACCOUNT_VERIFIED_WITHDRAW_URL = "https://jvz1.com/c/3547097/442055/"

const TITLE_ID = "account-verified-modal-title"

export function AccountVerifiedModal() {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  const close = useCallback(() => {
    setDismissed(true)
  }, [])

  useEffect(() => {
    if (dismissed) return

    const timer = window.setTimeout(() => {
      setMounted(true)
      requestAnimationFrame(() => setEntered(true))
    }, 600)

    return () => window.clearTimeout(timer)
  }, [dismissed])

  useEffect(() => {
    if (dismissed) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dismissed, close])

  const handleWithdraw = () => {
    if (!ACCOUNT_VERIFIED_WITHDRAW_URL) return
    window.open(ACCOUNT_VERIFIED_WITHDRAW_URL, "_blank", "noopener,noreferrer")
  }

  if (dismissed || !mounted) return null

  const showWithdrawCta = ACCOUNT_VERIFIED_WITHDRAW_URL.length > 0

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={TITLE_ID}
      className="fixed bottom-4 left-4 z-[110] sm:bottom-5 sm:left-5 transition-all duration-300 ease-out"
      style={{
        width: "min(420px, calc(100vw - 2rem))",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div
        className="rounded-[1.35rem] border border-emerald-400/15 p-6 sm:p-8 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(5, 10, 8, 0.95)",
          boxShadow:
            "0 0 0 1px rgba(0,163,108,0.12) inset, 0 22px 70px rgba(0,0,0,0.62), 0 0 44px rgba(0,163,108,0.24)",
        }}
      >
        <div className="mb-7 flex items-center gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: "#00a36c",
              boxShadow: "0 0 22px rgba(0,163,108,0.45)",
            }}
          >
            <Check className="h-5 w-5 text-white" strokeWidth={3} aria-hidden />
          </div>
          <h2
            id={TITLE_ID}
            className="flex-1 text-sm font-extrabold uppercase tracking-[0.18em] text-[#22d38b]"
          >
            Account Verified
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close account verified modal"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/6 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d38b]"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <p className="mb-4 text-[1.05rem] font-semibold leading-relaxed text-white">
          Congratulations! You&apos;re Eligible To Withdraw
        </p>

        <p
          className="mb-2 flex items-baseline gap-0.5"
          aria-label="416 dollars and 34 cents"
        >
          <span className="relative -top-0.5 text-4xl font-extrabold text-[#22d38b]">$</span>
          <span className="text-6xl font-extrabold tracking-tight text-white">416</span>
          <span className="text-2xl font-bold text-zinc-300">.34</span>
        </p>

        <p className="mb-8 text-sm font-medium text-emerald-100/55">
          Available balance from your activity
        </p>

        {showWithdrawCta && (
          <button
            type="button"
            onClick={handleWithdraw}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#00a36c] text-base font-bold text-white shadow-[0_16px_34px_rgba(0,163,108,0.32)] transition-all hover:-translate-y-0.5 hover:bg-[#03b879] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d38b]"
          >
            Withdraw Now
            <ArrowRight className="h-[19px] w-[19px]" strokeWidth={3} aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}

