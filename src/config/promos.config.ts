import { FREE_TRAINING_URL } from "./offers.config"

export type PromoTemplate = "horizontal-banner" | "footer-card" | "sidebar-card" | "modal" | "toast"

export type PromoPlacement = "global-top" | "global-footer" | "sidebar" | "modal" | "toast-bl"

export interface PromoSlot {
  id: string
  enabled: boolean
  template: PromoTemplate
  placement: PromoPlacement
  content: {
    headline?: string
    body?: string | string[]
    ctaLabel?: string
    ctaUrl?: string
    badge?: string
  }
}

/** Wifi Code: promo orchestrator off by default — existing banners stay page-local. */
export const promoSlots: PromoSlot[] = [
  {
    id: "free-training-reference",
    enabled: false,
    template: "horizontal-banner",
    placement: "global-footer",
    content: {
      badge: "FREE TRAINING",
      headline: "Watch this free training",
      ctaLabel: "Watch Now",
      ctaUrl: FREE_TRAINING_URL,
    },
  },
]

export function hasEnabledPromoOrchestrator(): boolean {
  return promoSlots.some((s) => s.enabled)
}
