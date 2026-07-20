/** Custom-designed thumbnails for training videos, keyed by Vimeo video id. */
export const VIDEO_THUMBNAILS: Record<string, string> = {
  "1151044408": "/thumbnails/thumb-01-welcome-getting-started.webp",
  "1151044475": "/thumbnails/thumb-02-gold-rush-training.webp",
  "1151044790": "/thumbnails/thumb-03-my-vault-training.webp",
  "1151044893": "/thumbnails/thumb-04-accelerator-training.webp",
  "1151045100": "/thumbnails/thumb-05-recurring-streams-training.webp",
  "1151045210": "/thumbnails/thumb-06-social-payouts-training.webp",
}

export function getVideoThumbnail(videoUrlOrId: string): string | null {
  const idMatch = videoUrlOrId.match(/(\d{7,})/)
  if (!idMatch) return null
  return VIDEO_THUMBNAILS[idMatch[1]] ?? null
}
