"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { CheckCircle2, Headphones, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { APP_SUPPORT_NAME, FREE_TRAINING_URL, SUPPORT_EMAIL } from "@/lib/support"

type FormState = "idle" | "submitting" | "success" | "error"

const fieldClassName =
  "w-full min-w-0 rounded-xl border border-[#0ea5e9]/25 bg-[#020617]/80 px-3.5 py-3 text-sm leading-normal text-white placeholder:text-[#7dd3fc]/40 focus:border-[#0ea5e9] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"

const labelClassName =
  "mb-2 block text-xs font-bold uppercase tracking-wide text-[#7dd3fc]"

function openSupportMailto(email: string, message: string) {
  const subject = `${APP_SUPPORT_NAME} — Support Request`
  const body = `Please reply to: ${email}\n\n${message}`
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function finishWithMailto(
  email: string,
  message: string,
  setSubmittedEmail: (value: string) => void,
  setSentViaMailto: (value: boolean) => void,
  setFormState: (value: FormState) => void,
) {
  openSupportMailto(email, message)
  setSubmittedEmail(email)
  setSentViaMailto(true)
  setFormState("success")
}

async function parseJsonResponse(res: Response): Promise<{
  error?: string
  useMailto?: boolean
  success?: boolean
} | null> {
  const text = await res.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text) as { error?: string; useMailto?: boolean; success?: boolean }
  } catch {
    return null
  }
}

export function ContactSupportWidget() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [sentViaMailto, setSentViaMailto] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const supabase = createClient()

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    })()
  }, [supabase])

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

      try {
        const res = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage }),
        })

        const data = await parseJsonResponse(res)

        if (data === null) {
          finishWithMailto(trimmedEmail, trimmedMessage, setSubmittedEmail, setSentViaMailto, setFormState)
          return
        }

        if (res.status === 401) {
          throw new Error("Your session expired. Please refresh the page and try again.")
        }

        if (res.ok && data.success) {
          setSubmittedEmail(trimmedEmail)
          setSentViaMailto(false)
          setFormState("success")
          return
        }

        if (data.useMailto) {
          finishWithMailto(trimmedEmail, trimmedMessage, setSubmittedEmail, setSentViaMailto, setFormState)
          return
        }

        throw new Error(data.error || "Something went wrong. Please try again.")
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.")
        setFormState("error")
      }
    },
    [email, message],
  )

  const resetForm = () => {
    setFormState("idle")
    setMessage("")
    setSentViaMailto(false)
    setErrorMessage("")
  }

  if (formState === "success") {
    return (
      <Card className="glass-strong min-w-0 overflow-hidden border border-[#0ea5e9]/25">
        <CardContent className="space-y-5 px-5 py-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-white">
              {sentViaMailto ? "Check your email app" : "Message sent"}
            </h3>
            <p className="mt-3 w-full text-sm leading-relaxed text-[#a5c9e8]">
              {sentViaMailto ? (
                <>
                  Your email app should open with your message ready to send. Tap{" "}
                  <span className="font-semibold text-white">Send</span> to deliver it — then
                  we&apos;ll reply to{" "}
                  <span className="break-all font-semibold text-white">{submittedEmail}</span>. We
                  usually respond within about 2 hours — during busy periods, please allow 24–48
                  hours.
                </>
              ) : (
                <>
                  We&apos;ll reply to{" "}
                  <span className="break-all font-semibold text-white">{submittedEmail}</span>. We
                  usually respond within about 2 hours — during busy periods, please allow 24–48
                  hours.
                </>
              )}
            </p>
            <p className="mt-3 w-full text-sm leading-relaxed text-[#7dd3fc]/80">
              Remember: our reply will go to{" "}
              <span className="break-all font-semibold text-white">{submittedEmail}</span> only — not
              another inbox you may use elsewhere. If you don&apos;t see it within 48 hours, check
              that inbox&apos;s spam or junk folder.
            </p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-sm leading-relaxed text-[#a5c9e8]">
              While you wait, start with our{" "}
              <span className="font-semibold text-[#fbbf24]">free training</span> — discover how to
              wake up with an extra{" "}
              <span className="font-semibold text-[#fbbf24]">$1,000–$5,000</span> in your account
              and scale to $1k–$5k per day without extra grind.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#ef4444]">
              Warning: This may be taken down soon
            </p>
            <a
              href={FREE_TRAINING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-4 py-3 text-center text-xs font-black uppercase text-[#1a1305] shadow-lg shadow-[#fbbf24]/20 transition-all hover:scale-[1.01]"
            >
              Watch The Free Training &gt;&gt;
            </a>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="h-11 w-full rounded-xl border-[#0ea5e9]/30 bg-transparent font-bold text-[#7dd3fc] hover:bg-[#0ea5e9]/10 hover:text-white"
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-strong min-w-0 overflow-hidden border border-[#0ea5e9]/25">
      <CardHeader className="pb-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 p-2.5">
            <Headphones className="h-5 w-5 text-[#0ea5e9]" />
          </div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-white">
            Contact Support
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-6 pt-0">
        <p className="text-sm leading-relaxed text-[#a5c9e8]">
          We usually reply within about 2 hours. Because of high email volume, please allow{" "}
          <span className="font-medium text-white">24–48 hours</span> during busy periods. Your
          answer will go to the email you enter below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-w-0">
            <label htmlFor="support-email" className={labelClassName}>
              Your email
            </label>
            <input
              id="support-email"
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
            <label htmlFor="support-message" className={labelClassName}>
              Your message
            </label>
            <textarea
              id="support-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need help with..."
              required
              disabled={formState === "submitting"}
              rows={4}
              className={`${fieldClassName} min-h-[112px] resize-y`}
            />
          </div>

          {formState === "error" && errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-xs leading-relaxed text-[#a5c9e8]">
            <span className="font-semibold text-white">Please note:</span> We will reply to the email
            address you enter above. If you don&apos;t see our reply within 48 hours, check your
            spam or junk folder before reaching out again.
          </p>

          <Button
            type="submit"
            disabled={formState === "submitting"}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] font-bold text-white shadow-lg shadow-[#0ea5e9]/20 hover:from-[#06b6d4] hover:to-[#0ea5e9]"
          >
            {formState === "submitting" ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send message"
            )}
          </Button>
        </form>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
          <div className="flex min-w-0 items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#7dd3fc]" />
            <div className="min-w-0 space-y-1">
              <p className="text-xs leading-relaxed text-[#a5c9e8]">
                If the form doesn&apos;t work, email us directly:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="block break-all text-sm font-semibold leading-snug text-[#0ea5e9] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
