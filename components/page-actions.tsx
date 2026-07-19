"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, Copy, Trash2, Youtube, MessageSquare, AlertTriangle, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface PageActionsProps {
  pageId: string
  affiliateLink: string
  videoUrl?: string
  comments: string[]
}

export function PageActions({ pageId, affiliateLink, videoUrl, comments }: PageActionsProps) {
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const openTracked = useRef(false)
  const router = useRouter()

  const handleDelete = async () => {
    setConfirmOpen(false)
    setLoading(true)
    const supabase = createClient()

    await supabase.from("pages").delete().eq("id", pageId)

    router.refresh()
    setLoading(false)
  }

  const track = (endpoint: "track-open" | "track-click") => {
    fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    })
      .then(() => router.refresh())
      .catch(() => {})
  }

  const handleToggleComments = () => {
    const next = !expanded
    setExpanded(next)
    if (next && !openTracked.current) {
      openTracked.current = true
      track("track-open")
    }
  }

  const handleCopyOne = async (idx: number) => {
    const text = comments[idx]
    if (!text) return
    await navigator.clipboard.writeText(text)
    track("track-click")
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1200)
  }

  const handleCopyAll = async () => {
    if (comments.length === 0) return
    await navigator.clipboard.writeText(comments.join("\n\n"))
    track("track-click")
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1200)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleToggleComments}
          className="flex-1 h-14 text-base font-black bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] text-white rounded-xl border-0 shadow-lg shadow-[#0ea5e9]/30"
        >
          {expanded ? <ChevronUp className="w-5 h-5 mr-2" /> : <MessageSquare className="w-5 h-5 mr-2" />}
          {expanded ? "Hide Comments" : "View Comments"}
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
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
          className="h-14 px-5 glass bg-transparent border-2 border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444] font-bold rounded-xl"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      {expanded && (
        <div className="glass rounded-xl border-2 border-[#0ea5e9]/30 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-white">
              {comments.length} comment{comments.length === 1 ? "" : "s"} — copy one and paste it on the video
            </p>
            <Button
              onClick={handleCopyAll}
              variant="outline"
              size="sm"
              className="glass bg-transparent border-2 border-[#0ea5e9]/30 text-white font-bold rounded-lg hover:bg-[#0ea5e9]/10"
            >
              {copiedAll ? <Check className="w-4 h-4 mr-2 text-[#10b981]" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedAll ? "Copied!" : "Copy All"}
            </Button>
          </div>

          {comments.length === 0 ? (
            <p className="text-sm text-[#7dd3fc]">No comments found in this pack.</p>
          ) : (
            comments.map((comment, idx) => (
              <div
                key={idx}
                className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 border border-white/5"
              >
                <p className="flex-1 text-sm text-[#e2f3ff] leading-relaxed">{comment}</p>
                <Button
                  onClick={() => handleCopyOne(idx)}
                  size="sm"
                  className="h-10 font-black bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] text-white rounded-lg border-0 flex-shrink-0"
                >
                  {copiedIdx === idx ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedIdx === idx ? "Copied!" : "Copy"}
                </Button>
              </div>
            ))
          )}
        </div>
      )}

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
