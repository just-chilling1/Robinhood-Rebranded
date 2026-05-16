/**
 * Robinhood onboarding — edit copy and URLs here when porting or updating.
 */

export const ONBOARDING_FINAL_CTA_URL =
  "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea"

/** Local path (e.g. "/videos/upgrades.mp4") or full https URL. Empty = show placeholder. */
export const ONBOARDING_UPGRADES_VIDEO_URL = ""

export const onboardingConfig = {
  productName: "Robinhood",
  productTagline: "Neural Engagement System",
  dashboardRoute: "/dashboard",

  preparing: {
    title: "Preparing Your Command Center",
    subtitle: "Setting up your AI engagement system…",
    tip: "Start with Gold Rush first — it walks you from trending Shorts to ready-to-post comment packs.",
    rows: [
      { label: "Loading your Gold Rush engine" },
      { label: "Connecting your comment pack workflow" },
      { label: "Unlocking Premium Tier tools & Academy" },
    ],
    continueLabel: "Continue",
  },

  upgrades: {
    title: "Did You Purchase Any Upgrades?",
    intro: (name: string) =>
      `If you bought any extras, here is where to find them in ${name}:`,
    steps: [
      "Open Robinhood.",
      "Look at the left sidebar and scroll to the Premium Tier section.",
      'Under Premium Tier, you will see Accelerator, Recurring Streams, Social Payouts, and Protector when your account has access.',
    ],
    videoPlaceholder: "Add your upgrades walkthrough video in ONBOARDING_UPGRADES_VIDEO_URL",
    continueLabel: "Continue",
  },

  congratulations: {
    badge: "🎉 CONGRATULATIONS!",
    headline: "You've Been Randomly Selected",
    continueLabel: "Continue",
  },

  betaOffer: {
    headline:
      "Out of thousands of new members today, your account was flagged for our private Beta Tester program.",
    subcopy: (name: string) =>
      `This is a separate, optional opportunity — not part of ${name}. But we highly recommend checking it out.`,
    infoCard:
      "Don't panic! This is a good thing. You've been chosen to test a brand-new system — and testers get paid.",
    payLabel: "Beta Tester Pay:",
    payAmount: "$500/day",
    ctaLabel: "See If You Qualify >",
    continueLabel: "Continue",
  },

  qualification: {
    badge: "✅ QUALIFICATION CHECK",
    headline: "Do You Meet These Requirements?",
    requirements: ["A phone or a computer", "Speaks English", "No tech skills required"],
    footer: "If you checked all three — you qualify!",
    claimCta: "🚀 Claim My Beta Tester Spot >",
    continueLabel: "Continue Setup",
    finePrint: (name: string) =>
      `This is an optional partner offer, separate from your ${name} membership. Spots are limited.`,
  },

  loading66: {
    progressLabel: "66%",
    footerTagline: "Neural Engagement System",
  },

  activation: {
    headline: "Let's Activate Your System",
    subheadline: "First, tell us your name so we can personalize your earning system.",
    inputPlaceholder: "Enter your first name",
    infoTitle: "What happens next:",
    infoSteps: [
      "We'll locate the fastest datacenter near New York",
      "Your personal supercomputer node gets activated",
      "Earning zones light up across the map",
      "You unlock global coverage with one tap",
    ],
    note: "You're getting set up 🔥 — Your links will work overnight while you relax",
    ctaLabel: "Activate My System >",
    sidebarStatus: [
      { label: "Neural link", status: "Online" },
      { label: "Gold Rush", status: "Ready" },
      { label: "Premium Tier", status: "Unlocked" },
    ],
  },
} as const
