/** Wifi Code support & training links — update here when they change. */

import { PRODUCT_NAME } from "@/lib/brand"

// Freshdesk inbox address (do not rename — mailbox is fixed on Freshdesk).
export const SUPPORT_EMAIL = "Robinhood@neoai.freshdesk.com"
export const SUPPORT_PORTAL_URL = "https://neoaifreshdesk.freshdesk.com/"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`

export const FREE_TRAINING_URL =
  "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea"

export const APP_SUPPORT_NAME = PRODUCT_NAME

export const support = {
  email: SUPPORT_EMAIL,
  contactUrl: "/support#contact",
  helpCenterUrl: SUPPORT_PORTAL_URL,
  pageTitle: "Support",
  pageSubtitle: "Get answers fast, or send us a message — we typically reply within two hours.",
  stats: [
    { icon: "clock", label: "Avg response", highlight: "under 2 hours", highlightClass: "text-success" },
    { icon: "star", label: "Support rating", highlight: "4.9 / 5" },
    { icon: "shield", label: "Satisfaction rate", highlight: "98%" },
  ],
  refundPolicy: {
    title: "Refund Policy",
    subtitle: "Satisfaction guarantee terms",
    items: [
      {
        title: "30-Day Guarantee",
        body: "Full refund available within 30 days of an upgrade purchase. No questions asked.",
      },
      {
        title: "Request Procedure",
        body: "Email our support team with your account email and purchase date. We will confirm receipt and begin processing.",
      },
      {
        title: "Processing Timeline",
        body: "Refunds are typically processed within 5–7 business days. You will receive confirmation once complete.",
      },
    ],
  },
} as const
