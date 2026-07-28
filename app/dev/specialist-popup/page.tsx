"use client"

import { SpecialistWelcomePopup } from "@/components/ui/specialist-welcome-popup"

/**
 * Dev-only visual preview — skips geo/IP and business-hours gates.
 * Middleware blocks /dev/* outside development.
 */
export default function SpecialistPopupDevPreviewPage() {
  return <SpecialistWelcomePopup forceOpen />
}
