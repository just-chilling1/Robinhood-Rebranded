import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

type RequireUserResult =
  | { supabase: Awaited<ReturnType<typeof createClient>>; user: User; error?: undefined }
  | { supabase: Awaited<ReturnType<typeof createClient>>; user: null; error: string }

export async function requireUser(): Promise<RequireUserResult> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null, error: "Not authenticated" }
  }

  return { supabase, user }
}
