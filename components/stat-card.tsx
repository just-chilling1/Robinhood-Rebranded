import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  glowColor?: "blue" | "pink" | "cyan"
}

export function StatCard({ title, value, icon: Icon, trend, glowColor = "blue" }: StatCardProps) {
  const glowClass = glowColor === "blue" ? "glow-blue" : glowColor === "pink" ? "glow-pink" : "glow-cyan"
  const iconColorClass = glowColor === "blue" ? "text-[#0ea5e9]" : glowColor === "pink" ? "text-[#ec4899]" : "text-[#06b6d4]"
  const iconBgClass = glowColor === "blue" ? "bg-[#0ea5e9]/15" : glowColor === "pink" ? "bg-[#ec4899]/15" : "bg-[#06b6d4]/15"
  const borderClass = glowColor === "blue" ? "border-[#0ea5e9]/30" : glowColor === "pink" ? "border-[#ec4899]/30" : "border-[#06b6d4]/30"

  return (
    <Card className={`glass ${glowClass} border-2 ${borderClass}`}>
      <CardContent className="p-7">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-[#7dd3fc] font-bold uppercase tracking-wider">{title}</p>
            <p className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">{value}</p>
            {trend && <p className="text-sm text-[#06b6d4] font-bold">{trend}</p>}
          </div>
          <div className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center border-2 ${borderClass}`}>
            <Icon className={`w-8 h-8 ${iconColorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
