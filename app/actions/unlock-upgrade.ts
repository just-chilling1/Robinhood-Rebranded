"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function unlockUpgrade(upgradeLevel: "dfy_vault" | "instant_income" | "automated_income") {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Update user's upgrade level
    const { error: updateError } = await supabase
      .from("users")
      .update({ upgrade_level: upgradeLevel })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Error updating upgrade level:", updateError)
      return { success: false, error: "Failed to unlock upgrade" }
    }

    // Revalidate paths to update UI
    revalidatePath("/dashboard")
    revalidatePath("/upgrades")
    revalidatePath("/training")
    revalidatePath("/upgrades/dfy-vault")
    revalidatePath("/upgrades/instant-income")
    revalidatePath("/upgrades/automated-income")
    revalidatePath("/upgrades/protector")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error in unlockUpgrade:", error)
    return { success: false, error: "An error occurred" }
  }
}
