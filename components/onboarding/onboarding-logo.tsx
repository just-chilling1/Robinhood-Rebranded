import { BrandLogo } from "@/components/brand-logo"

interface OnboardingLogoProps {
  size?: "sm" | "md" | "lg" | "header"
}

const sizeMap = {
  sm: 56,
  md: 80,
  lg: 96,
  header: 72,
}

export function OnboardingLogo({ size = "md" }: OnboardingLogoProps) {
  return <BrandLogo variant="icon" size={sizeMap[size]} priority />
}
