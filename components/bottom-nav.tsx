"use client"

import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  Play,
  Menu,
  Gem,
  Sparkles,
  Zap,
  ShieldCheck,
  Upload,
  Headphones,
  LogOut,
  UserPlus,
  Wallet,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const tabs = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gold Rush", url: "/create", icon: Brain },
  { title: "Vault", url: "/pages", icon: FolderOpen },
  { title: "Academy", url: "/training", icon: Play },
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
    href: "https://jvz4.com/c/3547097/442443/",
    icon: UserPlus,
  },
  {
    title: "Watch this Free training",
    href: "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea",
    icon: Play,
  },
  {
    title: "Create you Cashapp Account",
    href: "https://jvz1.com/c/3547097/443257/",
    icon: Wallet,
  },
]

/** Fixed bottom tab bar for mobile. Hidden on desktop (lg+) where the sidebar lives. */
export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  // "More" is active when the current page isn't one of the 4 main tabs
  const moreActive = !tabs.some((t) => t.url === pathname)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#0ea5e9]/20 bg-[#020617]/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.url
          const Icon = tab.icon
          return (
            <Link
              key={tab.url}
              href={tab.url}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-[#0ea5e9]" : "text-[#7dd3fc]/60 active:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-[#0ea5e9] to-[#ec4899]" />
              )}
              <Icon className="h-6 w-6" />
              <span className="text-[11px] font-semibold leading-none">{tab.title}</span>
            </Link>
          )
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                moreActive ? "text-[#0ea5e9]" : "text-[#7dd3fc]/60 active:text-white"
              }`}
            >
              {moreActive && (
                <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-[#0ea5e9] to-[#ec4899]" />
              )}
              <Menu className="h-6 w-6" />
              <span className="text-[11px] font-semibold leading-none">More</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[#0ea5e9]/20 bg-[#020617] p-0"
          >
            <SheetTitle className="sr-only">More</SheetTitle>
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/15" />

            <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] space-y-6">
              {/* Your links */}
              <div>
                <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-widest text-[#0ea5e9]/60">
                  Main Functions
                </p>
                <Link
                  href="/share"
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-base font-semibold transition-colors ${
                    pathname === "/share"
                      ? "border-[#0ea5e9]/40 bg-gradient-to-r from-[#0ea5e9]/25 to-[#ec4899]/25 text-white"
                      : "border-transparent text-[#7dd3fc] active:bg-[#0ea5e9]/10"
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  Your links
                </Link>
              </div>

              {/* Premium */}
              <div>
                <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-widest text-[#fbbf24] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Tier
                </p>
                <div className="space-y-1.5">
                  {premiumItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.url
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-base font-semibold transition-colors ${
                          isActive
                            ? "border-[#fbbf24]/60 bg-gradient-to-r from-[#fbbf24]/30 to-[#f97316]/30 text-[#fbbf24]"
                            : "border-[#fbbf24]/25 text-[#fbbf24]/80 active:bg-[#fbbf24]/10"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Exclusive offers */}
              <div>
                <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-widest text-emerald-400">
                  Exclusive Offers
                </p>
                <div className="space-y-1.5">
                  {exclusiveOffers.map((offer) => {
                    const Icon = offer.icon
                    return (
                      <a
                        key={offer.href}
                        href={offer.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3.5 text-base font-semibold text-slate-200 active:bg-emerald-500/10"
                      >
                        <Icon className="h-5 w-5 text-emerald-400" />
                        <span className="flex-1">{offer.title}</span>
                        <ExternalLink className="h-4 w-4 text-emerald-400" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Support + sign out */}
              <div className="space-y-1.5 border-t border-[#0ea5e9]/20 pt-4">
                <Link
                  href="/support"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-[#7dd3fc] active:bg-[#0ea5e9]/10"
                >
                  <Headphones className="h-5 w-5" />
                  Support
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-[#7dd3fc] active:bg-[#0ea5e9]/10"
                >
                  <LogOut className="h-5 w-5" />
                  Exit Platform
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
