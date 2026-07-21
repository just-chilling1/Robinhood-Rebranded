import { Gem, Sparkles, Zap, ShieldCheck, type LucideIcon } from "lucide-react"

export type PremiumFeature = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

/**
 * Single source of truth for the premium features shown in the
 * sidebar, mobile nav, and the dashboard Premium Upgrades widget.
 */
export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    href: "/upgrades/dfy-vault",
    label: "Accelerator",
    description: "Ready-made templates so you can skip the hard part.",
    icon: Gem,
  },
  {
    href: "/upgrades/instant-income",
    label: "Recurring Streams",
    description: "Training and tools to fast-track your earnings.",
    icon: Sparkles,
  },
  {
    href: "/upgrades/automated-income",
    label: "Social Payouts",
    description: "Automation that keeps working after you set it up.",
    icon: Zap,
  },
  {
    href: "/upgrades/protector",
    label: "Protector",
    description: "Keep your account and links safe and healthy.",
    icon: ShieldCheck,
  },
]
