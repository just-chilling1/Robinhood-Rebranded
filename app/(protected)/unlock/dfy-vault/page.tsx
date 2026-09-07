import { UnlockUpgradeClient } from "@/app/(protected)/unlock/UnlockUpgradeClient"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export default function UnlockDFYVaultPage() {
  return (
    <UnlockUpgradeClient
      upgradeLevel="dfy_vault"
      upgradeName={PREMIUM_FEATURE_LABELS.dfyVault}
      upgradeValue="$47"
      features={[
        "50+ Ready-Made comment templates",
        "Pre-written packs across categories",
        "Fast copy + tweak workflow",
        "Safer, non-spam patterns",
      ]}
    />
  )
}
