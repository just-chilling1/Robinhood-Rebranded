import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"

export default async function HomePage() {
  if (isDevAuthBypassEnabled()) {
    redirect("/create")
  }

  // If Supabase env vars are missing, show setup instructions instead of crashing.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/setup")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }
}
