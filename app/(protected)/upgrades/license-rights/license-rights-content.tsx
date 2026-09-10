"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  LayoutTemplate,
  Loader2,
  Lock,
  Mail,
  Palette,
  Scale,
  Send,
  Sparkles,
  Tag,
  Unlock,
} from "lucide-react"
import {
  PremiumControlCard,
  PremiumFeatureBanner,
  PremiumSteps,
} from "@/components/premium-feature-chrome"
import { PremiumErrorAlert, PremiumPageLayout } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { SUPPORT_EMAIL } from "@/lib/support"
import {
  EDITION_CONTENTS,
  type EditionContent,
  type EditionIconId,
} from "@/lib/license-rights/edition-contents"
import {
  DEFAULT_REQUEST_MESSAGE,
  REQUEST_SUBJECT,
  clearPendingRequest,
  readPendingRequest,
  savePendingRequest,
  submitLicenseRightsRequest,
  type PendingLicenseRightsRequest,
} from "@/lib/license-rights/request"
import { cn } from "@/lib/utils"

const ACTIVATION_STEPS = [
  {
    num: "1",
    title: "Send your request",
    desc: "Tell support you purchased this edition. Your ticket is filed as License Rights.",
  },
  {
    num: "2",
    title: "Team reviews it",
    desc: "We verify the purchase on your account. Typical reply is 2 hours, up to 48.",
  },
  {
    num: "3",
    title: "License unlocks",
    desc: "The reseller edition is activated on your account and the assets below open.",
  },
] as const

type FormState = "idle" | "submitting" | "error"

const fieldClassName =
  "w-full min-w-0 rounded-xl border-[1.5px] border-[var(--border-strong)] bg-card px-3.5 py-3 text-sm leading-normal text-foreground placeholder:text-muted-foreground hover:border-[var(--ds-sapphire-300)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:bg-surface-nested disabled:text-[var(--text-disabled)]"

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary"

const EDITION_ICONS: Record<EditionIconId, typeof Scale> = {
  scale: Scale,
  palette: Palette,
  layout: LayoutTemplate,
  book: BookOpen,
}

function EditionContentCard({ item }: { item: EditionContent }) {
  const Icon = EDITION_ICONS[item.icon]

  return (
    <div className="rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100/50 p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
            <Icon size={20} aria-hidden />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-warning/30 bg-warning-light text-warning">
            <Lock size={10} aria-hidden />
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-ink">{item.title}</h3>
            <span className="rounded-full border border-warning/30 bg-warning-light px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning">
              Locked
            </span>
          </div>
          <p className="text-xs leading-relaxed text-ink-3">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

function PendingActivationPanel({
  email,
  viaMailto,
  onReset,
}: {
  email: string
  viaMailto: boolean
  onReset: () => void
}) {
  return (
    <div className="space-y-6 rounded-xl border border-[var(--ds-line)] bg-surface-nested p-6 sm:p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-[var(--ds-offer-green-100)] p-3">
          <CheckCircle2 className="h-6 w-6 text-sapphire-700" aria-hidden />
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-warning">
            <Clock size={12} aria-hidden />
            Awaiting team activation
          </span>
          <h3 className="text-base font-semibold uppercase tracking-tight text-ink">
            Request received
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          {viaMailto ? (
            <>
              Your email app should open with subject{" "}
              <span className="font-semibold text-ink">{REQUEST_SUBJECT}</span>. Tap{" "}
              <span className="font-semibold text-ink">Send</span> to deliver it — then we&apos;ll
              reply to <span className="break-all font-semibold text-ink">{email}</span>.
            </>
          ) : (
            <>
              We&apos;ll reply to <span className="break-all font-semibold text-ink">{email}</span>{" "}
              when your reseller license is activated.
            </>
          )}{" "}
          We usually respond within about 2 hours — during busy periods, please allow 24–48 hours.
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">
          This edition stays locked until the team activates it. Our reply will go to{" "}
          <span className="break-all font-semibold text-ink">{email}</span> only — check that
          inbox&apos;s spam or junk folder if you don&apos;t see it within 48 hours.
        </p>
      </div>

      <Button type="button" variant="outline" onClick={onReset} className="w-full">
        Send another request
      </Button>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-12 animate-pulse rounded-xl bg-surface-nested" />
      <div className="h-36 animate-pulse rounded-xl bg-surface-nested" />
      <div className="h-11 animate-pulse rounded-xl bg-surface-nested" />
    </div>
  )
}

export function LicenseRightsContent() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(DEFAULT_REQUEST_MESSAGE)
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [pending, setPending] = useState<PendingLicenseRightsRequest | null>(null)
  const [viaMailto, setViaMailto] = useState(false)
  const [ready, setReady] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
      const id = user?.id ?? "anonymous"
      setUserId(id)
      setPending(readPendingRequest(id))
      setReady(true)
    })
  }, [])

  const handleReset = () => {
    if (userId) clearPendingRequest(userId)
    setPending(null)
    setViaMailto(false)
    setFormState("idle")
    setErrorMessage("")
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL)
      setCopiedEmail(true)
      window.setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setErrorMessage("")

      const trimmedEmail = email.trim()
      const trimmedMessage = message.trim()

      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setErrorMessage("Please enter a valid email address.")
        setFormState("error")
        return
      }

      if (trimmedMessage.length < 10) {
        setErrorMessage("Please add a bit more detail so we can help you.")
        setFormState("error")
        return
      }

      setFormState("submitting")

      const result = await submitLicenseRightsRequest({
        email: trimmedEmail,
        message: trimmedMessage,
      })

      if (!result.ok) {
        setErrorMessage(result.error)
        setFormState("error")
        return
      }

      if (userId) savePendingRequest(userId, trimmedEmail)
      setPending({ email: trimmedEmail, submittedAt: new Date().toISOString() })
      setViaMailto(result.viaMailto)
      setFormState("idle")
    },
    [email, message, userId],
  )

  const statusBadge = pending ? (
    <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning-light px-4 py-2.5">
      <Clock size={15} className="text-warning" aria-hidden />
      <span className="text-xs font-bold uppercase tracking-wider text-warning">
        Pending review
      </span>
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-100 px-4 py-2.5 text-sapphire-700">
      <Lock size={15} aria-hidden />
      <span className="text-xs font-medium uppercase tracking-wider">Activation required</span>
    </div>
  )

  const overviewStats = [
    {
      label: "Edition status",
      value: pending ? "Pending review" : "Not activated",
      icon: pending ? Clock : Lock,
      tone: pending ? "text-warning" : "text-ink",
    },
    {
      label: "Ticket subject",
      value: REQUEST_SUBJECT,
      icon: Tag,
      tone: "text-sapphire-700",
    },
    {
      label: "Typical reply",
      value: "2–48 hours",
      icon: Clock,
      tone: "text-ink",
    },
  ]

  const licenseVideoId = getPremiumTrainingVimeoId("licenseRights")

  return (
    <PremiumPageLayout
      title={PREMIUM_FEATURE_LABELS.licenseRights}
      subtitle={`Request activation from our support desk. Your ticket is filed as "${REQUEST_SUBJECT}" and the team unlocks this edition on your account.`}
      actions={ready ? statusBadge : undefined}
    >
      <PremiumVideoTutorial
        premiumKey="licenseRights"
        vimeoId={licenseVideoId}
        title={`${PREMIUM_FEATURE_LABELS.licenseRights} Training`}
        description={`Watch this to understand how the Full Turnkey Reseller & License Rights Edition works and how to request activation for your ${PRODUCT_NAME} account.`}
        iframeTitle={`${PREMIUM_FEATURE_LABELS.licenseRights} training video`}
      />

      <PremiumFeatureBanner
        icon={Award}
        kicker="Included edition"
        title="Full Turnkey Reseller Rights"
        description={
          <>
            <span className="mb-1 flex items-center gap-2 font-medium text-ink">
              <Sparkles size={15} className="text-sapphire-700" aria-hidden />
              Premium reseller edition
            </span>
            Sell {PRODUCT_NAME} under your own brand with turnkey assets. Submit one request below —
            our team handles activation manually.
          </>
        }
        chip={`Subject: ${REQUEST_SUBJECT}`}
      />

      <PremiumSteps title="Three steps to activation" steps={ACTIVATION_STEPS} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 sm:p-5">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className={cn("h-4 w-4", stat.tone)} aria-hidden />
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-4">
                {stat.label}
              </span>
            </div>
            <p className="text-lg font-medium text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="scroll-mt-8 xl:col-span-7" id="license-request">
          <PremiumControlCard
            icon={FileText}
            title="Request activation"
            description={`We send your message to support with the title "${REQUEST_SUBJECT}".`}
          >
            {!ready ? (
              <FormSkeleton />
            ) : pending ? (
              <PendingActivationPanel
                email={pending.email}
                viaMailto={viaMailto}
                onReset={handleReset}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="min-w-0">
                  <label htmlFor="license-rights-email" className={labelClassName}>
                    Your email
                  </label>
                  <input
                    id="license-rights-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={formState === "submitting"}
                    className={fieldClassName}
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="license-rights-message" className={labelClassName}>
                    Your message
                  </label>
                  <textarea
                    id="license-rights-message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={formState === "submitting"}
                    rows={6}
                    className={`${fieldClassName} min-h-[148px] resize-y`}
                  />
                </div>

                {formState === "error" && errorMessage ? (
                  <PremiumErrorAlert message={errorMessage} />
                ) : null}

                <div className="rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100/70 px-4 py-3">
                  <p className="text-xs leading-relaxed text-ink-3">
                    <span className="font-medium text-ink">What happens next:</span> Support
                    receives your ticket, verifies your purchase, and replies when the reseller
                    license is ready. Check spam if you don&apos;t hear back within 48 hours.
                  </p>
                </div>

                <Button type="submit" disabled={formState === "submitting"} className="min-h-[46px] w-full">
                  {formState === "submitting" ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send License Rights request
                    </span>
                  )}
                </Button>

                <div className="flex gap-3 rounded-xl border border-[var(--ds-line)] bg-surface-nested px-3 py-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug text-ink-3">
                      Form not working? Copy our support email:
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void handleCopyEmail()}
                        className="break-all text-left text-sm font-medium text-sapphire-700 hover:underline"
                      >
                        {SUPPORT_EMAIL}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleCopyEmail()}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--ds-line)] bg-card px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-3 transition-colors hover:border-sapphire-700 hover:text-sapphire-700"
                      >
                        {copiedEmail ? (
                          <>
                            <Check size={12} aria-hidden />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} aria-hidden />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </PremiumControlCard>
        </div>

        <div className="xl:col-span-5">
          <section className="glass-card h-full p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                <Unlock size={18} aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-medium text-ink">What you unlock</h2>
                <p className="text-sm text-ink-3">
                  {EDITION_CONTENTS.length} deliverables included after activation
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {EDITION_CONTENTS.map((item) => (
                <EditionContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </PremiumPageLayout>
  )
}
