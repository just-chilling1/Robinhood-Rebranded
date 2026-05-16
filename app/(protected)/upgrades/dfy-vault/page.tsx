import { Metadata } from "next"
import DFYVaultClient from "./DFYVaultClient"

export const metadata: Metadata = {
  title: "Accelerator | Pre-Loaded Opportunities",
  description: "200+ viral videos with ready-to-use comments",
}

export default function DFYVaultPage() {
  return <DFYVaultClient />
}
