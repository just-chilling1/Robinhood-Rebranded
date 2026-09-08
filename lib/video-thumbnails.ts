/** Local WebP posters, keyed by Vimeo ID. */
export const VIDEO_THUMBNAILS: Record<string, string> = {
  "1212736531": "/thumbnails/thumb-d01-watch-this-first.webp",
  "1212736532": "/thumbnails/thumb-d02-how-the-money-flows.webp",
  "1214125517": "/thumbnails/thumb-d03-your-5-minute-tour.webp",
  "1214128570": "/thumbnails/thumb-04-gold-rush.webp",
  "1214131356": "/thumbnails/thumb-05-my-vault.webp",
  "1214134021": "/thumbnails/thumb-06-accelerator.webp",
  "1214136849": "/thumbnails/thumb-07-recurring-streams.webp",
  "1214140189": "/thumbnails/thumb-08-social-payouts.webp",
  "1214142200": "/thumbnails/thumb-09-protector.webp",
}

export function getVideoThumbnail(videoIdOrUrl: string): string | null {
  const id = videoIdOrUrl.match(/\d{7,}/)?.[0]
  if (!id) return null
  return VIDEO_THUMBNAILS[id] ?? null
}
