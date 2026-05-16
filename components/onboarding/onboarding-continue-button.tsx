import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface OnboardingContinueButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
  variant?: "primary" | "secondary" | "success"
}

export function OnboardingContinueButton({
  label,
  onClick,
  disabled,
  className,
  variant = "primary",
}: OnboardingContinueButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-200 hover:shadow-xl hover:-translate-y-0.5",
    secondary:
      "bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50 shadow-sm",
    success:
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 hover:-translate-y-0.5",
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "mt-8 h-14 w-full max-w-md rounded-2xl text-lg font-extrabold transition-all duration-200 active:translate-y-0",
        variants[variant],
        className,
      )}
    >
      {label}
      <ChevronRight className="ml-1 h-5 w-5" />
    </Button>
  )
}
