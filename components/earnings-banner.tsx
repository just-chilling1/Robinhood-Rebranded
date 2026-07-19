"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export function EarningsBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative w-full rounded-2xl border-2 border-[#fbbf24]/50 bg-gradient-to-b from-[#101726] to-[#0b0f18] px-6 py-10 md:px-12 md:py-12 mb-4 text-center">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close banner"
        className="absolute right-3 top-3 rounded-lg p-1.5 text-[#7dd3fc]/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>

      <span className="mb-5 inline-block rounded-md bg-[#ef4444] px-4 py-1.5 text-sm md:text-base font-black uppercase tracking-widest text-white">
        Free Training
      </span>

      <h2 className="mx-auto mb-4 max-w-4xl text-3xl md:text-5xl font-black uppercase leading-tight text-white">
        Wake Up With An Extra{" "}
        <span className="text-[#fbbf24]">$1,000&ndash;$5,000</span>{" "}
        In Your Bank Account Tomorrow
      </h2>

      <p className="mx-auto mb-8 max-w-3xl text-lg md:text-2xl font-bold leading-snug text-[#d8e9fb]">
        Discover how to scale to $1,000&ndash;$5,000 every single day &mdash; without doing any extra work.
      </p>

      <Link
        href="https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-10 py-5 text-xl md:text-2xl font-black uppercase text-[#1a1305] shadow-xl shadow-[#fbbf24]/40 transition-all duration-200 hover:scale-[1.04] hover:shadow-[#fbbf24]/60"
      >
        Watch The Free Training &gt;&gt;
      </Link>

      <p className="mt-4 text-sm md:text-base font-black uppercase tracking-wide text-[#ef4444]">
        Warning: This will be taken down soon
      </p>
    </div>
  )
}
