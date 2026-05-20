import { Metadata } from "next"
import { Headphones, Mail, ExternalLink, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SUPPORT_EMAIL, SUPPORT_MAILTO, SUPPORT_PORTAL_URL } from "@/lib/support"

export const metadata: Metadata = {
  title: "Support | Robinhood",
  description: "Contact Robinhood support or visit the help portal",
}

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="glass-strong rounded-2xl border-2 border-[#0ea5e9]/30 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9] shadow-lg">
            <Headphones className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Support</h1>
            <p className="mt-2 text-base text-[#7dd3fc]">
              Priority help for your Robinhood account. We&apos;re here when you need us.
            </p>
          </div>
        </div>
      </div>

      <Card className="glass-strong border-2 border-[#06b6d4]/40 glow-cyan">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-4 rounded-2xl border border-[#0ea5e9]/20 bg-[#0f172a]/50 p-5">
            <MessageCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#0ea5e9]" />
            <div>
              <h2 className="text-lg font-bold text-white">Support portal</h2>
              <p className="mt-1 text-sm text-[#7dd3fc] leading-relaxed">
                Browse articles, submit tickets, and track responses in our help center.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-4 bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] font-extrabold text-white hover:opacity-90"
              >
                <a href={SUPPORT_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                  Open Support Portal
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-[#0ea5e9]/20 bg-[#0f172a]/50 p-5">
            <Mail className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#ec4899]" />
            <div>
              <h2 className="text-lg font-bold text-white">Email support</h2>
              <p className="mt-1 text-sm text-[#7dd3fc] leading-relaxed">
                Prefer email? Reach our team directly and we&apos;ll get back to you as soon as
                possible.
              </p>
              <p className="mt-3 font-mono text-sm font-semibold text-white">{SUPPORT_EMAIL}</p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-4 border-2 border-[#ec4899]/40 bg-transparent font-bold text-[#f9a8d4] hover:bg-[#ec4899]/10"
              >
                <a href={SUPPORT_MAILTO}>Send Email</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
