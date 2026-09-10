"use client"

import { BrandStyleProvider } from "./BrandStyleProvider"
import { Shell } from "./Shell"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrandStyleProvider>
      <Shell>{children}</Shell>
    </BrandStyleProvider>
  )
}
