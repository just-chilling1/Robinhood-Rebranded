import type { Metadata } from "next"
import LinkVaultClient from "./LinkVaultClient"

export const metadata: Metadata = {
  title: "Link Vault | RH",
  description: "Store and manage your affiliate links for maximum conversions.",
}

export default function LinkVaultPage() {
  return <LinkVaultClient />
}
