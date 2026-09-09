"use client"

import { useState } from "react"
import { ExternalLink, Headphones, Mail, X } from "lucide-react"
import { SUPPORT_EMAIL, SUPPORT_MAILTO, SUPPORT_PORTAL_URL } from "@/lib/support"

/**
 * Floating "Need help?" widget for the auth pages (login / sign-up / password
 * reset). Users there are logged out, so the authenticated /api/support form
 * can't be used — this offers the same direct channels as the support page:
 * email (mailto) and the Freshdesk support portal.
 */
export function AuthSupportWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="Contact support"
          className="glass-strong w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-card/95 shadow-2xl shadow-[#2563EB]/10"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="shrink-0 rounded-lg border border-[var(--border)] bg-[#2563EB]/10 p-1.5">
                <Headphones className="h-4 w-4 text-[#102A43]" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#102A43]">
                Need help?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support panel"
              className="shrink-0 rounded-lg p-1.5 text-[#486581] transition-colors hover:bg-[#EEF4FF] hover:text-[#102A43]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 px-4 py-4">
            <p className="text-sm leading-relaxed text-[#486581]">
              Trouble signing in or accessing your account? Reach our support
              team — we usually reply within about 2 hours (up to 24–48 hours
              during busy periods).
            </p>

            <a
              href={SUPPORT_MAILTO}
              className="flex items-center gap-3 rounded-xl bg-[#2563EB] px-4 py-3 shadow-[var(--shadow-md)] transition-all hover:bg-[#1D4ED8]"
            >
              <Mail className="h-4 w-4 shrink-0 text-white" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-white">Email support</span>
                <span className="block break-all text-xs text-white/90">{SUPPORT_EMAIL}</span>
              </span>
            </a>

            <a
              href={SUPPORT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-surface-nested px-4 py-3 transition-colors hover:bg-primary-light"
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-[#486581]" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#102A43]">Open support portal</span>
                <span className="block text-xs text-[#486581]">Browse help articles or submit a ticket</span>
              </span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close support panel" : "Open support panel"}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#2563EB] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#2563EB]/30 transition-all hover:-translate-y-px hover:from-[#1D4ED8] hover:to-[#1D4ED8]"
      >
        {open ? <X className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
        <span>{open ? "Close" : "Need help?"}</span>
      </button>
    </div>
  )
}
