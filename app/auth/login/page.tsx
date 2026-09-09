"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { PRODUCT_NAME } from "@/lib/brand"

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
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="glass-strong glow-blue border border-[var(--border)]">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center mb-2 overflow-hidden rounded-xl">
              <BrandLogo variant="wordmark" width={240} priority />
            </div>
            <CardTitle className="text-2xl font-bold text-ink text-center tracking-tight">Access {PRODUCT_NAME}</CardTitle>
            <CardDescription className="text-sm text-ink-3 text-center font-medium">
              Neural Engagement Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  className="h-10 border-[1.5px] border-[var(--border-strong)] focus:border-primary rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="text-sm font-medium text-ink">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#1E40AF] hover:text-[#1D4ED8] font-medium transition-colors"
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
                  className="h-10 border-[1.5px] border-[var(--border-strong)] focus:border-primary rounded-lg"
                />
              </div>
              {callbackError && (
                <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30">
                  <p className="text-sm text-destructive font-medium">
                    Your sign-in link expired or is invalid. Please try again or request a new password reset.
                  </p>
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full h-10 font-semibold glow-blue bg-gradient-to-r from-[#2563EB] to-[#2563EB] hover:-translate-y-px hover:from-[#1D4ED8] hover:to-[#1D4ED8] text-white rounded-lg transition-all duration-300" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Enter Platform"}
              </Button>
              <div className="text-center pt-1">
                <p className="text-sm text-ink-3">
                  New user?{" "}
                  <Link href="/auth/sign-up" className="text-[#1E40AF] hover:text-[#1D4ED8] font-semibold transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
