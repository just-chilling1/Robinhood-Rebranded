/** Premium upgrade training videos (roster 6–10). */
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export const PREMIUM_TRAINING_VIMEO_IDS = {
  accelerator: "1214134021",
  recurringStreams: "1214136849",
  socialPayouts: "1214140189",
  protector: "1214142200",
  /** Swap in the real Vimeo ID when the Reseller training is uploaded. */
  licenseRights: "",
  /** Swap in the real Vimeo ID when the High-Ticket Payouts training is uploaded. */
  highTicketPayouts: "",
} as const

export type PremiumTrainingKey = keyof typeof PREMIUM_TRAINING_VIMEO_IDS

export const PREMIUM_TRAINING_MODULES = [
  {
    key: "accelerator" as const,
    title: `${PREMIUM_FEATURE_LABELS.dfyVault} Training`,
    feature: PREMIUM_FEATURE_LABELS.dfyVault,
    description:
      `Watch this first to maximize your results with the 200+ ${PREMIUM_FEATURE_LABELS.dfyVault} videos and ready-made comment packs`,
  },
  {
    key: "recurringStreams" as const,
    title: `${PREMIUM_FEATURE_LABELS.instantIncome} Training`,
    feature: PREMIUM_FEATURE_LABELS.instantIncome,
    description: "Learn how to copy the 200+ proven Facebook posts and start making money today",
  },
  {
    key: "socialPayouts" as const,
    title: `${PREMIUM_FEATURE_LABELS.automatedIncome} Training`,
    feature: PREMIUM_FEATURE_LABELS.automatedIncome,
    description: "Learn how to submit your link to 100+ traffic sources and get automated traffic forever",
  },
  {
    key: "protector" as const,
    title: `${PREMIUM_FEATURE_LABELS.protector} Training`,
    feature: PREMIUM_FEATURE_LABELS.protector,
    description: `Understand how ${PREMIUM_FEATURE_LABELS.protector} keeps your ${PRODUCT_NAME} account and activity secure`,
  },
  {
    key: "licenseRights" as const,
    title: `${PREMIUM_FEATURE_LABELS.licenseRights} Training`,
    feature: PREMIUM_FEATURE_LABELS.licenseRights,
    description:
      "Learn how to request activation for the Full Turnkey Reseller & License Rights Edition",
  },
  {
    key: "highTicketPayouts" as const,
    title: `${PREMIUM_FEATURE_LABELS.highTicketPayouts} Training`,
    feature: PREMIUM_FEATURE_LABELS.highTicketPayouts,
    description:
      "Learn how to pick an authority article, preview it with your offer link inside, and publish it on Medium, LinkedIn, or your own blog",
  },
] as const

export function getPremiumTrainingVimeoId(key: PremiumTrainingKey) {
  return PREMIUM_TRAINING_VIMEO_IDS[key]
}
