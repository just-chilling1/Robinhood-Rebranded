"use client"

import { motion } from "framer-motion"
import { FileText, ShieldCheck } from "lucide-react"
import { support } from "@/lib/support"

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function SupportRefundSection() {
  const { refundPolicy } = support

  return (
    <motion.section variants={itemVariants} className="card-base">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100">
          <FileText className="h-6 w-6 text-sapphire-700" />
        </div>
        <div>
          <h2 className="ds-h3">{refundPolicy.title}</h2>
          <p className="mt-1 text-sm text-text-muted">{refundPolicy.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {refundPolicy.items.map((item, index) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sapphire-100 text-[13px] font-semibold text-sapphire-700">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="ds-h4 mb-2 text-sapphire-700">{item.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export function SupportTrustRow() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100">
        <ShieldCheck className="h-5 w-5 text-sapphire-700" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">Account security</p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          We will never ask for your password. Only share the details needed to resolve your issue, and
          check spam if you don&apos;t see a reply within 48 hours.
        </p>
      </div>
    </div>
  )
}
