import { Brain } from "lucide-react"

interface OnboardingLogoProps {
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { outer: "w-12 h-12", inner: "w-10 h-10", icon: "w-6 h-6", rounded: "rounded-xl" },
  md: { outer: "w-16 h-16", inner: "w-14 h-14", icon: "w-8 h-8", rounded: "rounded-2xl" },
  lg: { outer: "w-20 h-20", inner: "w-[72px] h-[72px]", icon: "w-10 h-10", rounded: "rounded-2xl" },
}

export function OnboardingLogo({ size = "md" }: OnboardingLogoProps) {
  const s = sizeMap[size]

  return (
    <div
      className={`relative ${s.outer} ${s.rounded} bg-gradient-to-br from-[#0ea5e9] via-[#ec4899] to-[#06b6d4] flex items-center justify-center shadow-[0_0_60px_rgba(14,165,233,0.5)]`}
      aria-hidden
    >
      <div
        className={`${s.inner} ${s.rounded} bg-[#020617] flex items-center justify-center`}
      >
        <Brain className={`${s.icon} text-[#0ea5e9]`} />
      </div>
    </div>
  )
}
