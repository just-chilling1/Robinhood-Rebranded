import { NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { pageId } = await request.json()
    if (!pageId) {
      return NextResponse.json({ success: false, error: "Missing pageId" }, { status: 400 })
    }

    // We use service role ONLY to increment counters server-side (no data returned).
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ success: true }) // no-op in dev without secrets
    }

    const supabaseAdmin = createAdminClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: page } = await supabaseAdmin.from("pages").select("views,status").eq("id", pageId).single()
    if (!page || page.status !== "active") {
      return NextResponse.json({ success: true })
    }

    await supabaseAdmin
      .from("pages")
      .update({ views: (page.views || 0) + 1 })
      .eq("id", pageId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[rh] Track open error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}


