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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
          emailConfirm: false, // Disable email verification
        },
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
        <Card className="glass-strong glow-magenta border-2 border-[#d946ef]/40">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#d946ef] via-[#a855f7] to-[#fbbf24] flex items-center justify-center shadow-[0_0_80px_rgba(217,70,239,0.6)]">
                <div className="w-[72px] h-[72px] rounded-[22px] bg-[#0d0a1a] flex items-center justify-center">
                  <Brain className="w-10 h-10 text-[#d946ef]" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl font-extrabold text-white text-center tracking-tight">Join Robinhood</CardTitle>
            <CardDescription className="text-lg text-[#c4b5fd] text-center font-semibold">
              Activate your AI engagement agent in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-7">
              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-base font-bold text-white">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-14 text-lg glass border-2 border-[#d946ef]/30 focus:border-[#d946ef] rounded-2xl"
                />
              </div>
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
                  className="h-14 text-lg glass border-2 border-[#d946ef]/30 focus:border-[#d946ef] rounded-2xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-bold text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-lg glass border-2 border-[#d946ef]/30 focus:border-[#d946ef] rounded-2xl"
                />
              </div>
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/15 border-2 border-destructive/30">
                  <p className="text-sm text-destructive font-semibold">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full h-16 text-lg font-extrabold glow-magenta bg-gradient-to-r from-[#d946ef] to-[#a855f7] hover:from-[#a855f7] hover:to-[#d946ef] rounded-2xl transition-all duration-300" disabled={isLoading}>
                {isLoading ? "Initializing Agent..." : "Activate Account"}
              </Button>
              <div className="text-center pt-2">
                <p className="text-base text-[#c4b5fd]">
                  Already registered?{" "}
                  <Link href="/auth/login" className="text-[#fbbf24] hover:text-[#fb923c] font-bold transition-colors">
                    Sign In
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
