"use client"

import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  Upload,
  Play,
  LogOut,
  Gem,
  Sparkles,
  Zap,
  ShieldCheck,
  Headphones,
  UserPlus,
  ExternalLink,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const menuItems = [
  { title: "Dashboard", subtitle: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gold Rush", subtitle: "Make comments", url: "/create", icon: Brain },
  { title: "My Vault", subtitle: "Your saved comments", url: "/pages", icon: FolderOpen },
  { title: "Your links", subtitle: "Saved affiliate links", url: "/share", icon: Upload },
  { title: "Academy", subtitle: "Training videos", url: "/training", icon: Play },
]

const premiumItems = [
  { title: "Accelerator", url: "/upgrades/dfy-vault", icon: Gem },
  { title: "Recurring Streams", url: "/upgrades/instant-income", icon: Sparkles },
  { title: "Social Payouts", url: "/upgrades/automated-income", icon: Zap },
  { title: "Protector", url: "/upgrades/protector", icon: ShieldCheck },
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

function SidebarBody({
  pathname,
  onNavigate,
  onSignOut,
}: {
  pathname: string
  onNavigate?: () => void
  onSignOut: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]">
      {/* Header - Brain Logo */}
      <div className="p-4 border-b border-[#0ea5e9]/20">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
        >
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9] via-[#ec4899] to-[#06b6d4] flex items-center justify-center shadow-[0_0_40px_rgba(14,165,233,0.5)] group-hover:shadow-[0_0_60px_rgba(14,165,233,0.7)] transition-shadow duration-300">
            <div className="w-8 h-8 rounded-md bg-[#020617] flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#0ea5e9]" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Robinhood</h2>
            <p className="text-[13px] text-[#7dd3fc] font-medium">Your comment helper</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 py-4 overflow-y-auto">
        <p className="text-[13px] font-semibold text-[#0ea5e9]/60 px-4 mb-2 uppercase tracking-widest">Main Functions</p>
        <nav className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#0ea5e9]/25 to-[#ec4899]/25 text-white border border-[#0ea5e9]/40 shadow-md shadow-[#0ea5e9]/20"
                    : "text-[#7dd3fc] hover:bg-[#0ea5e9]/10 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex flex-col leading-tight">
                  <span>{item.title}</span>
                  {item.subtitle && (
                    <span className="text-xs font-medium text-[#7dd3fc]/70">{item.subtitle}</span>
                  )}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Premium Features */}
        <div className="mt-6">
          <div className="mx-4 mb-3 p-2 rounded-lg bg-gradient-to-r from-[#fbbf24]/20 to-[#f97316]/20 border border-[#fbbf24]/30">
            <p className="text-[13px] font-semibold text-[#fbbf24] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Tier
            </p>
          </div>
          <nav className="space-y-0.5 px-2">
            {premiumItems.map((item) => {
              const isActive = pathname === item.url
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-base font-semibold transition-all duration-200 border ${
                    isActive
                      ? "bg-gradient-to-r from-[#fbbf24]/30 to-[#f97316]/30 border-[#fbbf24]/60 text-[#fbbf24] shadow-md shadow-[#fbbf24]/30"
                      : "border-[#fbbf24]/25 text-[#fbbf24]/80 hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 hover:text-[#fbbf24]"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Exclusive Offers */}
        <div className="mt-6">
          <div className="mx-4 mb-3 p-2 rounded-lg bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30">
            <p className="text-[13px] font-semibold text-emerald-400 uppercase tracking-widest">
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
                    <Icon className="mt-0.5 w-5 h-5 flex-shrink-0 text-emerald-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-slate-200">{offer.title}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-bold text-emerald-400">
                        {offer.cta}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#0ea5e9]/20 space-y-1">
        <Link
          href="/support"
          onClick={onNavigate}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-base font-semibold transition-all duration-200 border ${
            pathname === "/support"
              ? "bg-gradient-to-r from-[#06b6d4]/25 to-[#0ea5e9]/25 text-white border-[#06b6d4]/40 shadow-md shadow-[#06b6d4]/20"
              : "text-[#7dd3fc] hover:bg-[#0ea5e9]/10 hover:text-white border-transparent"
          }`}
        >
          <Headphones className="w-5 h-5 flex-shrink-0" />
          <span>Support</span>
        </Link>
        <button
          onClick={onSignOut}
          className="w-full h-10 text-base font-semibold text-[#7dd3fc] bg-transparent border border-[#0ea5e9]/20 rounded-lg hover:border-[#0ea5e9]/50 hover:text-white hover:bg-[#0ea5e9]/5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Exit Platform
        </button>
      </div>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 border-r border-[#0ea5e9]/20 flex-col z-50">
        <SidebarBody pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Slim mobile top bar — navigation lives in the bottom tab bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-2 h-12 px-4 border-b border-[#0ea5e9]/20 bg-[#020617]/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] via-[#ec4899] to-[#06b6d4] flex items-center justify-center">
            <div className="w-6 h-6 rounded-md bg-[#020617] flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#0ea5e9]" />
            </div>
          </div>
          <span className="text-base font-bold text-white tracking-tight">Robinhood</span>
        </Link>
      </div>
    </>
  )
}
