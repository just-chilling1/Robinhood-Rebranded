import { PREMIUM_FEATURE_LABELS, getUpgradeLevelLabel, type UpgradeLevel } from "@/lib/premium-features"

export type { UpgradeLevel }

export function getUpgradeLabel(level: string | null | undefined): string {
  return getUpgradeLevelLabel(level)
}

export function getMembershipStatus(level: string | null | undefined): string {
  if (!level || level === "free") return "Active"
  return "Premium Active"
}

export function formatProtectorDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return "Just now"
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`
  return formatProtectorDate(iso)
}

export function shortenUserId(id: string): string {
  return `${id.slice(0, 8)}…`
}

export { PREMIUM_FEATURE_LABELS }
