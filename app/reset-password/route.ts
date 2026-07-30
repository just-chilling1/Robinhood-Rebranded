import { NextResponse, type NextRequest } from "next/server"
import { getSiteUrl } from "@/lib/auth/site-url"

export const dynamic = "force-dynamic"

/**
 * Compatibility shim for recovery emails that still land on /reset-password.
 * Forwards token/code params into the real auth callback → reset-password flow.
 */
export async function GET(request: NextRequest) {
  const target = new URL("/auth/callback", getSiteUrl())

  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value)
  })

  if (!target.searchParams.has("next")) {
    target.searchParams.set("next", "/auth/reset-password")
  }

  return NextResponse.redirect(target.toString())
}
