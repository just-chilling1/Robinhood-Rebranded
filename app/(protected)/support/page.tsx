import { Metadata } from "next"
import { Clock, ExternalLink, Headphones, Mail, MessageCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { SUPPORT_EMAIL, SUPPORT_MAILTO, SUPPORT_PORTAL_URL } from "@/lib/support"
import { PRODUCT_NAME } from "@/lib/brand"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: `Support | ${PRODUCT_NAME}`,
  description: `Contact ${PRODUCT_NAME} support or visit the help portal`,
}

export default function SupportPage() {
  return (
    <div className="page-container mx-auto w-full max-w-7xl space-y-8 animate-fade-in-up">
      <PageHeader
        eyebrow="Support"
        title="Support"
        subtitle={`Priority help for your ${PRODUCT_NAME} account. We're here when you need us.`}
      />

      <section aria-label="Priority support" className="dashboard-support-banner">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="dashboard-support-banner__icon" aria-hidden>
            <Headphones className="size-7 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="dashboard-support-banner__badge">24/7 Priority Support</p>
            <h2 className="dashboard-support-banner__title">We&apos;re here to help</h2>
            <p className="mt-1 text-[15px] font-medium leading-snug text-ink-3">
              Send a message below or use the portal and email options on the right — most replies
              arrive within a few hours.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <ContactSupportWidget />
        </div>

        <aside className="space-y-4 lg:col-span-2">
          <article className="support-option-card">
            <div className="flex items-start gap-3.5">
              <div className="support-option-card__icon" aria-hidden>
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="support-option-card__title">Support portal</h3>
                <p className="support-option-card__desc">
                  Browse articles, submit tickets, and track responses in our help center.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="dashboard-support-banner__cta w-full">
              <a href={SUPPORT_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                Open Support Portal
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
              </a>
            </Button>
          </article>

          <article className="support-option-card">
            <div className="flex items-start gap-3.5">
              <div className="support-option-card__icon" aria-hidden>
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="support-option-card__title">Email support</h3>
                <p className="support-option-card__desc">
                  Prefer email? Reach our team directly and we&apos;ll get back to you as soon as
                  possible.
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-ink">{SUPPORT_EMAIL}</p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 w-full rounded-xl border-[var(--border-strong)] bg-card font-bold text-ink hover:border-[var(--ds-sapphire-500)] hover:bg-primary-light"
            >
              <a href={SUPPORT_MAILTO}>Send Email</a>
            </Button>
          </article>

          <div className="support-info-card">
            <div className="support-info-card__icon" aria-hidden>
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="support-info-card__title">Response times</p>
              <p className="support-info-card__text">
                We usually reply within about 2 hours. During busy periods, please allow 24–48
                hours. Check your spam folder if you don&apos;t see a reply.
              </p>
            </div>
          </div>

          <div className="support-info-card">
            <div className="support-info-card__icon" aria-hidden>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="support-info-card__title">Account security</p>
              <p className="support-info-card__text">
                We will never ask for your password. Only share details needed to resolve your
                issue.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
