import { Metadata } from "next"
import { Mail, ExternalLink, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SUPPORT_EMAIL, SUPPORT_MAILTO, SUPPORT_PORTAL_URL } from "@/lib/support"
import { PRODUCT_NAME } from "@/lib/brand"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: `Support | ${PRODUCT_NAME}`,
  description: `Contact ${PRODUCT_NAME} support or visit the help portal`,
}

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Support"
        title="Support"
        subtitle={`Priority help for your ${PRODUCT_NAME} account. We're here when you need us.`}
      />

      <div className="mx-auto max-w-3xl">
      <Card className="glass-strong border-2 border-[var(--border)] glow-blue">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[#486581]/50 p-5">
            <MessageCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#2563EB]" />
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">Support portal</h2>
              <p className="mt-1 text-sm text-[#486581] leading-relaxed">
                Browse articles, submit tickets, and track responses in our help center.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-4 bg-gradient-to-r from-[#2563EB] to-[#2563EB] font-extrabold text-white hover:from-[#1D4ED8] hover:to-[#1D4ED8]"
              >
                <a href={SUPPORT_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                  Open Support Portal
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[#486581]/50 p-5">
            <Mail className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#2563EB]" />
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">Email support</h2>
              <p className="mt-1 text-sm text-[#486581] leading-relaxed">
                Prefer email? Reach our team directly and we&apos;ll get back to you as soon as
                possible.
              </p>
              <p className="mt-3 font-mono text-sm font-semibold text-[#102A43]">{SUPPORT_EMAIL}</p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-4 border-2 border-[var(--border)] bg-card font-bold text-[#1E40AF] hover:bg-[#EEF4FF]"
              >
                <a href={SUPPORT_MAILTO}>Send Email</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
