"use client"

import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  Play,
  Menu,
  Sparkles,
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
import { PREMIUM_FEATURES } from "@/lib/premium-features"

const tabs = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gold Rush", url: "/create", icon: Brain },
  { title: "Vault", url: "/pages", icon: FolderOpen },
  { title: "Academy", url: "/training", icon: Play },
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
    title: "Create your Cashapp Account",
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

  const moreActive = !tabs.some((t) => t.url === pathname)

  return (
    <nav
      className="app-bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-50"
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
                isActive ? "text-sapphire-700" : "text-ink-3 hover:bg-surface-hover hover:text-ink active:text-ink"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-grad-sapphire" />
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
                moreActive ? "text-sapphire-700" : "text-ink-3 hover:bg-surface-hover hover:text-ink active:text-ink"
              }`}
            >
              {moreActive && (
                <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-grad-sapphire" />
              )}
              <Menu className="h-6 w-6" />
              <span className="text-[11px] font-semibold leading-none">More</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[var(--ds-line)] bg-card p-0"
          >
            <SheetTitle className="sr-only">More</SheetTitle>
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-sapphire-300" />

            <div className="space-y-6 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
              <div>
                <p className="sidebar-section-label !px-1 !pt-0">Main Functions</p>
                <Link
                  href="/share"
                  onClick={() => setMoreOpen(false)}
                  className={`sidebar-nav-item flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium ${
                    pathname === "/share" ? "is-active" : "text-ink-2"
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  Your links
                </Link>
              </div>

              <div className="premium-nav-section p-2">
                <div className="premium-nav-section-shimmer" aria-hidden />
                <p className="premium-nav-section-label relative z-[1] flex items-center gap-1.5 px-2 pb-2 pt-1 text-[13px] uppercase tracking-wider">
                  <Sparkles className="premium-sparkle h-3.5 w-3.5" fill="currentColor" />
                  Premium Tier
                </p>
                <div className="relative z-[1] space-y-1.5">
                  {PREMIUM_FEATURES.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                        className={`premium-stagger-item premium-sidebar-item flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium ${
                          isActive ? "is-active" : ""
                        }`}
                      >
                        <span className="premium-sidebar-icon-chip">
                          <Icon className="h-4 w-4" />
                        </span>
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="exclusive-offers-nav-section p-3">
                <p className="exclusive-offers-nav-section-label">Exclusive Offers</p>
                <div className="space-y-2">
                  {exclusiveOffers.map((offer) => {
                    const Icon = offer.icon
                    return (
                      <a
                        key={offer.href}
                        href={offer.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exclusive-offers-nav-item px-4 py-3.5 text-[15px] font-medium"
                      >
                        <span className="exclusive-offers-nav-play">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1">{offer.title}</span>
                        <ExternalLink className="exclusive-offers-nav-external h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-[var(--ds-line)] pt-4">
                <Link
                  href="/support"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-[var(--ds-r-md)] px-4 py-3.5 text-[15px] font-medium text-ink-2 hover:bg-[rgba(15,23,42,0.04)]"
                >
                  <Headphones className="h-5 w-5" />
                  Support
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="sidebar-sign-out gap-3 px-4 py-3.5"
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
