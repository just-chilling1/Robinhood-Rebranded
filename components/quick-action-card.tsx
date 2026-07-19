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

const accents = {
  blue: {
    text: "text-[#0ea5e9]",
    tile: "bg-[#0ea5e9]/15 border-[#0ea5e9]/30",
    hoverBorder: "hover:border-[#0ea5e9]/60",
    hoverShadow: "hover:shadow-[#0ea5e9]/10",
  },
  pink: {
    text: "text-[#ec4899]",
    tile: "bg-[#ec4899]/15 border-[#ec4899]/30",
    hoverBorder: "hover:border-[#ec4899]/60",
    hoverShadow: "hover:shadow-[#ec4899]/10",
  },
  cyan: {
    text: "text-[#06b6d4]",
    tile: "bg-[#06b6d4]/15 border-[#06b6d4]/30",
    hoverBorder: "hover:border-[#06b6d4]/60",
    hoverShadow: "hover:shadow-[#06b6d4]/10",
  },
} as const

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  glowColor = "blue",
}: QuickActionCardProps) {
  const accent = accents[glowColor]

  return (
    <Link
      href={href}
      className={`group glass-strong flex h-full flex-col rounded-2xl border border-white/10 p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${accent.hoverBorder} ${accent.hoverShadow}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accent.tile}`}>
          <Icon className={`h-6 w-6 ${accent.text}`} />
        </div>
        <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>
      </div>

      <p className="mb-5 flex-1 text-base leading-relaxed text-[#a5c9e8]">{description}</p>

      <span className={`inline-flex items-center gap-2 text-base font-black ${accent.text}`}>
        {buttonText}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
