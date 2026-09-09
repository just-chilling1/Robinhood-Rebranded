/** Local WebP posters keyed by training-video roster slug. */
export const VIDEO_THUMBNAIL_PATHS = {
  "watch-this-first": "/thumbnails/wc-thumb-01-watch-this-first.webp",
  "how-the-money-flows": "/thumbnails/wc-thumb-02-how-the-money-flows.webp",
  "your-5-minute-tour": "/thumbnails/wc-thumb-03-your-5-minute-tour.webp",
  "gold-rush-mindset": "/thumbnails/wc-thumb-04-gold-rush-mindset.webp",
  "gold-rush": "/thumbnails/wc-thumb-05-gold-rush.webp",
  "my-vault-mindset": "/thumbnails/wc-thumb-06-my-vault-mindset.webp",
  "my-vault": "/thumbnails/wc-thumb-07-my-vault.webp",
  "link-vault-mindset": "/thumbnails/wc-thumb-08-link-vault-mindset.webp",
  "link-vault": "/thumbnails/wc-thumb-09-link-vault.webp",
  "unlimited-mindset": "/thumbnails/wc-thumb-10-unlimited-mindset.webp",
  unlimited: "/thumbnails/wc-thumb-11-unlimited.webp",
  "instant-income-mindset": "/thumbnails/wc-thumb-12-instant-income-mindset.webp",
  "instant-income": "/thumbnails/wc-thumb-13-instant-income.webp",
  "automated-profits-mindset": "/thumbnails/wc-thumb-14-automated-profits-mindset.webp",
  "automated-profits": "/thumbnails/wc-thumb-15-automated-profits.webp",
  "cyber-protection-mindset": "/thumbnails/wc-thumb-16-cyber-protection-mindset.webp",
  "cyber-protection": "/thumbnails/wc-thumb-17-cyber-protection.webp",
  "reseller-license-rights-mindset":
    "/thumbnails/wc-thumb-18-reseller-license-rights-mindset.webp",
  "reseller-license-rights": "/thumbnails/wc-thumb-19-reseller-license-rights.webp",
  "high-ticket-payouts-mindset":
    "/thumbnails/wc-thumb-20-high-ticket-payouts-mindset.webp",
  "high-ticket-payouts": "/thumbnails/wc-thumb-21-high-ticket-payouts.webp",
} as const

export type VideoThumbnailSlug = keyof typeof VIDEO_THUMBNAIL_PATHS

const VIMEO_TO_SLUG: Partial<Record<string, VideoThumbnailSlug>> = {
  "1212736531": "watch-this-first",
  "1212736532": "how-the-money-flows",
  "1214125517": "your-5-minute-tour",
  "1214128570": "gold-rush",
  "1214131356": "my-vault",
  "1214134021": "unlimited",
  "1214136849": "instant-income",
  "1214140189": "automated-profits",
  "1214142200": "cyber-protection",
}

type ThumbnailLookup = {
  slug?: VideoThumbnailSlug
  vimeoId?: string
}

export function getVideoThumbnailPath(slug: VideoThumbnailSlug): string {
  return VIDEO_THUMBNAIL_PATHS[slug]
}

/** Resolve a poster by slug first, then by Vimeo ID when present. */
export function getVideoThumbnail({ slug, vimeoId }: ThumbnailLookup = {}): string | null {
  if (slug) return VIDEO_THUMBNAIL_PATHS[slug] ?? null
  const id = vimeoId?.match(/\d{7,}/)?.[0]
  if (id && VIMEO_TO_SLUG[id]) return VIDEO_THUMBNAIL_PATHS[VIMEO_TO_SLUG[id]!] ?? null
  return null
}
