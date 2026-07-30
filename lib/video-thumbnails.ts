const THUMB_V = "20260730a"

/** Custom-designed thumbnails for training videos, keyed by Vimeo video id. */
export const VIDEO_THUMBNAILS: Record<string, string> = {
  // Dashboard Track A (1–3)
  "1212736531": `/thumbnails/thumb-d01-watch-this-first.webp?v=${THUMB_V}`,
  "1212736532": `/thumbnails/thumb-d02-how-the-money-flows.webp?v=${THUMB_V}`,
  "1214125517": `/thumbnails/thumb-d03-your-5-minute-tour.webp?v=${THUMB_V}`,

  // Academy core (4–5)
  "1214128570": `/thumbnails/thumb-04-gold-rush.webp?v=${THUMB_V}`,
  "1214131356": `/thumbnails/thumb-05-my-vault.webp?v=${THUMB_V}`,

  // Premium (6–9)
  "1214134021": `/thumbnails/thumb-06-accelerator.webp?v=${THUMB_V}`,
  "1214136849": `/thumbnails/thumb-07-recurring-streams.webp?v=${THUMB_V}`,
  "1214140189": `/thumbnails/thumb-08-social-payouts.webp?v=${THUMB_V}`,
  "1214142200": `/thumbnails/thumb-09-protector.webp?v=${THUMB_V}`,
}

export function getVideoThumbnail(videoUrlOrId: string): string | null {
  const idMatch = videoUrlOrId.match(/(?:video\/|^)(\d{7,12})/)
  const id = idMatch?.[1] ?? videoUrlOrId
  return VIDEO_THUMBNAILS[id] ?? null
}
