"use client"

import Link from "next/link"
import { ArrowRight, Clock, Headphones } from "lucide-react"
import { clsx } from "clsx"
import { support } from "@/config/support.config"

interface SupportCtaBannerProps {
  className?: string
  title?: string
  description?: string
  ctaLabel?: string
  href?: string
}

/** Compact support CTA at the end of protected pages. */
export function SupportCtaBanner({
  className,
  title = "Need help with your account?",
  description = "Our support team is here if something looks off.",
  ctaLabel = support.ctaLabel,
  href = support.contactUrl,
}: SupportCtaBannerProps) {
  return (
    <section
      aria-labelledby="support-cta-heading"
      className={clsx("support-cta-banner", className)}
    >
      <div className="support-cta-banner__inner">
        <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
          <div className="support-cta-banner__icon" aria-hidden>
            <Headphones size={20} strokeWidth={1.85} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 id="support-cta-heading" className="support-cta-banner__title">
                {title}
              </h3>
              <span className="support-cta-banner__chip">
                <Clock size={12} strokeWidth={2.25} aria-hidden />
                Typical reply · ~2 hours
              </span>
            </div>
            <p className="support-cta-banner__desc">{description}</p>
          </div>
        </div>

        <Link href={href} className="support-cta-banner__cta">
          {ctaLabel}
          <ArrowRight size={16} className="support-cta-banner__cta-icon" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
