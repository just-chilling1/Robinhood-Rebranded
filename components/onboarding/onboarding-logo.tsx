import { BrandLogo } from "@/components/brand-logo"

interface OnboardingLogoProps {
  size?: "sm" | "md" | "lg" | "header"
}

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 80,
  header: 56,
}

export function OnboardingLogo({ size = "md" }: OnboardingLogoProps) {
  return <BrandLogo variant="icon" size={sizeMap[size]} className="rounded-2xl" priority />
}
