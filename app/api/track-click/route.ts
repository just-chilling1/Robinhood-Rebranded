import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { pageId } = await request.json()
    if (!pageId || typeof pageId !== "string") {
      return NextResponse.json({ success: false, error: "Missing pageId" }, { status: 400 })
    }

    const supabase = await createClient()
    await supabase.rpc("increment_page_stat", { p_page_id: pageId, p_stat: "clicks" })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[rh] Track usage error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
