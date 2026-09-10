"use client"

import { usePathname } from "next/navigation"
import { AuthSupportWidget } from "@/components/auth-support-widget"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { brand } from "@/config/brand.config"

export function AuthRouteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = pathname.startsWith("/auth/callback")

  if (bare) {
    return <>{children}</>
  }

  return (
    <>
      <AuthLayout subtitle={brand.authTagline}>{children}</AuthLayout>
      <AuthSupportWidget />
    </>
  )
}
