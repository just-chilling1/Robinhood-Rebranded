import type React from "react"
import { AuthSupportWidget } from "@/components/auth-support-widget"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AuthSupportWidget />
    </>
  )
}
