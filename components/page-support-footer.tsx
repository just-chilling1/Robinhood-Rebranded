"use client"

import { usePathname } from "next/navigation"
import { DashboardSupportBanner } from "@/components/dashboard-support-banner"

/** Support CTA banner at the end of every protected page (skipped on /support). */
export function PageSupportFooter() {
  const pathname = usePathname()
  if (pathname === "/support") return null

  return (
    <div className="mx-auto mt-10 max-w-7xl">
      <DashboardSupportBanner />
    </div>
  )
}
