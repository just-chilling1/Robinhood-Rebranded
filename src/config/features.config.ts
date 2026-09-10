/** Wifi Code feature catalog — only modules that exist in this product. */

export const FEATURE_IDS = [
  "gold-rush",
  "my-vault",
  "link-vault",
  "training",
  "support",
  "bonus-training",
  "premium-dfy-profit",
  "premium-high-ticket",
  "premium-dfy-vault",
  "premium-instant",
  "premium-automated",
  "premium-license-rights",
  "protector",
] as const

export type FeatureId = (typeof FEATURE_IDS)[number]

export type FeatureTier = "core" | "premium"

export interface FeatureMeta {
  id: FeatureId
  tier: FeatureTier
  description: string
}

export const FEATURE_CATALOG: FeatureMeta[] = [
  { id: "gold-rush", tier: "core", description: "Find videos and generate viral comment packs." },
  { id: "my-vault", tier: "core", description: "Saved comments library." },
  { id: "link-vault", tier: "core", description: "Saved affiliate links." },
  { id: "training", tier: "core", description: "Academy training videos." },
  { id: "support", tier: "core", description: "Help, FAQ, and contact." },
  { id: "bonus-training", tier: "core", description: "Bonus / free training landing." },
  { id: "premium-dfy-profit", tier: "premium", description: "Done-For-You Profit kit." },
  { id: "premium-high-ticket", tier: "premium", description: "Guaranteed High-Ticket Payouts articles." },
  { id: "premium-dfy-vault", tier: "premium", description: "Unlimited ready-made templates vault." },
  { id: "premium-instant", tier: "premium", description: "Instant Income tools." },
  { id: "premium-automated", tier: "premium", description: "Automated Profits tools." },
  { id: "premium-license-rights", tier: "premium", description: "Reseller & License Rights request." },
  { id: "protector", tier: "premium", description: "Cyber Protection." },
]

/** All Wifi Code modules enabled. */
export const enabledFeatures: FeatureId[] = [...FEATURE_IDS]

export function isFeatureEnabled(id: FeatureId): boolean {
  return enabledFeatures.includes(id)
}

export function getFeatureMeta(id: FeatureId): FeatureMeta | undefined {
  return FEATURE_CATALOG.find((f) => f.id === id)
}
