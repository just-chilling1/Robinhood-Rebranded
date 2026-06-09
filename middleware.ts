import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

const ROBOTS_TAG = "noindex, nofollow, noarchive, nosnippet"

function withRobotsTag(response: NextResponse) {
  response.headers.set("X-Robots-Tag", ROBOTS_TAG)
  return response
}

export async function middleware(request: NextRequest) {
  return withRobotsTag(await updateSession(request))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
