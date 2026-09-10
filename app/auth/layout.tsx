import type React from "react"
import { AuthRouteFrame } from "@/components/layout/AuthRouteFrame"

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return <AuthRouteFrame>{children}</AuthRouteFrame>
}
