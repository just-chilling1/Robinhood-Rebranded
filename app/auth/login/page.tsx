"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Brain } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
            <CardTitle className="text-4xl font-extrabold text-white text-center tracking-tight">Access Robinhood</CardTitle>
            <CardDescription className="text-lg text-[#c4b5fd] text-center font-semibold">
              Neural Engagement Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-7">
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
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-bold text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-lg glass border-2 border-[#a855f7]/30 focus:border-[#a855f7] rounded-2xl"
                />
              </div>
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/15 border-2 border-destructive/30">
                  <p className="text-sm text-destructive font-semibold">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full h-16 text-lg font-extrabold glow-purple bg-gradient-to-r from-[#a855f7] to-[#d946ef] hover:from-[#d946ef] hover:to-[#a855f7] rounded-2xl transition-all duration-300" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Enter Platform"}
              </Button>
              <div className="text-center pt-2">
                <p className="text-base text-[#c4b5fd]">
                  New user?{" "}
                  <Link href="/auth/sign-up" className="text-[#fbbf24] hover:text-[#fb923c] font-bold transition-colors">
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
