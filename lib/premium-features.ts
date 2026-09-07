import { Gem, Sparkles, Zap, ShieldCheck, type LucideIcon } from "lucide-react"

/** User-facing premium tier names — single source of truth. */
export const PREMIUM_FEATURE_LABELS = {
  dfyVault: "Unlimited",
  instantIncome: "Instant Income",
  automatedIncome: "Automated Profits",
  protector: "Cyber Protection",
} as const

export type PremiumFeatureKey = keyof typeof PREMIUM_FEATURE_LABELS

export type UpgradeLevel = "free" | "dfy_vault" | "instant_income" | "automated_income"

const UPGRADE_LEVEL_LABELS: Record<UpgradeLevel, string> = {
  free: "Core Access",
  dfy_vault: PREMIUM_FEATURE_LABELS.dfyVault,
  instant_income: PREMIUM_FEATURE_LABELS.instantIncome,
  automated_income: PREMIUM_FEATURE_LABELS.automatedIncome,
}

export function getUpgradeLevelLabel(level: string | null | undefined): string {
  if (level && level in UPGRADE_LEVEL_LABELS) {
    return UPGRADE_LEVEL_LABELS[level as UpgradeLevel]
  }
  return "Core Access"
}

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
    label: PREMIUM_FEATURE_LABELS.dfyVault,
    description: "Ready-made templates so you can skip the hard part.",
    icon: Gem,
  },
  {
    href: "/upgrades/instant-income",
    label: PREMIUM_FEATURE_LABELS.instantIncome,
    description: "Training and tools to fast-track your earnings.",
    icon: Sparkles,
  },
  {
    href: "/upgrades/automated-income",
    label: PREMIUM_FEATURE_LABELS.automatedIncome,
    description: "Automation that keeps working after you set it up.",
    icon: Zap,
  },
  {
    href: "/upgrades/protector",
    label: PREMIUM_FEATURE_LABELS.protector,
    description: "Keep your account and links safe and healthy.",
    icon: ShieldCheck,
  },
]
