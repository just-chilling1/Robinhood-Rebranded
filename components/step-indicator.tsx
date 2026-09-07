import { Check } from "lucide-react"

export type WizardStep = {
  number: number
  title: string
  description: string
}

interface StepIndicatorProps {
  currentStep: number
  steps: WizardStep[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const progressPercent = steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0

  return (
    <nav aria-label="Progress" className="glass-strong rounded-2xl border border-[var(--border)] px-4 py-5 sm:px-8 sm:py-6">
      <div className="relative">
        <div
          className="absolute left-[16.5%] right-[16.5%] top-5 hidden h-1 overflow-hidden rounded-full bg-[#E4E7EB] sm:block"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-[#16875C] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <ol className="relative grid grid-cols-3 gap-2">
          {steps.map((step) => {
            const status =
              currentStep > step.number ? "complete" : currentStep === step.number ? "current" : "upcoming"

            return (
              <li key={step.number} className="flex flex-col items-center gap-2 text-center">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition-all sm:h-11 sm:w-11 ${
                    status === "complete"
                      ? "bg-[#16875C] text-white"
                      : status === "current"
                        ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25"
                        : "border-2 border-[var(--border)] bg-card text-[#829AB1]"
                  }`}
                  aria-current={status === "current" ? "step" : undefined}
                >
                  {status === "complete" ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-black sm:text-sm ${
                      status === "upcoming" ? "text-[#829AB1]" : "text-[#102A43]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="hidden text-xs font-semibold text-[#486581] sm:block">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
