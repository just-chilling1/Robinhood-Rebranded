"use client"

import { brand } from "@/config/brand.config"
import { BrandLogo } from "@/components/brand-logo"

interface AuthLayoutProps {
  children: React.ReactNode
  subtitle?: string
}

/** Blackbox-shaped auth frame on Wifi Code sapphire. */
export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  return (
    <div
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden p-4 sm:p-6"
      style={{ backgroundColor: brand.colors.authPage }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card flex flex-col gap-5 border border-[var(--ds-line)] p-5 sm:gap-6 sm:p-6 lg:p-8">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <BrandLogo variant="wordmark" width={220} priority className="rounded-[var(--ds-r-md)]" />
            {subtitle ? <p className="text-[15px] font-medium text-ink-3">{subtitle}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
