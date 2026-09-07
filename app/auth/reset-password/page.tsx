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
import { PRODUCT_NAME } from "@/lib/brand"

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
              Choose New Password
            </CardTitle>
            <CardDescription className="text-sm text-[#486581] text-center font-medium">
              Enter a new password for your {PRODUCT_NAME} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionValid === null ? (
              <p className="text-center text-sm text-[#486581] font-medium">Verifying reset link...</p>
            ) : success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DDF7EC]">
                  <CheckCircle2 className="h-6 w-6 text-[#16875C]" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-[#102A43]">Password updated</p>
                  <p className="text-sm text-[#486581]">Redirecting you to the dashboard...</p>
                </div>
              </div>
            ) : !sessionValid ? (
              <div className="space-y-4 text-center">
                <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30">
                  <p className="text-sm text-destructive font-medium">
                    Your reset link is invalid or has expired. Please request a new one.
                  </p>
                </div>
                <Button asChild className="w-full h-10 font-semibold rounded-lg bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white">
                  <Link href="/auth/forgot-password">Request New Reset Link</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-[#102A43]">
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
                    className="h-10 border-[1.5px] border-[var(--border-strong)] focus:border-primary rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#102A43]">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
