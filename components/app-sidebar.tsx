"use client"

import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  Upload,
  Play,
  LogOut,
  Sparkles,
  Headphones,
  UserPlus,
  ExternalLink,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { createClient } from "@/lib/supabase/client"
import { PREMIUM_FEATURES } from "@/lib/premium-features"
import { onboardingConfig } from "@/lib/onboarding/config"

const menuItems = [
  { title: "Dashboard", subtitle: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gold Rush", subtitle: "Make comments", url: "/create", icon: Brain },
  { title: "My Vault", subtitle: "Your saved comments", url: "/pages", icon: FolderOpen },
  { title: "Your links", subtitle: "Saved affiliate links", url: "/share", icon: Upload },
  { title: "Academy", subtitle: "Training videos", url: "/training", icon: Play },
]

const exclusiveOffers = [
  {
    title: "Create your Q-LAPS2000 account",
    cta: "Create Now",
    href: "https://jvz4.com/c/3547097/442443/",
    icon: UserPlus,
  },
  {
    title: "Watch this Free training",
    cta: "Watch Now",
    href: "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea",
    icon: Play,
  },
  {
    title: "Create your Cashapp Account",
    cta: "CashTap AI",
    href: "https://jvz1.com/c/3547097/443257/",
    icon: Wallet,
  },
]

const COLLAPSE_KEY = "rh_sidebar_collapsed"

function SidebarBody({
  pathname,
  collapsed,
  onToggle,
  onNavigate,
  onSignOut,
}: {
  pathname: string
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
  onSignOut: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[inherit] bg-card">
      <div className={`border-b border-[var(--ds-line)] ${collapsed ? "px-3 py-4" : "p-4"}`}>
        <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-2"}`}>
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={`flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90 group ${
              collapsed ? "justify-center" : ""
            }`}
            title={onboardingConfig.productName}
          >
            <BrandLogo variant="icon" size={40} className="flex-shrink-0 rounded-[var(--ds-r-md)]" />
            {!collapsed && (
              <BrandLogo
                variant="wordmark"
                width={148}
                className="min-w-0 flex-shrink overflow-hidden rounded-[var(--ds-r-md)]"
                priority
              />
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--ds-r-md)] border border-[var(--ds-line-strong)] text-ink-3 transition-colors hover:bg-sapphire-200 hover:text-ink"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="sidebar-scroll flex-1 overflow-y-auto py-4">
        {!collapsed && <p className="sidebar-section-label">Main Functions</p>}
        <nav className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={onNavigate}
                title={item.title}
                className={`sidebar-nav-item flex items-center text-[15px] font-medium ${
                  collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
                } ${isActive ? "is-active" : "text-ink-2"}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="sidebar-nav-label flex flex-col leading-tight">
                    <span>{item.title}</span>
                    {item.subtitle && (
                      <span className={`text-xs font-medium ${isActive ? "text-sapphire-300" : "text-ink-4"}`}>
                        {item.subtitle}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={`mt-6 ${collapsed ? "px-1.5" : "px-2"}`}>
          <div className={`premium-nav-section ${collapsed ? "p-1" : "p-2"}`}>
            <div className="premium-nav-section-shimmer" aria-hidden />
            {!collapsed && (
              <p className="premium-nav-section-label relative z-[1] flex items-center gap-1.5 px-2.5 pb-2 pt-1.5 text-[13px] uppercase tracking-wider">
                <Sparkles className="premium-sparkle h-3.5 w-3.5" fill="currentColor" />
                Premium Tier
              </p>
            )}
            <nav className="relative z-[1] space-y-1">
              {PREMIUM_FEATURES.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    title={item.label}
                    style={{ animationDelay: `${0.15 + index * 0.06}s` }}
                    className={`premium-stagger-item premium-sidebar-item flex items-center text-[15px] font-medium ${
                      collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
                    } ${isActive ? "is-active" : ""}`}
                  >
                    <span className="premium-sidebar-icon-chip">
                      <Icon className="h-4 w-4" />
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {!collapsed && (
          <div className="exclusive-offers-nav-section mx-2 mt-6 p-2.5">
            <p className="exclusive-offers-nav-section-label">Exclusive Offers</p>
            <nav className="space-y-2">
              {exclusiveOffers.map((offer) => {
                const Icon = offer.icon
                return (
                  <a
                    key={offer.href}
                    href={offer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="exclusive-offers-nav-item px-3 py-2.5"
                  >
                    <span className="exclusive-offers-nav-play">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-ink">{offer.title}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--success)]">
                        {offer.cta}
                        <ExternalLink className="exclusive-offers-nav-external h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      <div className={`sidebar-footer space-y-2 p-4 ${collapsed ? "px-3" : ""}`}>
        <Link
          href="/support"
          onClick={onNavigate}
          title="Support"
          className={`sidebar-nav-item flex items-center text-[15px] font-medium ${
            collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
          } ${pathname === "/support" ? "is-active" : "text-ink-2"}`}
        >
          <Headphones className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="sidebar-nav-label">Support</span>}
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          title="Exit Platform"
          className={`sidebar-sign-out ${collapsed ? "px-0" : "gap-2"}`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Exit Platform</span>}
        </button>
      </div>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY) === "1"
    setCollapsed(saved)
    document.documentElement.dataset.sidebar = saved ? "collapsed" : "expanded"
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0")
      document.documentElement.dataset.sidebar = next ? "collapsed" : "expanded"
      return next
    })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      <aside
        className="app-sidebar fixed z-50 hidden flex-col transition-[width] duration-300 lg:flex"
        style={{ width: "var(--sidebar-w)" }}
      >
        <SidebarBody
          pathname={pathname}
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          onSignOut={handleSignOut}
        />
      </aside>

      <div
        className="mobile-header-glass fixed left-0 right-0 top-0 z-50 flex h-12 items-center gap-2 px-4 lg:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
          <BrandLogo variant="icon" size={32} className="flex-shrink-0 rounded-[var(--ds-r-md)]" />
          <BrandLogo variant="wordmark" width={120} className="overflow-hidden rounded-[var(--ds-r-sm)]" priority />
        </Link>
      </div>
    </>
  )
}
