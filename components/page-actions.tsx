"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Pause, Play, Trash2, Youtube, MessageSquare, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SharePageDialog } from "@/components/share-page-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

interface PageActionsProps {
  pageId: string
  status: string
  affiliateLink: string
  videoUrl?: string
}

export function PageActions({ pageId, status, affiliateLink, videoUrl }: PageActionsProps) {
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const router = useRouter()

  const handleToggleStatus = async () => {
    setLoading(true)
    const supabase = createClient()
    const newStatus = status === "active" ? "paused" : "active"

    await supabase.from("pages").update({ status: newStatus }).eq("id", pageId)

    router.refresh()
    setLoading(false)
  }

  const handleDelete = async () => {
    setConfirmOpen(false)
    setLoading(true)
    const supabase = createClient()

    await supabase.from("pages").delete().eq("id", pageId)

    router.refresh()
    setLoading(false)
  }

  const packUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/article/${pageId}`

  return (
    <div className="flex items-center gap-2">
      <Button 
        asChild 
        className="flex-1 h-14 text-base font-black bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] text-white rounded-xl border-0 shadow-lg shadow-[#0ea5e9]/30"
      >
        <Link href={`/article/${pageId}`} target="_blank">
          <MessageSquare className="w-5 h-5 mr-2" />
          View Comments
        </Link>
      </Button>
      
      <Button 
        asChild 
        className="flex-1 h-14 text-base font-black bg-gradient-to-r from-[#ec4899] to-[#f97316] hover:from-[#f97316] hover:to-[#ec4899] text-white rounded-xl border-0 shadow-lg shadow-[#ec4899]/30"
      >
        <a href={videoUrl || affiliateLink} target="_blank" rel="noopener noreferrer">
          <Youtube className="w-5 h-5 mr-2" />
          Open Video
        </a>
      </Button>

      <Button
        variant="outline"
        onClick={handleToggleStatus}
        disabled={loading}
        className="h-14 px-5 glass bg-transparent border-2 border-[#0ea5e9]/30 text-white font-bold hover:bg-[#0ea5e9]/10 rounded-xl"
      >
        {status === "active" ? (
          <>
            <Pause className="w-5 h-5" />
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="h-14 px-5 glass bg-transparent border-2 border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444] font-bold rounded-xl"
      >
        <Trash2 className="w-5 h-5" />
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="glass-strong border-2 border-[#ef4444]/40 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-white">
              <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
              Delete this pack?
            </DialogTitle>
            <DialogDescription className="text-[#7dd3fc]">
              This will permanently remove this comment pack. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
              className="glass border-2 border-[#0ea5e9]/30 text-white font-bold rounded-xl"
            >
              Keep It
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-black rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
