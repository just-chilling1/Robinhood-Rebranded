import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { WelcomePopup } from "@/components/welcome-popup"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full app-bg">
      <WelcomePopup />
      <AppSidebar />
      <main className="flex-1 min-w-0 lg:ml-60 p-4 lg:p-6 pt-16 lg:pt-6 pb-24 lg:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
