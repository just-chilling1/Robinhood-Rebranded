"use client"

import { useState } from "react"
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
  Play,
  Youtube,
} from "lucide-react"
import type { ProtectorViewModel } from "@/lib/protector/build-protector-data"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VideoOverlay } from "@/components/video-overlay"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"

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
        ? `${name} is verified on RH with validated sign-in credentials`
        : "Complete email verification to fully secure your RH account",
    },
    {
      icon: Lock,
      title: "Secure Connection",
      description: "Your RH session uses a private, encrypted connection",
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
      description: "RH Command Center, Gold Rush, and Premium Tier are operational",
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const protectorVideoId = getPremiumTrainingVimeoId("protector")

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        eyebrow="Security"
        title="Protector"
        subtitle={
          <>
            Your RH account security overview. Live status for{" "}
            {account.fullName ? account.fullName : account.email}.
          </>
        }
        actions={
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/40">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#22c55e] text-xs font-bold uppercase tracking-wider">
              All Systems Secure
            </span>
          </div>
        }
      />

      <Card className="glass-strong border-2 border-[#22c55e]/40 overflow-hidden">
        <div className="p-6 border-b-2 border-[#22c55e]/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e]/30 to-[#06b6d4]/30 flex items-center justify-center border-2 border-[#22c55e]/40">
              <Youtube className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Protector Training</h2>
              <p className="text-[#7dd3fc] font-semibold">
                Watch this to understand how Protector keeps your account secure
              </p>
            </div>
          </div>
        </div>

        <div className="relative aspect-video bg-black">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0d0a1a] to-[#1a1429]">
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/thumbnails/thumb-09-protector.webp?v=20260730a"
                alt="Protector Training thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 thumb-scrim" />
            <Button
              size="lg"
              onClick={() => setIsVideoPlaying(true)}
              className="relative z-10 h-28 w-28 rounded-full bg-gradient-to-br from-[#22c55e] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#22c55e] text-white shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white/20"
            >
              <Play className="w-14 h-14 ml-1 fill-white" />
            </Button>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-xl font-extrabold drop-shadow-lg">▶ Click to Play Training</p>
            </div>
          </div>
        </div>
      </Card>

      {isVideoPlaying && (
        <VideoOverlay
          videoUrl={`https://player.vimeo.com/video/${protectorVideoId}`}
          title="Protector Training"
          onClose={() => setIsVideoPlaying(false)}
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Protection",
            value: isEmailVerified ? "Strong" : "Good",
            valueClass: "text-[#22c55e]",
          },
          {
            label: "Account Status",
            value: accountStatus,
            valueClass: isEmailVerified ? "text-[#22c55e] italic" : "text-[#fbbf24] italic",
          },
          { label: "Security", value: "Bank-level", valueClass: "text-[#a855f7]" },
          { label: "Availability", value: "Always On", valueClass: "text-[#22c55e]" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl bg-[#131820] border border-white/5 p-5"
          >
            <p className="text-[10px] font-bold text-[#a855f7]/80 uppercase tracking-widest mb-2">
              {metric.label}
            </p>
            <p className={`text-3xl lg:text-4xl font-black ${metric.valueClass}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-[#131820] border border-white/5 p-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
            Security Checks
          </h2>
          <div className="space-y-3">
            {securityChecks.map((check) => {
              const Icon = check.icon
              const verified = check.title !== "Account Verified" || isEmailVerified
              return (
                <div
                  key={check.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1117] border border-white/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{check.title}</p>
                    <p className="text-[#64748b] text-xs mt-0.5 leading-relaxed">
                      {check.description}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${
                      verified
                        ? "border-[#22c55e]/50 text-[#22c55e]"
                        : "border-[#fbbf24]/50 text-[#fbbf24]"
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
          <div className="rounded-2xl bg-[#131820] border border-white/5 p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
              Account Info
            </h2>
            <div className="space-y-4">
              {account.fullName && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Name</p>
                    <p className="text-white text-sm font-medium truncate">{account.fullName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Email</p>
                  <p className="text-white text-sm font-medium truncate">{account.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gem className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">
                    Premium Tier
                  </p>
                  <p className="text-[#22c55e] text-sm font-bold">{account.premiumTier}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Membership</p>
                  <p className="text-[#22c55e] text-sm font-bold">{account.membership}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Auth</p>
                  <p
                    className={`text-sm font-bold ${isEmailVerified ? "text-[#22c55e]" : "text-[#fbbf24]"}`}
                  >
                    {account.authProtection}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Last Login</p>
                  <p className="text-white text-sm font-medium">{account.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Member Since</p>
                  <p className="text-white text-sm font-medium">{account.memberSince}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Account ID</p>
                  <p className="text-white text-sm font-mono font-medium">{account.accountId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">
                    Comment Packs
                  </p>
                  <p className="text-white text-sm font-medium">
                    {account.pagesGenerated} generated
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#131820] border border-white/5 p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((event) => {
                const Icon = activityIcons[event.id as keyof typeof activityIcons] ?? Activity
                return (
                  <div key={event.id} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{event.label}</p>
                      <p className="text-[#64748b] text-xs">{event.time}</p>
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
