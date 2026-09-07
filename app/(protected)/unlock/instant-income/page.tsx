import { UnlockUpgradeClient } from "@/app/(protected)/unlock/UnlockUpgradeClient"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export default function UnlockInstantIncomePage() {
  return (
    <UnlockUpgradeClient
      upgradeLevel="instant_income"
      upgradeName={PREMIUM_FEATURE_LABELS.instantIncome}
      upgradeValue="$97"
      features={[
        `Everything in ${PREMIUM_FEATURE_LABELS.dfyVault}`,
        "100+ High-Converting Offers",
        "Advanced training videos",
        "Email swipe files",
        "Social media templates",
      ]}
    />
  )
}
