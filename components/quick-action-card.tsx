import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  buttonText: string
  glowColor?: "blue" | "pink" | "cyan"
}

export function QuickActionCard({ title, description, icon: Icon, href, buttonText, glowColor = "blue" }: QuickActionCardProps) {
  const glowClass = glowColor === "blue" ? "glow-blue" : glowColor === "pink" ? "glow-pink" : "glow-cyan"
  const borderClass = glowColor === "blue" ? "border-[#0ea5e9]/40" : glowColor === "pink" ? "border-[#ec4899]/40" : "border-[#06b6d4]/40"
  const iconColorClass = glowColor === "blue" ? "text-[#0ea5e9]" : glowColor === "pink" ? "text-[#ec4899]" : "text-[#06b6d4]"
  const buttonClass = glowColor === "blue" 
    ? "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9]" 
    : glowColor === "pink" 
    ? "bg-gradient-to-r from-[#ec4899] to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-[#ec4899]"
    : "bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-[#06b6d4]"

  return (
    <Card className={`glass-strong border ${borderClass} ${glowClass} hover:scale-[1.02] transition-transform duration-300`}>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${glowColor === "blue" ? "from-[#0ea5e9]/20 to-[#06b6d4]/20" : glowColor === "pink" ? "from-[#ec4899]/20 to-[#0ea5e9]/20" : "from-[#06b6d4]/20 to-[#0ea5e9]/20"} flex items-center justify-center border ${borderClass}`}>
            <Icon className={`w-5 h-5 ${iconColorClass}`} />
          </div>
          <CardTitle className="text-lg font-bold text-white tracking-tight">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-[#7dd3fc] leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className={`w-full h-9 text-sm font-semibold rounded-lg ${buttonClass} text-white shadow-md transition-all duration-300`}>
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
