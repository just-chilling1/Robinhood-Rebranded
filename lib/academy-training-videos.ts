/**
 * Academy Track B core videos (roster 4–5).
 * Premium modules (6–10) live in lib/premium-training-videos.ts.
 */
export type AcademyTrainingVideo = {
  step: number
  title: string
  description: string
  duration: string
  vimeoId: string
}

export const ACADEMY_TRAINING_VIDEOS: readonly AcademyTrainingVideo[] = [
  {
    step: 1,
    title: "Gold Rush Training",
    description:
      "Learn how to use the Gold Rush Generator to find viral opportunities and generate money-making comments",
    duration: "10 min",
    vimeoId: "1214128570",
  },
  {
    step: 2,
    title: "My Vault Training",
    description:
      "Master the My Vault system to manage your comment packs and track your results effectively",
    duration: "12 min",
    vimeoId: "1214131356",
  },
] as const
