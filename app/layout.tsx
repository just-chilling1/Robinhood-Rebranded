import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { PRODUCT_NAME } from "@/lib/brand"
import { display, sans } from "@/lib/fonts"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#eef3f8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} - AI-Powered YouTube Engagement Tool`,
  description: "Advanced AI system that finds trending YouTube Shorts and generates high-quality engagement comments for maximum reach.",
  generator: "v0.app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: PRODUCT_NAME,
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} light`} style={{ colorScheme: "light" }}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
