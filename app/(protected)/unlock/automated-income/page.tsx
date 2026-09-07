import { UnlockUpgradeClient } from "@/app/(protected)/unlock/UnlockUpgradeClient"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export default function UnlockAutomatedIncomePage() {
  return (
    <UnlockUpgradeClient
      upgradeLevel="automated_income"
      upgradeName={PREMIUM_FEATURE_LABELS.automatedIncome}
      upgradeValue="$197"
      features={[
        `Everything in ${PREMIUM_FEATURE_LABELS.instantIncome}`,
        "Automated traffic system",
        "AI-powered optimization",
        "Priority support",
        "Monthly live coaching calls",
        "Private mastermind access",
      ]}
    />
  )
}
