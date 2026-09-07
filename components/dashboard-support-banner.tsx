import Link from "next/link"
import { ArrowRight, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Support CTA at the bottom of the dashboard main column. */
export function DashboardSupportBanner() {
  return (
    <section
      aria-labelledby="dashboard-support-heading"
      className="dashboard-support-banner"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="dashboard-support-banner__icon" aria-hidden>
            <Headphones className="size-7 text-white" strokeWidth={2.25} />
          </div>

          <div className="min-w-0">
            <p className="dashboard-support-banner__badge">24/7 Priority Support</p>
            <h3 id="dashboard-support-heading" className="dashboard-support-banner__title">
              Need Help?
            </h3>
            <p className="mt-1 text-[15px] font-medium leading-snug text-ink-3">
              Priority support available 24/7
            </p>
          </div>
        </div>

        <Button asChild size="lg" className="dashboard-support-banner__cta w-full shrink-0 sm:w-auto">
          <Link href="/support">
            Contact Support
            <ArrowRight className="dashboard-support-banner__cta-icon size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  )
}
