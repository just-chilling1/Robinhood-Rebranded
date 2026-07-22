import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full app-bg">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-4 pb-24 pt-16 transition-[padding] duration-300 lg:pb-6 lg:pl-[calc(var(--sidebar-w)+var(--sidebar-gap))] lg:pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
