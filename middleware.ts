import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

const ROBOTS_TAG = "noindex, nofollow, noarchive, nosnippet"

function withRobotsTag(response: NextResponse) {
  response.headers.set("X-Robots-Tag", ROBOTS_TAG)
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Fast-path public specialist embed + APIs (also allowlisted inside updateSession).
  if (
    pathname === "/embed" ||
    pathname.startsWith("/embed/") ||
    pathname.startsWith("/api/eligibility/") ||
    pathname === "/api/track/specialist-popup" ||
    pathname.startsWith("/api/track/specialist-popup/")
  ) {
    return withRobotsTag(NextResponse.next({ request }))
  }

  return withRobotsTag(await updateSession(request))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
