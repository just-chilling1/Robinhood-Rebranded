import { Newsreader, Source_Sans_3 } from "next/font/google"

export const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-loaded",
})

export const display = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-loaded",
  style: ["normal", "italic"],
})
