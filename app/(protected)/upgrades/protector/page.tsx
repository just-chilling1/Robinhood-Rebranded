import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProtectorContent } from "./protector-content"

export const metadata: Metadata = {
  title: "Protector | Account Security Overview",
  description: "Real-time account security monitoring and status",
}

export default async function ProtectorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <ProtectorContent email={user.email ?? "—"} />
}
