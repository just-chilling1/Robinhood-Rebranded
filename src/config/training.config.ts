/**
 * Training video lists stay in lib/* (Vimeo IDs must not drift).
 * This config only holds shell-facing training routes/labels.
 */
export const training = {
  academyPath: "/training",
  bonusTrainingPath: "/bonus-training",
  sectionLabel: "Academy",
} as const
