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
import { Brain } from "lucide-react"

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
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-[#0d0a1a] via-[#1a1429] to-[#0d0a1a]">
      <div className="w-full max-w-md">
        <Card className="glass-strong glow-purple border border-[#a855f7]/40">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#a855f7] via-[#d946ef] to-[#fbbf24] flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                <div className="w-12 h-12 rounded-lg bg-[#0d0a1a] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#a855f7]" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center tracking-tight">Access RH</CardTitle>
            <CardDescription className="text-sm text-[#c4b5fd] text-center font-medium">
              Neural Engagement Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 glass border border-[#a855f7]/30 focus:border-[#a855f7] rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#fbbf24] hover:text-[#fb923c] font-medium transition-colors"
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
                  className="h-10 glass border border-[#a855f7]/30 focus:border-[#a855f7] rounded-lg"
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
              <Button type="submit" className="w-full h-10 font-semibold glow-purple bg-gradient-to-r from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] rounded-lg transition-all duration-300" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Enter Platform"}
              </Button>
              <div className="text-center pt-1">
                <p className="text-sm text-[#c4b5fd]">
                  New user?{" "}
                  <Link href="/auth/sign-up" className="text-[#fbbf24] hover:text-[#fb923c] font-semibold transition-colors">
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
