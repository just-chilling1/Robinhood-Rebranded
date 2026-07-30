import { createClient } from "@/lib/supabase/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { getSiteUrl } from "@/lib/auth/site-url"

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard"
  return next
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = safeNextPath(
    searchParams.get("next") ?? (type === "recovery" ? "/auth/reset-password" : null),
  )

  // Prefer canonical site URL — request origin can be localhost behind reverse proxies.
  const publicOrigin = getSiteUrl()
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${next}`)
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${next}`)
    }
  }

  return NextResponse.redirect(`${publicOrigin}/auth/login?error=auth_callback_failed`)
}
