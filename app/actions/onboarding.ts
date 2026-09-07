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

    // Keep the profile update limited to columns that always exist on `users`.
    // Some environments only have id / created_at / onboarding_completed_at.
    // Persist the display name in auth metadata (and optionally full_name below).
    const { error: updateError } = await supabase
      .from("users")
      .update({
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[onboarding] Failed to complete:", updateError)
      return { success: false, error: "Failed to save onboarding status" }
    }

    if (firstName?.trim()) {
      const trimmed = firstName.trim()
      await supabase.auth.updateUser({
        data: { full_name: trimmed },
      })

      // Best-effort: older DBs may not have full_name / updated_at yet.
      const { error: profileNameError } = await supabase
        .from("users")
        .update({ full_name: trimmed, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (profileNameError) {
        console.warn("[onboarding] Name saved to auth only; users.full_name unavailable:", profileNameError.message)
      }
    }

    revalidatePath("/dashboard")
    revalidatePath("/onboarding")

    return { success: true }
  } catch (error) {
    console.error("[onboarding] Error:", error)
    return { success: false, error: "An error occurred" }
  }
}
