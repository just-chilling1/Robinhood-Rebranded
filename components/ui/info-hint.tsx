"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

interface InfoHintProps {
  /** Plain-language explanation shown in the bubble. */
  label: string
  /** Extra classes for the wrapper. */
  className?: string
  /** Accessible label for the button. */
  srLabel?: string
  /** Which side the bubble opens toward. */
  side?: "top" | "bottom"
}

/**
 * A small "?" helper that reveals a short, plain-language explanation.
 * Opens on hover and keyboard focus (desktop) AND on tap/click (mobile),
 * and closes on outside-click or Escape. Built to work without a pointer.
 */
export function InfoHint({ label, className, srLabel = "What does this mean?", side = "top" }: InfoHintProps) {
  const [open, setOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <span ref={wrapperRef} className={cn("relative inline-flex align-middle", className)}>
      <button
        type="button"
        aria-label={srLabel}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen((value) => !value)
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#06b6d4]/50 bg-[#06b6d4]/10 text-[#06b6d4] transition-colors hover:bg-[#06b6d4]/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4]/70"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className={cn(
            "glass pointer-events-none absolute left-1/2 z-[100] w-max max-w-[260px] -translate-x-1/2 rounded-lg border border-[#06b6d4]/40 px-3 py-2 text-left text-xs font-medium leading-relaxed text-white shadow-xl",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {label}
        </span>
      )}
    </span>
  )
}
