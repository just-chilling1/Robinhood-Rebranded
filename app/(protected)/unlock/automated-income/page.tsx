import { UnlockUpgradeClient } from "@/app/(protected)/unlock/UnlockUpgradeClient"

export default function UnlockAutomatedIncomePage() {
  return (
    <UnlockUpgradeClient
      upgradeLevel="automated_income"
      upgradeName="Social Payouts"
      upgradeValue="$197"
      features={[
        "Everything in Recurring Streams",
        "Automated traffic system",
        "AI-powered optimization",
        "Priority support",
        "Monthly live coaching calls",
        "Private mastermind access",
      ]}
    />
  )
}
