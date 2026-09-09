import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export interface FaqItem {
  q: string
  a: string
}

export interface FaqSection {
  title: string
  items: FaqItem[]
}

const productName = PRODUCT_NAME

export const faqSections: FaqSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: `What is ${productName}?`,
        a: `${productName} helps you find videos to comment on, generate ready-to-post comments, and keep your affiliate links and saved work in one workspace. Start with Gold Rush, then use My Vault and Your Links to reuse what works.`,
      },
      {
        q: "How do I get started?",
        a: "Open the Dashboard and watch the three Start Here videos in order. Then go to Gold Rush, add your product and affiliate link, and generate comments for trending or niche videos.",
      },
      {
        q: "What is Gold Rush?",
        a: "Gold Rush is the comment workflow. Enter your product details and affiliate link, pick trending or niche videos, then generate comments you can copy and post.",
      },
      {
        q: "Do I need my own affiliate link?",
        a: "Yes. Paste a valid affiliate or promotional URL when you run Gold Rush. That link is what you promote in the comments you generate.",
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        q: "What is My Vault?",
        a: "My Vault stores the comments you generate so you can come back to them later. Open it from the sidebar whenever you want to reuse a previous batch.",
      },
      {
        q: "What is Your Links?",
        a: "Your Links is where saved affiliate URLs live. Add a link once, then pick it in Gold Rush instead of typing it every time.",
      },
      {
        q: "What is the Academy?",
        a: "The Academy is the in-app training library. Watch the walkthroughs there whenever you want a deeper explanation of a tool or workflow.",
      },
    ],
  },
  {
    title: "Premium Features",
    items: [
      {
        q: `What is ${PREMIUM_FEATURE_LABELS.dfyVault}?`,
        a: `${PREMIUM_FEATURE_LABELS.dfyVault} unlocks ready-made templates so you can skip the blank-page work and start from proven layouts.`,
      },
      {
        q: `What is ${PREMIUM_FEATURE_LABELS.highTicketPayouts}?`,
        a: `${PREMIUM_FEATURE_LABELS.highTicketPayouts} provides ready-to-publish authority articles built around your offer.`,
      },
      {
        q: `What is ${PREMIUM_FEATURE_LABELS.dfyProfit}?`,
        a: `${PREMIUM_FEATURE_LABELS.dfyProfit} builds a complete promo kit from one link and one niche in a single run.`,
      },
      {
        q: `What is ${PREMIUM_FEATURE_LABELS.protector}?`,
        a: `${PREMIUM_FEATURE_LABELS.protector} is your account security overview — verification status, security checks, and recent activity — so you can keep your member account in good standing.`,
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        q: "How do I reset my password?",
        a: "Use Forgot Password on the login screen. If you are already signed in, sign out first, then request a reset link to the email on your account.",
      },
      {
        q: "How quickly does support respond?",
        a: "Our support team typically replies within two hours. Use the contact form on this page if your question is not answered here.",
      },
      {
        q: "Is my data secure?",
        a: `${productName} uses secure authentication and encrypted connections. Never share your password, and contact support immediately if you notice unusual account activity.`,
      },
    ],
  },
]
