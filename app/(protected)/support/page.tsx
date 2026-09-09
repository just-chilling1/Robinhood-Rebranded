import { Metadata } from "next"
import { SupportPageContent } from "@/components/support/support-page-content"
import { PRODUCT_NAME } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Support | ${PRODUCT_NAME}`,
  description: `Contact ${PRODUCT_NAME} support or visit the help portal`,
}

export default function SupportPage() {
  return <SupportPageContent />
}
