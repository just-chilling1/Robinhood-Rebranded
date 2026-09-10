import { Gem, Sparkles, Zap, ShieldCheck, FileText, BookOpen, Package, type LucideIcon } from "lucide-react"

/** User-facing premium tier names — single source of truth. */
export const PREMIUM_FEATURE_LABELS = {
  dfyVault: "Unlimited",
  instantIncome: "Instant Income",
  automatedIncome: "Automated Profits",
  protector: "Cyber Protection",
  licenseRights: "Reseller & License Rights",
  highTicketPayouts: "Guaranteed High-Ticket Payouts",
  dfyProfit: "Done-For-You Profit",
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
 * Premium feature catalog for dashboard widgets (includes descriptions).
 * Nav hrefs/labels are owned by src/config/navigation.config.ts — keep in sync.
 */
export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    href: "/upgrades/dfy-profit",
    label: PREMIUM_FEATURE_LABELS.dfyProfit,
    description: "One link, one niche, a complete promo kit in one run.",
    icon: Package,
  },
  {
    href: "/upgrades/high-ticket-payouts",
    label: PREMIUM_FEATURE_LABELS.highTicketPayouts,
    description: "100 ready-to-publish authority articles built around your offer.",
    icon: BookOpen,
  },
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
    href: "/upgrades/license-rights",
    label: PREMIUM_FEATURE_LABELS.licenseRights,
    description: "Request reseller license rights — our team activates the edition.",
    icon: FileText,
  },
  {
    href: "/upgrades/protector",
    label: PREMIUM_FEATURE_LABELS.protector,
    description: "Keep your account and links safe and healthy.",
    icon: ShieldCheck,
  },
]
