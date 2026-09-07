"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronRight, Zap } from "lucide-react"

interface Niche {
  id: string
  name: string
  description: string
  icon: string
}

interface NicheSelectorProps {
  onSelect: (nicheId: string, nicheName: string) => void
}

// Completely NEW icons and names - nothing like P55
const NICHE_THEMES = {
  "Health & Fitness": { name: "Body Transformation Zone", icon: "🏋️" },
  "Finance": { name: "Wealth Builder Network", icon: "💎" },
  "Technology": { name: "Digital Innovation Hub", icon: "🖥️" },
  "Lifestyle": { name: "Living Large Community", icon: "🎨" },
  "Entertainment": { name: "Viral Fame Factory", icon: "🎭" },
  "Education": { name: "Smart Skills Academy", icon: "🧠" },
  "Business": { name: "Empire Builder's Club", icon: "🏢" },
  "Food": { name: "Flavor Fanatics Network", icon: "🍔" },
}

export function NicheSelector({ onSelect }: NicheSelectorProps) {
  const [niches, setNiches] = useState<Niche[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNiches = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("niches").select("*").order("name")
      if (data) setNiches(data)
      setLoading(false)
    }
    fetchNiches()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-[#2563EB]" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {niches.map((niche) => {
        const theme = NICHE_THEMES[niche.name as keyof typeof NICHE_THEMES] || { 
          name: niche.name, 
          icon: "⚡",
        }
        const isSelected = selectedId === niche.id

        return (
          <Button
            key={niche.id}
            onClick={() => {
              setSelectedId(niche.id)
              setTimeout(() => onSelect(niche.id, niche.name), 200)
            }}
            className={`w-full h-auto p-0 overflow-hidden group transition-all duration-300 ${
              isSelected 
                ? "scale-[1.02] shadow-2xl" 
                : "hover:scale-[1.01] shadow-lg"
            }`}
            variant="ghost"
          >
            <div className={`w-full flex items-center gap-6 p-6 rounded-2xl border transition-all ${
              isSelected
                ? "border-[var(--border-strong)] bg-[#EEF4FF] shadow-[var(--shadow-md)]"
                : "border-[var(--border)] bg-card hover:border-[var(--border-strong)] hover:bg-[#EEF4FF]"
            }`}>
              <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-[#EEF4FF] border border-[var(--border)] transition-transform group-hover:scale-105`}>
                {theme.icon}
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-black text-[#102A43] mb-1">
                  {theme.name}
                </h3>
                <p className="text-sm text-[#486581] font-semibold">
                  Tap to target this niche →
                </p>
              </div>

              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isSelected 
                  ? "bg-[#2563EB]/30" 
                  : "bg-[#2563EB]/20 group-hover:bg-[#2563EB]/30"
              }`}>
                {isSelected ? (
                  <Zap className="w-6 h-6 text-[#102A43] fill-[#102A43] animate-pulse" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
