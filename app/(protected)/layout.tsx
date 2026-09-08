import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { PageSupportFooter } from "@/components/page-support-footer"
import { SpecialistWelcomePopupHost } from "@/components/specialist-welcome-popup-host"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full app-bg">
      <AppSidebar />
      <main className="app-shell-main">
        {children}
        <PageSupportFooter />
      </main>
      <BottomNav />
      <SpecialistWelcomePopupHost />
    </div>
  )
}
