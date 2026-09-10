import { Inter, Playfair_Display } from "next/font/google"

/** Wifi Code UI stack — Inter (body) + Playfair Display (headings). */
export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})
