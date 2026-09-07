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
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="glass-strong glow-blue border border-[var(--border)]">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-14 h-14 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[var(--shadow-md)]">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#102A43] text-center tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-[#486581] text-center font-medium">
              We&apos;ll email you a secure reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#486581]/20">
                  <Mail className="h-6 w-6 text-[#486581]" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-[#102A43]">Check your email</p>
                  <p className="text-sm text-[#486581] leading-relaxed">
                    If an account exists for <span className="font-semibold text-[#102A43]">{email}</span>, you&apos;ll
                    receive a password reset link shortly.
                  </p>
                </div>
                <Button asChild className="w-full h-10 font-semibold rounded-lg bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#102A43]">
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
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-10 font-semibold glow-blue bg-gradient-to-r from-[#2563EB] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#1D4ED8] text-white rounded-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending reset link..." : "Send Reset Link"}
                </Button>
                <div className="text-center pt-1">
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#1E40AF] hover:text-[#1D4ED8] font-semibold transition-colors"
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
