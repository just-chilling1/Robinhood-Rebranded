"use client"

import dynamic from "next/dynamic"

const SpecialistWelcomePopup = dynamic(
  () =>
    import("@/components/ui/specialist-welcome-popup").then(
      (mod) => mod.SpecialistWelcomePopup,
    ),
  { ssr: false },
)

/** Client mount point for the gated specialist popup inside the protected shell. */
export function SpecialistWelcomePopupHost() {
  return <SpecialistWelcomePopup />
}
