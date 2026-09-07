import type { Metadata } from "next"
import LinkVaultClient from "./LinkVaultClient"
import { PRODUCT_NAME } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Link Vault | ${PRODUCT_NAME}`,
  description: "Store and manage your affiliate links for maximum conversions.",
}

export default function LinkVaultPage() {
  return <LinkVaultClient />
}
