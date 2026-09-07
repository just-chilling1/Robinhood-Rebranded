"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  profile: any
  userEmail: string
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const supabase = createClient()
      const { error } = await supabase.from("users").update({ full_name: fullName }).eq("id", profile.id)

      if (error) throw error

      setMessage("Profile updated successfully!")
      router.refresh()
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="email" className="text-lg font-semibold">
          Email Address
        </Label>
        <Input id="email" type="email" value={userEmail} disabled className="h-12 text-lg glass" />
        <p className="text-sm text-muted-foreground">Email cannot be changed</p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="fullName" className="text-lg font-semibold">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-12 text-lg glass"
          placeholder="Enter your full name"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl ${message.includes("success") ? "bg-[#DDF7EC] border border-[#DDF7EC]" : "bg-[#FDE4E4] border border-[#FDE4E4]"}`}
        >
          <p className={`text-base font-semibold ${message.includes("success") ? "text-[#16875C]" : "text-destructive"}`}>
            {message}
          </p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="h-14 text-lg font-bold glow-cyan">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
