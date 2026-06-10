"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { getAuthCallbackUrl } from "@/lib/auth/site-url"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Brain, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthCallbackUrl("/auth/reset-password"),
      })
      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
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
            <CardTitle className="text-2xl font-bold text-white text-center tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-[#c4b5fd] text-center font-medium">
              We&apos;ll email you a secure reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#a855f7]/20">
                  <Mail className="h-6 w-6 text-[#a855f7]" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-white">Check your email</p>
                  <p className="text-sm text-[#c4b5fd] leading-relaxed">
                    If an account exists for <span className="font-semibold text-white">{email}</span>, you&apos;ll
                    receive a password reset link shortly.
                  </p>
                </div>
                <Button asChild className="w-full h-10 font-semibold rounded-lg">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-10 font-semibold glow-purple bg-gradient-to-r from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] rounded-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending reset link..." : "Send Reset Link"}
                </Button>
                <div className="text-center pt-1">
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#fbbf24] hover:text-[#fb923c] font-semibold transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
