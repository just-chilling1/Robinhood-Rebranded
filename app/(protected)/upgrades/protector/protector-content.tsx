"use client"

import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Calendar,
  CheckCircle2,
  FileText,
  Fingerprint,
  Gem,
  Globe,
  Key,
  Lock,
  Mail,
  Server,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import type { ProtectorViewModel } from "@/lib/protector/build-protector-data"
import { cn } from "@/lib/utils"

interface ProtectorContentProps {
  data: ProtectorViewModel
}

const SUCCESS = "#147551"
const SUCCESS_BG = "#DDF7EC"
const WARNING = "#7A4F0C"
const WARNING_BG = "#FFF3D6"

const PROTECTION_LAYERS = [
  {
    num: "1",
    title: "Verified identity",
    desc: "Sign-in credentials and email status are checked on every session.",
  },
  {
    num: "2",
    title: "Encrypted session",
    desc: "Your connection stays private while you work inside the command center.",
  },
  {
    num: "3",
    title: "Live monitoring",
    desc: "Account, platform, and API health stay visible on this page.",
  },
] as const

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

function StatusChip({
  ok,
  okLabel,
  pendingLabel,
}: {
  ok: boolean
  okLabel: string
  pendingLabel: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
        ok
          ? "border-transparent text-white"
          : "border-[#F5D998] text-[#7A4F0C]",
      )}
      style={{ backgroundColor: ok ? SUCCESS : WARNING_BG }}
    >
      <CheckCircle2 className="h-3 w-3" aria-hidden />
      {ok ? okLabel : pendingLabel}
    </span>
  )
}

function AccountRow({
  icon: Icon,
  label,
  value,
  tone = "ink",
}: {
  icon: LucideIcon
  label: string
  value: string
  tone?: "ink" | "success" | "warning"
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--ds-line)] bg-surface-nested/60 px-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <p
          className={cn(
            "truncate text-sm font-semibold",
            tone === "success" && "text-[#147551]",
            tone === "warning" && "text-[#7A4F0C]",
            tone === "ink" && "text-ink",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export function ProtectorContent({ data }: ProtectorContentProps) {
  const { account, activities, accountStatus, isEmailVerified } = data
  const securityChecks = getSecurityChecks(data)
  const protectorVideoId = getPremiumTrainingVimeoId("protector")
  const displayName = account.fullName || account.email

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Security"
        title={PREMIUM_FEATURE_LABELS.protector}
        subtitle={
          <>
            Your {PRODUCT_NAME} account security overview. Live status for {displayName}.
          </>
        }
        actions={
          isEmailVerified ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#147551] px-4 py-2.5 text-white shadow-[0_4px_14px_-6px_rgba(20,117,81,0.45)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span className="text-xs font-bold uppercase tracking-wider">All systems secure</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5D998] bg-[#FFF3D6] px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#7A4F0C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A4F0C]">
                Verification pending
              </span>
            </div>
          )
        }
      />

      <PremiumVideoTutorial
        premiumKey="protector"
        vimeoId={protectorVideoId}
        title={`${PREMIUM_FEATURE_LABELS.protector} Training`}
        description={`Watch this to understand how ${PREMIUM_FEATURE_LABELS.protector} keeps your ${PRODUCT_NAME} account and activity secure.`}
        iframeTitle={`${PREMIUM_FEATURE_LABELS.protector} training video`}
      />

      <section className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-card shadow-[var(--ds-shadow-card)]">
        <div className="flex flex-col lg:flex-row">
          <div className="flex items-center gap-4 bg-ink px-5 py-5 text-white sm:px-6 lg:w-[240px] lg:flex-col lg:items-start lg:justify-center lg:py-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-ink">
              <ShieldCheck size={22} aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                Live monitoring
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug text-white">
                {isEmailVerified ? "Protected account" : "Finish verification"}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-ink">Account security desk</p>
              <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
                {PRODUCT_NAME} watches sign-in, session, and platform health for {displayName}. This
                page is the live readout — nothing here is a scan you have to run.
              </p>
            </div>
            <span
              className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold text-white sm:self-center"
              style={{ backgroundColor: isEmailVerified ? SUCCESS : WARNING }}
            >
              <Shield size={13} aria-hidden />
              {isEmailVerified ? "Email verified" : "Verify email"}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="page-eyebrow mb-2">Coverage</p>
          <h2 className="text-xl font-medium text-ink">What stays protected</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PROTECTION_LAYERS.map((layer) => (
            <div
              key={layer.num}
              className="rounded-xl border border-[var(--ds-line)] bg-card p-5 sm:p-6"
            >
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                {layer.num}
              </span>
              <h3 className="text-base font-semibold text-ink">{layer.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{layer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Protection",
            value: isEmailVerified ? "Strong" : "Good",
            ok: true,
          },
          {
            label: "Account status",
            value: accountStatus,
            ok: isEmailVerified,
          },
          { label: "Security", value: "Bank-level", ok: true },
          { label: "Availability", value: "Always on", ok: true },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-[var(--ds-line)] bg-card p-5"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {metric.label}
            </p>
            <p
              className="text-2xl font-semibold lg:text-3xl"
              style={{ color: metric.ok ? SUCCESS : WARNING }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--ds-line)] bg-card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
              <ShieldCheck size={18} aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Security checks</h2>
              <p className="text-sm text-text-secondary">Live status for this session</p>
            </div>
          </div>
          <div className="space-y-3">
            {securityChecks.map((check) => {
              const Icon = check.icon
              const verified = check.title !== "Account Verified" || isEmailVerified
              return (
                <div
                  key={check.title}
                  className="flex items-center gap-4 rounded-xl border border-[var(--ds-line)] bg-card p-4"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: verified ? SUCCESS_BG : WARNING_BG,
                      color: verified ? SUCCESS : WARNING,
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{check.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {check.description}
                    </p>
                  </div>
                  <StatusChip ok={verified} okLabel="Verified" pendingLabel="Pending" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--ds-line)] bg-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                <User size={18} aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">Account info</h2>
                <p className="text-sm text-text-secondary">Who this session belongs to</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {account.fullName ? (
                <AccountRow icon={User} label="Name" value={account.fullName} />
              ) : null}
              <AccountRow icon={Mail} label="Email" value={account.email} />
              <AccountRow icon={Gem} label="Premium tier" value={account.premiumTier} tone="success" />
              <AccountRow icon={Shield} label="Membership" value={account.membership} tone="success" />
              <AccountRow
                icon={Lock}
                label="Auth"
                value={account.authProtection}
                tone={isEmailVerified ? "success" : "warning"}
              />
              <AccountRow icon={Calendar} label="Last login" value={account.lastLogin} />
              <AccountRow icon={Calendar} label="Member since" value={account.memberSince} />
              <AccountRow icon={Fingerprint} label="Account ID" value={account.accountId} />
              <AccountRow
                icon={FileText}
                label="Comment packs"
                value={`${account.pagesGenerated} generated`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--ds-line)] bg-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                <Activity size={18} aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">Recent activity</h2>
                <p className="text-sm text-text-secondary">Latest account events</p>
              </div>
            </div>
            <div className="space-y-3">
              {activities.map((event) => {
                const Icon = activityIcons[event.id as keyof typeof activityIcons] ?? Activity
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 rounded-xl border border-[var(--ds-line)] px-3 py-3"
                  >
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: SUCCESS_BG, color: SUCCESS }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{event.label}</p>
                      <p className="text-xs text-text-secondary">{event.time}</p>
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
