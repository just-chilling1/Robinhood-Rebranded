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
import { createClient } from "@/lib/supabase/client"
import { PREMIUM_FEATURES } from "@/lib/premium-features"

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
    title: "Create you Cashapp Account",
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
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0a1224] via-[#0f172a] to-[#0a1224]">
      <div className={`border-b border-[#0ea5e9]/20 ${collapsed ? "px-3 py-4" : "p-4"}`}>
        <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-2"}`}>
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={`flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90 group ${
              collapsed ? "justify-center" : ""
            }`}
            title="RH"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0ea5e9] via-[#ec4899] to-[#06b6d4] shadow-[0_0_40px_rgba(14,165,233,0.5)] transition-shadow duration-300 group-hover:shadow-[0_0_60px_rgba(14,165,233,0.7)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#020617]">
                <Brain className="h-5 w-5 text-[#0ea5e9]" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="whitespace-nowrap text-lg font-bold tracking-tight text-white">RH</h2>
                <p className="whitespace-nowrap text-[13px] font-medium text-[#7dd3fc]">Your comment helper</p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#0ea5e9]/20 text-[#7dd3fc] transition-colors hover:bg-[#0ea5e9]/10 hover:text-white"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="sidebar-scroll flex-1 overflow-y-auto py-4">
        {!collapsed && (
          <p className="mb-2 px-4 text-[13px] font-semibold uppercase tracking-widest text-[#0ea5e9]/60">
            Main Functions
          </p>
        )}
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
                className={`flex items-center rounded-lg text-base font-semibold transition-all duration-200 ${
                  collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isActive
                    ? "border border-[#0ea5e9]/40 bg-gradient-to-r from-[#0ea5e9]/25 to-[#ec4899]/25 text-white shadow-md shadow-[#0ea5e9]/20"
                    : "border border-transparent text-[#7dd3fc] hover:bg-[#0ea5e9]/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="flex flex-col leading-tight">
                    <span>{item.title}</span>
                    {item.subtitle && (
                      <span className="text-xs font-medium text-[#7dd3fc]/70">{item.subtitle}</span>
                    )}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={`mt-6 ${collapsed ? "px-1.5" : "px-2"}`}>
          <div className={`premium-nav-section ${collapsed ? "p-1" : "p-2"}`}>
            {!collapsed && (
              <p className="flex items-center gap-1.5 px-2.5 pb-2 pt-1.5 text-[13px] font-semibold uppercase tracking-widest text-[#0ea5e9]">
                <Sparkles className="premium-sparkle h-3.5 w-3.5" fill="currentColor" />
                Premium Tier
              </p>
            )}
            <nav className="space-y-1">
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
                    className={`premium-stagger-item premium-sidebar-item flex items-center rounded-lg text-base font-semibold ${
                      collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
                    } ${isActive ? "is-active" : "text-[#7dd3fc]"}`}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-[#0ea5e9]" : "text-[#0ea5e9]/80"}`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && isActive && (
                      <span
                        className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0ea5e9]"
                        style={{ boxShadow: "0 0 10px rgba(14, 165, 233, 0.7)" }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {!collapsed && (
          <div className="mt-6">
            <div className="mx-4 mb-3 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 p-2">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-emerald-400">
                Exclusive Offers
              </p>
            </div>
            <nav className="space-y-2 px-2">
              {exclusiveOffers.map((offer) => {
                const Icon = offer.icon
                return (
                  <a
                    key={offer.href}
                    href={offer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-500/10"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug text-slate-200">{offer.title}</p>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-bold text-emerald-400">
                          {offer.cta}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="space-y-1 border-t border-[#0ea5e9]/20 p-3">
        <Link
          href="/support"
          onClick={onNavigate}
          title="Support"
          className={`flex items-center rounded-lg border text-base font-semibold transition-all duration-200 ${
            collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
          } ${
            pathname === "/support"
              ? "border-[#06b6d4]/40 bg-gradient-to-r from-[#06b6d4]/25 to-[#0ea5e9]/25 text-white shadow-md shadow-[#06b6d4]/20"
              : "border-transparent text-[#7dd3fc] hover:bg-[#0ea5e9]/10 hover:text-white"
          }`}
        >
          <Headphones className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Support</span>}
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          title="Exit Platform"
          className={`flex h-10 w-full items-center justify-center rounded-lg border border-[#0ea5e9]/20 bg-transparent text-base font-semibold text-[#7dd3fc] transition-all duration-200 hover:border-[#0ea5e9]/50 hover:bg-[#0ea5e9]/5 hover:text-white ${
            collapsed ? "px-0" : "gap-2"
          }`}
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
        className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center gap-2 border-b border-[#0ea5e9]/20 bg-[#0a1224]/95 px-4 backdrop-blur lg:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
          <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0ea5e9] via-[#ec4899] to-[#06b6d4]">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#020617]">
              <Brain className="h-4 w-4 text-[#0ea5e9]" />
            </div>
          </div>
          <span className="whitespace-nowrap text-base font-bold tracking-tight text-white">RH</span>
        </Link>
      </div>
    </>
  )
}
