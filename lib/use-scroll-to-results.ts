"use client"

import { useEffect, useRef } from "react"

/** Smooth-scroll to a results anchor when `shouldScroll` becomes true. */
export function useScrollToResults(shouldScroll: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldScroll) return

    const timer = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    return () => clearTimeout(timer)
  }, [shouldScroll])

  return ref
}

/** Scroll to an element by id when `targetId` is set. Clears via `onScrolled`. */
export function useScrollToId(targetId: string | null, onScrolled: () => void) {
  useEffect(() => {
    if (!targetId) return

    const timer = setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
      onScrolled()
    }, 100)

    return () => clearTimeout(timer)
  }, [targetId, onScrolled])
}
