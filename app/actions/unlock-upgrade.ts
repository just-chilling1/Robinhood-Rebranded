"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function unlockUpgrade(_upgradeLevel: "dfy_vault" | "instant_income" | "automated_income") {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Members already receive full access on signup. Do not write upgrade_level.
    revalidatePath("/dashboard")
    revalidatePath("/upgrades")
    revalidatePath("/training")
    revalidatePath("/upgrades/dfy-vault")
    revalidatePath("/upgrades/instant-income")
    revalidatePath("/upgrades/automated-income")
    revalidatePath("/upgrades/protector")

    return { success: true }
  } catch (error) {
    console.error("[rh] Error in unlockUpgrade:", error)
    return { success: false, error: "An error occurred" }
  }
}
