const DEFAULT_SITE_URL = "https://robinhoodaccess.com"

/** Canonical app URL for auth redirects (password reset, email links). */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  }

  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return DEFAULT_SITE_URL
}

export function getAuthCallbackUrl(nextPath: string): string {
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`
}
