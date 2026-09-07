import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  buttonText: string
  glowColor?: "blue" | "pink" | "cyan"
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="card-interactive group flex h-full flex-col hover:-translate-y-0.5"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--ds-r-md)] border border-[var(--ds-line-sapphire)] bg-sapphire-200">
          <Icon className="h-6 w-6 text-sapphire-700" />
        </div>
        <h3 className="ds-h3">{title}</h3>
      </div>

      <p className="mb-5 flex-1 text-[15px] leading-relaxed text-ink-2">{description}</p>

      <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-sapphire-700">
        {buttonText}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
