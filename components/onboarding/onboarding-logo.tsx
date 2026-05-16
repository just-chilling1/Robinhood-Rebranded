import { Brain } from "lucide-react"

interface OnboardingLogoProps {
  size?: "sm" | "md" | "lg" | "header"
}

const sizeMap = {
  sm: { outer: "w-12 h-12", inner: "w-10 h-10", icon: "w-6 h-6", rounded: "rounded-xl" },
  md: { outer: "w-16 h-16", inner: "w-14 h-14", icon: "w-8 h-8", rounded: "rounded-2xl" },
  lg: { outer: "w-20 h-20", inner: "w-[72px] h-[72px]", icon: "w-10 h-10", rounded: "rounded-2xl" },
  header: { outer: "h-14 w-14 shrink-0", inner: "h-11 w-11", icon: "h-7 w-7", rounded: "rounded-2xl" },
}

export function OnboardingLogo({ size = "md" }: OnboardingLogoProps) {
  const s = sizeMap[size]

  return (
    <div
      className={`relative ${s.outer} ${s.rounded} bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200`}
      aria-hidden
    >
      <div
        className={`${s.inner} ${s.rounded} bg-white flex items-center justify-center`}
      >
        <Brain className={`${s.icon} text-sky-600`} />
      </div>
    </div>
  )
}
