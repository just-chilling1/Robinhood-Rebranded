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
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#0d0a1a] via-[#1a1429] to-[#0d0a1a]">
      <div className="w-full max-w-lg">
        <Card className="glass-strong glow-purple border-2 border-[#a855f7]/40">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#a855f7] via-[#d946ef] to-[#fbbf24] flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.6)]">
                <div className="w-[72px] h-[72px] rounded-[22px] bg-[#0d0a1a] flex items-center justify-center">
                  <Brain className="w-10 h-10 text-[#a855f7]" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl font-extrabold text-white text-center tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription className="text-lg text-[#c4b5fd] text-center font-semibold">
              We&apos;ll email you a secure reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#a855f7]/20">
                  <Mail className="h-8 w-8 text-[#a855f7]" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-white">Check your email</p>
                  <p className="text-base text-[#c4b5fd] leading-relaxed">
                    If an account exists for <span className="font-semibold text-white">{email}</span>, you&apos;ll
                    receive a password reset link shortly.
                  </p>
                </div>
                <Button asChild className="w-full h-14 text-lg font-extrabold rounded-2xl">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-bold text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-lg glass border-2 border-[#a855f7]/30 focus:border-[#a855f7] rounded-2xl"
                  />
                </div>
                {error && (
                  <div className="p-4 rounded-2xl bg-destructive/15 border-2 border-destructive/30">
                    <p className="text-sm text-destructive font-semibold">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-16 text-lg font-extrabold glow-purple bg-gradient-to-r from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] rounded-2xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending reset link..." : "Send Reset Link"}
                </Button>
                <div className="text-center pt-2">
                  <Link
                    href="/auth/login"
                    className="text-base text-[#fbbf24] hover:text-[#fb923c] font-bold transition-colors"
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
