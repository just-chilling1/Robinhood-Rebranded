import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Crown, Zap, Rocket, ShieldCheck, FileText, BookOpen, Package } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { PREMIUM_FEATURE_LABELS, getUpgradeLevelLabel } from "@/lib/premium-features"

const upgrades = [
  {
    id: "dfy_vault",
    name: PREMIUM_FEATURE_LABELS.dfyVault,
    tagline: "Ready-made templates",
    icon: Crown,
    features: [
      "50+ Pre-Written Page Templates",
      "Swipe File of Top Performers",
      "Advanced SEO Training",
      "Priority Email Support",
      "Unlimited Page Generation",
      "Custom Branding Options",
    ],
    href: "/upgrades/dfy-vault",
  },
  {
    id: "instant_income",
    name: PREMIUM_FEATURE_LABELS.instantIncome,
    tagline: "Fast-Track Your Earnings",
    icon: Zap,
    features: [
      `Everything in ${PREMIUM_FEATURE_LABELS.dfyVault}`,
      "Paid Traffic Training",
      "FB Ads Masterclass",
      "Landing Page Builder",
      "Test what works best",
      "1-on-1 Strategy Call",
    ],
    href: "/upgrades/instant-income",
  },
  {
    id: "automated_income",
    name: PREMIUM_FEATURE_LABELS.automatedIncome,
    tagline: "Set It and Forget It",
    icon: Rocket,
    features: [
      `Everything in ${PREMIUM_FEATURE_LABELS.instantIncome}`,
      "Email Automation System",
      "Automatic follow-up emails",
      "Traffic Automation Tools",
      "Advanced Analytics Dashboard",
      "Lifetime Updates & Support",
    ],
    href: "/upgrades/automated-income",
  },
  {
    id: "protector",
    name: PREMIUM_FEATURE_LABELS.protector,
    tagline: "Account Security Overview",
    icon: ShieldCheck,
    features: [
      "Real-time security monitoring",
      "Encryption & session status",
      "Account verification dashboard",
      "Server & API health checks",
      "Recent activity timeline",
    ],
    href: "/upgrades/protector",
  },
  {
    id: "license_rights",
    name: PREMIUM_FEATURE_LABELS.licenseRights,
    tagline: "Resell under your brand",
    icon: FileText,
    features: [
      "Reseller license",
      "Rebrandable assets",
      "Sales pages",
      "Support docs",
      "Team activation via License Rights ticket",
    ],
    href: "/upgrades/license-rights",
  },
  {
    id: "high_ticket_payouts",
    name: PREMIUM_FEATURE_LABELS.highTicketPayouts,
    tagline: "100 authority articles",
    icon: BookOpen,
    features: [
      "100 long-form authority articles",
      "9 niches with SEO-ready templates",
      "Affiliate link woven into every preview",
      "Copy plain text or HTML for any platform",
      "Medium, LinkedIn, Quora & blog posting guides",
    ],
    href: "/upgrades/high-ticket-payouts",
  },
  {
    id: "dfy_profit",
    name: PREMIUM_FEATURE_LABELS.dfyProfit,
    tagline: "Your complete promo kit",
    icon: Package,
    features: [
      "5 Videos Ready To Comment On",
      "AI Comments For Every Video",
      "Hosted Authority Article",
      "3 Ready-To-Post Facebook Posts",
      "One Link, One Niche, One Click",
    ],
    href: "/upgrades/dfy-profit",
  },
]

export default async function UpgradesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Premium"
        title="Your Premium Content"
        subtitle="Access your exclusive training materials, templates, and tools"
      />

      {profile?.upgrade_level !== "free" && (
        <div className="rounded-2xl border border-[var(--ds-line)] bg-ink px-5 py-4 text-white sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Current plan</p>
          <p className="mt-1 text-lg font-semibold">
            {getUpgradeLevelLabel(profile?.upgrade_level)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {upgrades.map((upgrade) => {
          const Icon = upgrade.icon
          const isCurrentPlan = profile?.upgrade_level === upgrade.id

          return (
            <Card key={upgrade.id} className="flex flex-col border-[var(--ds-line)] bg-card">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-ink">{upgrade.name}</CardTitle>
                <p className="text-sm text-text-secondary">{upgrade.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="mb-6 flex-1 space-y-2.5">
                  {upgrade.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#147551]" />
                      <p className="text-sm leading-relaxed text-ink">{feature}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className="h-11 w-full bg-ink font-semibold text-white hover:bg-ink/90">
                  <Link href={upgrade.href}>{isCurrentPlan ? "Open this feature" : "View details"}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
