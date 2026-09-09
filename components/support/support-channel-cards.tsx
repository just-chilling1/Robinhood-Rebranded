"use client"

import { useState, type MouseEvent } from "react"
import { Check, Copy, ExternalLink, Mail, MessageCircle } from "lucide-react"
import { support } from "@/lib/support"

export function SupportChannelCards() {
  const [copied, setCopied] = useState(false)

  const copyEmail = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    void navigator.clipboard.writeText(support.email).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <a href={`mailto:${support.email}`} className="group">
        <div className="card-base flex h-full items-center gap-4 transition-[border-color,box-shadow,transform,background-color] duration-[160ms] hover:-translate-y-0.5 hover:border-success/40 hover:bg-success/5 hover:shadow-hover">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-success/25 bg-success-light transition-colors group-hover:bg-success/15">
            <Mail className="h-6 w-6 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="ds-h4 mb-0.5">Email Support</h3>
            <p className="truncate text-sm text-text-muted">{support.email}</p>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-text-muted transition-colors hover:border-success/40 hover:text-success"
            aria-label={copied ? "Email copied" : "Copy support email"}
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </a>

      <a href={support.helpCenterUrl} target="_blank" rel="noopener noreferrer" className="group">
        <div className="card-base flex h-full items-center gap-4 transition-[border-color,box-shadow,transform,background-color] duration-[160ms] hover:-translate-y-0.5 hover:border-sapphire-500/40 hover:bg-sapphire-100 hover:shadow-hover">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100 transition-colors group-hover:bg-sapphire-200">
            <MessageCircle className="h-6 w-6 text-sapphire-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="ds-h4 mb-0.5">Support Portal</h3>
            <p className="truncate text-sm text-text-muted">Browse articles and track tickets</p>
          </div>
          <ExternalLink className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-sapphire-700" />
        </div>
      </a>
    </div>
  )
}
