"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { unlockUpgrade } from "@/app/actions/unlock-upgrade"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

interface UnlockUpgradeClientProps {
  upgradeLevel: "dfy_vault" | "instant_income" | "automated_income"
  upgradeName: string
  upgradeValue: string
  features: string[]
}

export function UnlockUpgradeClient({ upgradeLevel, upgradeName, upgradeValue, features }: UnlockUpgradeClientProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    async function unlock() {
      const result = await unlockUpgrade(upgradeLevel)

      if (result.success) {
        setStatus("success")
        setShowConfetti(true)

        // Stop confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000)
      } else {
        setStatus("error")
      }
    }

    unlock()
  }, [upgradeLevel])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-sapphire-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-ink-4">Unlocking your upgrade...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 border border-[var(--border)] text-center shadow-[var(--shadow-lg)]">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">Unlock Failed</h1>
          <p className="text-ink-4 mb-6">
            We couldn't unlock your upgrade. Please make sure you're logged in and try again.
          </p>
          <Link href="/dashboard">
            <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="max-w-2xl w-full bg-card rounded-3xl p-8 border border-[var(--border)] shadow-[var(--shadow-lg)]">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-sapphire-500 animate-bounce" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-center text-ink mb-3">🎉 Congratulations!</h1>
        <p className="text-xl text-center text-sapphire-700 mb-6">
          You've unlocked <span className="font-bold">{upgradeName}</span>!
        </p>

        {/* Upgrade Value */}
        <div className="bg-card rounded-2xl p-6 mb-6 border border-[var(--border)]">
          <div className="text-center mb-4">
            <span className="text-ink-4 text-sm">Upgrade Value</span>
            <p className="text-5xl font-bold text-sapphire-700">{upgradeValue}</p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <p className="text-ink-4 font-semibold mb-3">What You Just Unlocked:</p>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sapphire-700 flex-shrink-0 mt-0.5" />
                <span className="text-ink-4">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg py-6 rounded-xl shadow-[var(--shadow-md)]">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Link href="/training" className="block">
            <Button
              variant="outline"
              className="w-full border-[var(--border)] text-sapphire-700 hover:bg-sapphire-100 font-semibold py-6 rounded-xl bg-card"
            >
              Access Training
            </Button>
          </Link>
        </div>

        {/* Footer Message */}
        <p className="text-center text-ink-4 text-sm mt-6">
          Your account has been upgraded. All premium features are now available!
        </p>
      </div>
    </div>
  )
}
