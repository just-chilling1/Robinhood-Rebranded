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
    color: "cyan",
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
    color: "violet",
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
    color: "jade",
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
    color: "jade",
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
    color: "cyan",
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
    color: "violet",
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
    color: "cyan",
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
        <Card className="glass-strong glow-jade border-border">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-bold text-[#1E40AF]">
              Current Plan:{" "}
              {getUpgradeLevelLabel(profile?.upgrade_level)}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {upgrades.map((upgrade) => {
          const Icon = upgrade.icon
          const isCurrentPlan = profile?.upgrade_level === upgrade.id
          const glowClass =
            upgrade.color === "cyan" ? "glow-cyan" : upgrade.color === "violet" ? "glow-blue" : "glow-jade"

          return (
            <Card key={upgrade.id} className={`glass-strong border-border ${glowClass} flex flex-col`}>
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#EEF4FF] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-[#1E40AF]" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground mb-2">{upgrade.name}</CardTitle>
                <p className="text-base text-muted-foreground">{upgrade.tagline}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-8 flex-1">
                  {upgrade.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#16875C] flex-shrink-0 mt-0.5" />
                      <p className="text-base text-foreground leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className={`w-full h-14 text-lg font-bold ${glowClass}`}>
                  <Link href={upgrade.href}>{isCurrentPlan ? "Access Your Content" : "View Details"}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
