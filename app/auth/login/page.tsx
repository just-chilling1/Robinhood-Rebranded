"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { brand } from "@/config/brand.config"

export default function LoginPage() {
  const [callbackError, setCallbackError] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("error") === "auth_callback_failed") {
      setCallbackError(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/onboarding")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-center">
        <h1 className="ds-h2 text-ink">Access {brand.productName}</h1>
        <p className="mt-1 text-sm font-medium text-ink-3">{brand.tagline}</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-ink">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base h-12"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-sapphire-700 transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base h-12"
          />
        </div>
        {callbackError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
            <p className="text-sm font-medium text-destructive">
              Your sign-in link expired or is invalid. Please try again or request a new password reset.
            </p>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        <Button type="submit" className="btn-primary h-12 w-full font-semibold" disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Enter Platform"}
        </Button>
        <div className="pt-1 text-center">
          <p className="text-sm text-ink-3">
            New user?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-sapphire-700 transition-colors hover:text-primary">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
