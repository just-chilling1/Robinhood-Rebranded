"use client"

import Link from "next/link"
import { ArrowRight, Flame } from "lucide-react"
import { FREE_TRAINING_URL } from "@/lib/support"
import { Card, CardContent } from "@/components/ui/card"

/** Compact free-training ad between dashboard videos. */
export function BonusTrainingCard() {
  return (
    <Card className="glass-strong border border-white/10 overflow-hidden shadow-lg">
      <CardContent className="p-5 md:p-6">
        <div className="space-y-4 text-sm leading-relaxed text-[#94a3b8] md:text-[15px]">
          <p>
            Imagine rolling out of bed, checking your phone, and seeing an extra
            <span className="font-semibold text-white"> $1,000, $3,000, or even $5,000 </span>
            deposited into your account—without grinding away at a 9-to-5 job, begging for overtime,
            or stressing over side hustles that barely pay the bills.
          </p>
          <p>
            This isn&apos;t some wild fantasy—it&apos;s a real, proven system that countless everyday
            people are using to generate consistent, life-changing income on autopilot. No experience?
            No problem. No tech skills? Doesn&apos;t matter. This works for anyone willing to follow a
            simple, step-by-step process.
          </p>
          <p>
            The best part?{" "}
            <span className="font-semibold text-white">It runs 24/7, even while you sleep.</span>
          </p>
          <p className="flex items-start gap-2 font-semibold text-white">
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#fbbf24]" />
            <span>Ready to break free from financial stress and start living life on your terms?</span>
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#fbbf24]" />
          </p>
          <p>
            Click the button below and discover how you can wake up to an extra
            <span className="font-semibold text-white"> $1,000-$5,000 </span>
            in your bank account every single day!
          </p>
        </div>

        <div className="mt-5 flex justify-center">
          <Link
            href={FREE_TRAINING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xl items-center justify-center gap-2 rounded-lg bg-[#fbbf24] px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition-all hover:bg-[#ffd54a] sm:w-auto"
          >
            Yes! Show Me How To Earn $1,000-$5,000 A Day
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
