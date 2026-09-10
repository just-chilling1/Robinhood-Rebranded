const PRODUCT_NAME = "Wifi Code"

export const brand = {
  productName: PRODUCT_NAME,
  storagePrefix: "wifi_code",
  tagline: "AI-Powered YouTube Engagement",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    type: "image" as "icon" | "image",
    icon: "Wifi",
    src: "/logo.png?v=20260909b",
    iconSrc: "/logo-icon.png",
    alt: PRODUCT_NAME,
    wordmark: true,
  },
  colors: {
    primary: "#0D9488",
    secondary: "#0F766E",
    promoAccent: "#0D9488",
    promoCta: "#0D9488",
    page: "#F8FAFC",
    sidebar: "#FFFFFF",
    panel: "#FFFFFF",
    authPage: "#F8FAFC",
    textHeading: "#040316",
    textPrimary: "#040316",
    textMuted: "#475569",
    panelGlass: "#FFFFFF",
    borderGlow: "rgba(4, 3, 22, 0.08)",
    borderTeal: "rgba(13, 148, 136, 0.22)",
    border: "rgba(4, 3, 22, 0.08)",
    encryptedGreen: "#0D9488",
    vaultGold: "#0D9488",
  },
  fonts: {
    brand: "Playfair Display",
    ui: "Inter",
  },
  get metadata() {
    return {
      title: `${PRODUCT_NAME} - AI-Powered YouTube Engagement Tool`,
      description:
        "Advanced AI system that finds trending YouTube Shorts and generates high-quality engagement comments for maximum reach.",
    }
  },
} as const

export type BrandConfig = typeof brand
