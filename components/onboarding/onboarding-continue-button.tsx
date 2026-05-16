import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface OnboardingContinueButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function OnboardingContinueButton({
  label,
  onClick,
  disabled,
  className,
}: OnboardingContinueButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "mt-8 h-14 w-full rounded-2xl text-lg font-extrabold glow-cyan bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] text-white shadow-lg shadow-[#0ea5e9]/30",
        className,
      )}
    >
      {label}
      <ChevronRight className="ml-1 h-5 w-5" />
    </Button>
  )
}
