import type { FeatureId } from "./features.config"

export type NavIconName =
  | "LayoutDashboard"
  | "Brain"
  | "FolderOpen"
  | "Upload"
  | "Play"
  | "Headphones"
  | "Gem"
  | "Sparkles"
  | "Zap"
  | "ShieldCheck"
  | "FileText"
  | "BookOpen"
  | "Package"

export interface NavItem {
  path: string
  label: string
  /** Optional subtitle for expanded sidebar rows */
  subtitle?: string
  icon: NavIconName
  feature?: FeatureId
}

export const homeNav: NavItem = {
  path: "/dashboard",
  label: "Dashboard",
  subtitle: "Home",
  icon: "LayoutDashboard",
}

/** Main sidebar functions — paths match current Wifi Code routes. */
export const mainNav: NavItem[] = [
  homeNav,
  {
    path: "/create",
    label: "Gold Rush",
    subtitle: "Make comments",
    icon: "Brain",
    feature: "gold-rush",
  },
  {
    path: "/pages",
    label: "My Vault",
    subtitle: "Your saved comments",
    icon: "FolderOpen",
    feature: "my-vault",
  },
  {
    path: "/share",
    label: "Your links",
    subtitle: "Saved affiliate links",
    icon: "Upload",
    feature: "link-vault",
  },
  {
    path: "/training",
    label: "Academy",
    subtitle: "Training videos",
    icon: "Play",
    feature: "training",
  },
]

export const supportNav: NavItem = {
  path: "/support",
  label: "Support",
  icon: "Headphones",
  feature: "support",
}

/** Premium section — hrefs/labels match lib/premium-features.ts. */
export const premiumNav: NavItem[] = [
  {
    path: "/upgrades/dfy-profit",
    label: "Done-For-You Profit",
    icon: "Package",
    feature: "premium-dfy-profit",
  },
  {
    path: "/upgrades/high-ticket-payouts",
    label: "Guaranteed High-Ticket Payouts",
    icon: "BookOpen",
    feature: "premium-high-ticket",
  },
  {
    path: "/upgrades/dfy-vault",
    label: "Unlimited",
    icon: "Gem",
    feature: "premium-dfy-vault",
  },
  {
    path: "/upgrades/instant-income",
    label: "Instant Income",
    icon: "Sparkles",
    feature: "premium-instant",
  },
  {
    path: "/upgrades/automated-income",
    label: "Automated Profits",
    icon: "Zap",
    feature: "premium-automated",
  },
  {
    path: "/upgrades/license-rights",
    label: "Reseller & License Rights",
    icon: "FileText",
    feature: "premium-license-rights",
  },
  {
    path: "/upgrades/protector",
    label: "Cyber Protection",
    icon: "ShieldCheck",
    feature: "protector",
  },
]

export const premiumSectionLabel = "Premium Features"
export const mainSectionLabel = "Main Functions"

/** Primary mobile bottom tabs (first 4) + More sheet. */
export const bottomNavTabs: NavItem[] = [
  { path: "/dashboard", label: "Home", icon: "LayoutDashboard" },
  { path: "/create", label: "Gold Rush", icon: "Brain", feature: "gold-rush" },
  { path: "/pages", label: "Vault", icon: "FolderOpen", feature: "my-vault" },
  { path: "/training", label: "Academy", icon: "Play", feature: "training" },
]

/** Extra links for mobile More (not in bottom tabs). */
export const bottomNavMoreLinks: NavItem[] = [
  {
    path: "/share",
    label: "Your links",
    icon: "Upload",
    feature: "link-vault",
  },
  supportNav,
]
