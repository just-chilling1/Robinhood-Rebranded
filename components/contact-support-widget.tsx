"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { CheckCircle2, Headphones, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { APP_SUPPORT_NAME, FREE_TRAINING_URL, SUPPORT_EMAIL } from "@/lib/support"

type FormState = "idle" | "submitting" | "success" | "error"

const fieldClassName =
  "w-full min-w-0 rounded-xl border-[1.5px] border-[var(--border-strong)] bg-card px-3.5 py-3 text-sm leading-normal text-foreground placeholder:text-muted-foreground hover:border-[var(--ds-sapphire-300)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:bg-surface-nested disabled:text-[var(--text-disabled)]"

const labelClassName =
  "mb-2 block text-xs font-bold uppercase tracking-wide text-text-secondary"

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
      <Card className="glass-strong min-w-0 overflow-hidden border border-border shadow-card">
        <CardContent className="space-y-5 px-5 py-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-full border border-[#DDF7EC] bg-[#DDF7EC] p-3">
              <CheckCircle2 className="h-6 w-6 text-[#16875C]" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-foreground">
              {sentViaMailto ? "Check your email app" : "Message sent"}
            </h3>
            <p className="mt-3 w-full text-sm leading-relaxed text-text-secondary">
              {sentViaMailto ? (
                <>
                  Your email app should open with your message ready to send. Tap{" "}
                  <span className="font-semibold text-foreground">Send</span> to deliver it — then
                  we&apos;ll reply to{" "}
                  <span className="break-all font-semibold text-foreground">{submittedEmail}</span>. We
                  usually respond within about 2 hours — during busy periods, please allow 24–48
                  hours.
                </>
              ) : (
                <>
                  We&apos;ll reply to{" "}
                  <span className="break-all font-semibold text-foreground">{submittedEmail}</span>. We
                  usually respond within about 2 hours — during busy periods, please allow 24–48
                  hours.
                </>
              )}
            </p>
            <p className="mt-3 w-full text-sm leading-relaxed text-text-secondary">
              Remember: our reply will go to{" "}
              <span className="break-all font-semibold text-foreground">{submittedEmail}</span> only — not
              another inbox you may use elsewhere. If you don&apos;t see it within 48 hours, check
              that inbox&apos;s spam or junk folder.
            </p>
          </div>

          <div className="border-t border-border pt-5">
            <p className="text-sm leading-relaxed text-text-secondary">
              While you wait, start with our{" "}
              <span className="font-semibold text-[#d97706]">free training</span> — discover how to
              wake up with an extra{" "}
              <span className="font-semibold text-[#d97706]">$1,000–$5,000</span> in your account
              and scale to $1k–$5k per day without extra grind.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#C53030]">
              Warning: This may be taken down soon
            </p>
            <a
              href={FREE_TRAINING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full rounded-xl bg-primary px-4 py-3 text-center text-xs font-black uppercase text-primary-foreground shadow-card transition-all hover:bg-primary-hover active:bg-primary-active"
            >
              Watch The Free Training &gt;&gt;
            </a>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="h-11 w-full rounded-xl border-[var(--border-strong)] bg-card font-bold text-text-secondary hover:bg-primary-light hover:text-foreground"
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-strong min-w-0 overflow-hidden border border-border shadow-card">
      <CardHeader className="pb-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl border border-border bg-primary-light p-2.5">
            <Headphones className="h-5 w-5 text-foreground" />
          </div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
            Contact Support
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-6 pt-0">
        <p className="text-sm leading-relaxed text-text-secondary">
          We usually reply within about 2 hours. Because of high email volume, please allow{" "}
          <span className="font-medium text-foreground">24–48 hours</span> during busy periods. Your
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
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <p className="rounded-lg border border-border bg-surface-nested px-3.5 py-3 text-xs leading-relaxed text-text-secondary">
            <span className="font-semibold text-foreground">Please note:</span> We will reply to the email
            address you enter above. If you don&apos;t see our reply within 48 hours, check your
            spam or junk folder before reaching out again.
          </p>

          <Button
            type="submit"
            disabled={formState === "submitting"}
            className="h-11 w-full rounded-xl bg-primary font-bold text-primary-foreground shadow-card hover:bg-primary-hover"
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

        <div className="rounded-xl border border-border bg-surface-nested px-4 py-3.5">
          <div className="flex min-w-0 items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
            <div className="min-w-0 space-y-1">
              <p className="text-xs leading-relaxed text-text-secondary">
                If the form doesn&apos;t work, email us directly:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="block break-all text-sm font-semibold leading-snug text-sky-700 underline-offset-2 hover:underline"
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
