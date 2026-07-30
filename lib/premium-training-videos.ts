/** Premium upgrade training videos (roster 6–9). */
export const PREMIUM_TRAINING_VIMEO_IDS = {
  accelerator: "1214134021",
  recurringStreams: "1214136849",
  socialPayouts: "1214140189",
  protector: "1214142200",
} as const

export type PremiumTrainingKey = keyof typeof PREMIUM_TRAINING_VIMEO_IDS

export const PREMIUM_TRAINING_MODULES = [
  {
    key: "accelerator" as const,
    title: "Accelerator Training",
    feature: "Accelerator",
    description:
      "Watch this first to maximize your results with the 200+ Accelerator videos and ready-made comment packs",
  },
  {
    key: "recurringStreams" as const,
    title: "Recurring Streams Training",
    feature: "Recurring Streams",
    description: "Learn how to copy the 200+ proven Facebook posts and start making money today",
  },
  {
    key: "socialPayouts" as const,
    title: "Social Payouts Training",
    feature: "Social Payouts",
    description: "Learn how to submit your link to 100+ traffic sources and get automated traffic forever",
  },
  {
    key: "protector" as const,
    title: "Protector Training",
    feature: "Protector",
    description: "Understand how Protector keeps your Robinhood account and activity secure",
  },
] as const

export function getPremiumTrainingVimeoId(key: PremiumTrainingKey) {
  return PREMIUM_TRAINING_VIMEO_IDS[key]
}
