"use client"

import {
  ShieldCheck,
  Lock,
  Key,
  Shield,
  Server,
  Globe,
  Mail,
  User,
  Calendar,
  Activity,
  CheckCircle2,
  Gem,
  Fingerprint,
  FileText,
} from "lucide-react"
import type { ProtectorViewModel } from "@/lib/protector/build-protector-data"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { PRODUCT_NAME } from "@/lib/brand"

interface ProtectorContentProps {
  data: ProtectorViewModel
}

function getSecurityChecks(data: ProtectorViewModel) {
  const name = data.account.fullName || "your account"
  return [
    {
      icon: ShieldCheck,
      title: "Account Verified",
      description: data.isEmailVerified
        ? `${name} is verified on ${PRODUCT_NAME} with validated sign-in credentials`
        : `Complete email verification to fully secure your ${PRODUCT_NAME} account`,
    },
    {
      icon: Lock,
      title: "Secure Connection",
      description: `Your ${PRODUCT_NAME} session uses a private, encrypted connection`,
    },
    {
      icon: Key,
      title: "Session Protected",
      description: `Authenticated Supabase session for account ${data.account.accountId}`,
    },
    {
      icon: Shield,
      title: "Data Encryption",
      description: "Profile, comment packs, and vault data are encrypted in transit",
    },
    {
      icon: Server,
      title: "Platform Status",
      description: `${PRODUCT_NAME} Command Center, Gold Rush, and Premium Tier are operational`,
    },
    {
      icon: Globe,
      title: "API Connectivity",
      description: "Shorts discovery and comment generation APIs are responding normally",
    },
  ]
}

const activityIcons = {
  login: CheckCircle2,
  session: Activity,
  onboarding: ShieldCheck,
  premium: Gem,
  created: Server,
} as const

export function ProtectorContent({ data }: ProtectorContentProps) {
  const { account, activities, accountStatus, isEmailVerified } = data
  const securityChecks = getSecurityChecks(data)
  const protectorVideoId = getPremiumTrainingVimeoId("protector")

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        eyebrow="Security"
        title={PREMIUM_FEATURE_LABELS.protector}
        subtitle={
          <>
            Your {PRODUCT_NAME} account security overview. Live status for{" "}
            {account.fullName ? account.fullName : account.email}.
          </>
        }
        actions={
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16875C]/10 border border-[#16875C]/40">
            <span className="w-2 h-2 rounded-full bg-[#16875C] animate-pulse" />
            <span className="text-[#16875C] text-xs font-bold uppercase tracking-wider">
              All Systems Secure
            </span>
          </div>
        }
      />

      <PremiumVideoTutorial
        vimeoId={protectorVideoId}
        title={`${PREMIUM_FEATURE_LABELS.protector} Training`}
        description={`Watch this to understand how ${PREMIUM_FEATURE_LABELS.protector} keeps your ${PRODUCT_NAME} account and activity secure.`}
        iframeTitle={`${PREMIUM_FEATURE_LABELS.protector} training video`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Protection",
            value: isEmailVerified ? "Strong" : "Good",
            valueClass: "text-[#16875C]",
          },
          {
            label: "Account Status",
            value: accountStatus,
            valueClass: isEmailVerified ? "text-[#16875C] italic" : "text-[#B7791F] italic",
          },
          { label: "Security", value: "Bank-level", valueClass: "text-[#2563EB]" },
          { label: "Availability", value: "Always On", valueClass: "text-[#16875C]" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl bg-card border border-[var(--border)] p-5"
          >
            <p className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-widest mb-2">
              {metric.label}
            </p>
            <p className={`text-3xl lg:text-4xl font-black ${metric.valueClass}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-[var(--border)] p-6">
          <h2 className="text-sm font-bold text-[#486581] uppercase tracking-widest mb-5">
            Security Checks
          </h2>
          <div className="space-y-3">
            {securityChecks.map((check) => {
              const Icon = check.icon
              const verified = check.title !== "Account Verified" || isEmailVerified
              return (
                <div
                  key={check.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-[var(--border)] shadow-[var(--shadow-sm)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DDF7EC] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#16875C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#102A43] font-bold text-sm">{check.title}</p>
                    <p className="text-[#486581] text-xs mt-0.5 leading-relaxed">
                      {check.description}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${
                      verified
                        ? "bg-[#DDF7EC] border-[#DDF7EC] text-[#16875C]"
                        : "bg-[#FFF3D6] border-[#FFF3D6] text-[#B7791F]"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {verified ? "Verified" : "Pending"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-[var(--border)] p-6">
            <h2 className="text-sm font-bold text-[#486581] uppercase tracking-widest mb-5">
              Account Info
            </h2>
            <div className="space-y-4">
              {account.fullName && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#486581] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#486581] uppercase tracking-wider">Name</p>
                    <p className="text-[#102A43] text-sm font-medium truncate">{account.fullName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">Email</p>
                  <p className="text-[#102A43] text-sm font-medium truncate">{account.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gem className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">
                    Premium Tier
                  </p>
                  <p className="text-[#16875C] text-sm font-bold">{account.premiumTier}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">Membership</p>
                  <p className="text-[#16875C] text-sm font-bold">{account.membership}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">Auth</p>
                  <p
                    className={`text-sm font-bold ${isEmailVerified ? "text-[#16875C]" : "text-[#B7791F]"}`}
                  >
                    {account.authProtection}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">Last Login</p>
                  <p className="text-[#102A43] text-sm font-medium">{account.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">Member Since</p>
                  <p className="text-[#102A43] text-sm font-medium">{account.memberSince}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">Account ID</p>
                  <p className="text-[#102A43] text-sm font-mono font-medium">{account.accountId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#486581] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#486581] uppercase tracking-wider">
                    Comment Packs
                  </p>
                  <p className="text-[#102A43] text-sm font-medium">
                    {account.pagesGenerated} generated
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-[var(--border)] p-6">
            <h2 className="text-sm font-bold text-[#486581] uppercase tracking-widest mb-5">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((event) => {
                const Icon = activityIcons[event.id as keyof typeof activityIcons] ?? Activity
                return (
                  <div key={event.id} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#16875C] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#102A43] text-sm font-medium">{event.label}</p>
                      <p className="text-[#486581] text-xs">{event.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
