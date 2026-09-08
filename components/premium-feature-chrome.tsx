import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export function PremiumFeatureBanner({
  icon: Icon,
  kicker,
  title,
  description,
  chip,
}: {
  icon: LucideIcon
  kicker: string
  title: string
  description: ReactNode
  chip?: string
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-card shadow-[var(--ds-shadow-card)]">
      <div className="flex flex-col lg:flex-row">
        <div className="flex items-center gap-4 bg-ink px-5 py-5 text-white sm:px-6 lg:w-[240px] lg:flex-col lg:items-start lg:justify-center lg:py-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-ink">
            <Icon size={22} aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">{kicker}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-white">{title}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">{description}</p>
          {chip ? (
            <span className="inline-flex items-center self-start rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white sm:self-center">
              {chip}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function PremiumSteps({
  eyebrow = "How it works",
  title,
  steps,
}: {
  eyebrow?: string
  title: string
  steps: readonly { num: string; title: string; desc: string }[]
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="page-eyebrow mb-2">{eyebrow}</p>
        <h2 className="text-xl font-medium text-ink">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.num}
            className="rounded-xl border border-[var(--ds-line)] bg-card p-5 sm:p-6"
          >
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
              {step.num}
            </span>
            <h3 className="text-base font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
