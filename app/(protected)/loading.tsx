import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/15 to-[var(--ds-ink-4)]/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
        </div>
        <p className="text-xl font-bold text-ink">Loading AI Platform...</p>
      </div>
    </div>
  )
}
