import type { MetadataRoute } from "next"
import { PRODUCT_NAME } from "@/lib/brand"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PRODUCT_NAME,
    short_name: PRODUCT_NAME,
    description: "AI-powered YouTube engagement tool",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F4F6F8",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
