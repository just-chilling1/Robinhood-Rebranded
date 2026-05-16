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
} from "lucide-react"

interface ProtectorContentProps {
  email: string
}

const securityChecks = [
  {
    icon: ShieldCheck,
    title: "Account Verified",
    description: "Your identity has been confirmed and credentials validated",
  },
  {
    icon: Lock,
    title: "Secure Connection",
    description: "Your connection is encrypted with TLS 1.3 protocols",
  },
  {
    icon: Key,
    title: "Session Protected",
    description: "Your session is authenticated with secure token management",
  },
  {
    icon: Shield,
    title: "Data Encryption",
    description: "All personal data is encrypted at rest and in transit",
  },
  {
    icon: Server,
    title: "Server Status",
    description: "All Robinhood servers are online and operational",
  },
  {
    icon: Globe,
    title: "API Connectivity",
    description: "All external API traffic links are stable",
  },
]

const recentActivity = [
  { icon: CheckCircle2, label: "Successful login", time: "Just now" },
  { icon: Activity, label: "Session renewed", time: "2 minutes ago" },
  { icon: ShieldCheck, label: "Security scan completed", time: "15 minutes ago" },
  { icon: Lock, label: "SSL certificate verified", time: "1 hour ago" },
  { icon: Server, label: "System health check passed", time: "3 h" },
]

export function ProtectorContent({ email }: ProtectorContentProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1f2e] border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-[#22c55e]" />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">Protector</h1>
            <p className="text-[#94a3b8] text-base max-w-xl">
              Your account security overview. Everything is monitored in real time.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/40 self-start">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[#22c55e] text-xs font-bold uppercase tracking-wider">
            All Systems Secure
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Security Score", value: "100%", valueClass: "text-[#22c55e]" },
          { label: "Account Status", value: "Verified", valueClass: "text-[#22c55e] italic" },
          { label: "Encryption", value: "AES-256", valueClass: "text-[#a855f7]" },
          { label: "Uptime", value: "99.9%", valueClass: "text-[#22c55e]" },
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
                  <span className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#22c55e]/50 text-[#22c55e] text-[10px] font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
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
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Email</p>
                  <p className="text-white text-sm font-medium truncate">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Membership</p>
                  <p className="text-[#22c55e] text-sm font-bold">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">2FA</p>
                  <p className="text-[#22c55e] text-sm font-bold">Enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Last Login</p>
                  <p className="text-white text-sm font-medium">Today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#131820] border border-white/5 p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((event) => {
                const Icon = event.icon
                return (
                  <div key={event.label} className="flex items-start gap-3">
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
