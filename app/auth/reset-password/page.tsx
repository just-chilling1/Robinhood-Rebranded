"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { brand } from "@/config/brand.config"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionValid, setSessionValid] = useState<boolean | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setSessionValid(!!user)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionValid(true)
        setError(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-center">
        <h1 className="ds-h2 text-ink">Choose New Password</h1>
        <p className="mt-1 text-sm font-medium text-ink-3">
          Enter a new password for your {brand.productName} account
        </p>
      </div>

      {sessionValid === null ? (
        <p className="text-center text-sm font-medium text-ink-3">Verifying reset link...</p>
      ) : success ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ds-offer-green-100)]">
            <CheckCircle2 className="h-6 w-6 text-sapphire-700" />
          </div>
          <div className="space-y-2">
            <p className="text-base font-semibold text-ink">Password updated</p>
            <p className="text-sm text-ink-3">Redirecting you to the dashboard...</p>
          </div>
        </div>
      ) : !sessionValid ? (
        <div className="space-y-4 text-center">
          <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
            <p className="text-sm font-medium text-destructive">
              Your reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          <Button asChild className="btn-primary h-12 w-full font-semibold">
            <Link href="/auth/forgot-password">Request New Reset Link</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-ink">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-base h-12"
            />
          </div>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}
          <Button type="submit" className="btn-primary h-12 w-full font-semibold" disabled={isLoading}>
            {isLoading ? "Updating password..." : "Update Password"}
          </Button>
        </form>
      )}
    </div>
  )
}
