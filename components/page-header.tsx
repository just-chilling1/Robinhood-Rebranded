import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  /** Small accent label above the title, e.g. "Home", "Gold Rush" */
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  /** Right-aligned slot (counters, primary action) */
  actions?: ReactNode
  /** Extra classes on the h1 — use to override Playfair on a specific page */
  titleClassName?: string
}

/**
 * Standard page header: eyebrow + h1 + subtitle, consistent spacing.
 * Every dashboard page starts with this so hierarchy and rhythm match.
 */
export function PageHeader({ eyebrow, title, subtitle, actions, titleClassName }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 page-enter sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="page-eyebrow mb-2">{eyebrow}</p>
        <h1 className={cn("ds-h1", titleClassName)}>{title}</h1>
        {subtitle ? <p className="ds-subtitle mt-2 max-w-2xl">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  )
}
