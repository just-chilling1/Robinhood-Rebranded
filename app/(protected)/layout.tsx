import type React from "react"

/**
 * Protected route group — chrome comes from AppProviders/Shell in the root layout.
 * Keep this layout as a passthrough so Shell owns sidebar/bottom-nav once.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
