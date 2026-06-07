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
import { Brain, CheckCircle2 } from "lucide-react"

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
              Choose New Password
            </CardTitle>
            <CardDescription className="text-lg text-[#c4b5fd] text-center font-semibold">
              Enter a new password for your Robinhood account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionValid === null ? (
              <p className="text-center text-[#c4b5fd] font-semibold">Verifying reset link...</p>
            ) : success ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-white">Password updated</p>
                  <p className="text-base text-[#c4b5fd]">Redirecting you to the dashboard...</p>
                </div>
              </div>
            ) : !sessionValid ? (
              <div className="space-y-6 text-center">
                <div className="p-4 rounded-2xl bg-destructive/15 border-2 border-destructive/30">
                  <p className="text-sm text-destructive font-semibold">
                    Your reset link is invalid or has expired. Please request a new one.
                  </p>
                </div>
                <Button asChild className="w-full h-14 text-lg font-extrabold rounded-2xl">
                  <Link href="/auth/forgot-password">Request New Reset Link</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-base font-bold text-white">
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
                    className="h-14 text-lg glass border-2 border-[#a855f7]/30 focus:border-[#a855f7] rounded-2xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-base font-bold text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? "Updating password..." : "Update Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
