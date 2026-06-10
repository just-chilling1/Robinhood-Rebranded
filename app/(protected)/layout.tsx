import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AccountVerifiedModal } from "@/components/dashboard/AccountVerifiedModal"
import { EarningsBanner } from "@/components/earnings-banner"
import { WelcomePopup } from "@/components/welcome-popup"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0E12]">
      <WelcomePopup />
      <AppSidebar />
      <main className="flex-1 min-w-0 ml-60 p-4 lg:p-6">
        <EarningsBanner />
        {children}
      </main>
      <AccountVerifiedModal />
    </div>
  )
}
