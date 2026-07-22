import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full app-bg">
      <AppSidebar />
      <main className="app-shell-main">
        <div className="app-content-panel">{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}
