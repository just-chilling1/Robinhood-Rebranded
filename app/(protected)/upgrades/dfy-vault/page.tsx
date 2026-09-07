import { Metadata } from "next"
import DFYVaultClient from "./DFYVaultClient"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.dfyVault} | Pre-Loaded Opportunities`,
  description: "200+ viral videos with ready-to-use comments",
}

export default function DFYVaultPage() {
  return <DFYVaultClient />
}
