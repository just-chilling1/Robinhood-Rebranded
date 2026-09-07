import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  glowColor?: "blue" | "pink" | "cyan"
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="glass-card border border-[var(--ds-line)]">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-ink-4">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{value}</p>
            {trend && <p className="text-sm font-semibold text-sapphire-700">{trend}</p>}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--ds-r-md)] border border-[var(--ds-line-sapphire)] bg-sapphire-200">
            <Icon className="h-7 w-7 text-sapphire-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
