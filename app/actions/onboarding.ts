"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeOnboarding(firstName?: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const updates: {
      onboarding_completed_at: string
      full_name?: string
      updated_at: string
    } = {
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (firstName?.trim()) {
      updates.full_name = firstName.trim()
    }

    const { error: updateError } = await supabase.from("users").update(updates).eq("id", user.id)

    if (updateError) {
      console.error("[onboarding] Failed to complete:", updateError)
      return { success: false, error: "Failed to save onboarding status" }
    }

    if (firstName?.trim()) {
      await supabase.auth.updateUser({
        data: { full_name: firstName.trim() },
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/onboarding")

    return { success: true }
  } catch (error) {
    console.error("[onboarding] Error:", error)
    return { success: false, error: "An error occurred" }
  }
}
