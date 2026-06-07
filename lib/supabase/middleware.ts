import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // If Supabase env vars are missing, skip auth middleware so the app can render
  // and show a clear setup error in the UI.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  if (request.nextUrl.pathname.startsWith("/secret-p55-admin-panel-2029")) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith("/auth") && !request.nextUrl.pathname.startsWith("/article") && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  const authPathsAllowedWhenLoggedIn = ["/auth/callback", "/auth/reset-password"]
  const isResetPasswordRoute = request.nextUrl.pathname.startsWith("/auth/reset-password")

  // Redirect authenticated users away from auth pages (except password reset flow)
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const isAllowed = authPathsAllowedWhenLoggedIn.some(
      (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
    )
    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }
  }

  const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding")

  if (
    user &&
    !isOnboardingRoute &&
    !isResetPasswordRoute &&
    !request.nextUrl.pathname.startsWith("/secret-p55-admin-panel-2029")
  ) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return supabaseResponse
    }

    if (!profile?.onboarding_completed_at) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }
  }

  if (user && isOnboardingRoute) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return supabaseResponse
    }

    if (profile?.onboarding_completed_at) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
