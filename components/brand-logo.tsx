import Image from "next/image"
import { PRODUCT_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

type BrandLogoVariant = "icon" | "wordmark"

interface BrandLogoProps {
  variant?: BrandLogoVariant
  /** Pixel size for the icon variant (width = height). Ignored for wordmark. */
  size?: number
  /** Wordmark width in pixels. Height scales automatically. */
  width?: number
  className?: string
  priority?: boolean
}

const ICON_SRC = "/logo-icon.png"
/** Cache-bust so logo swaps show up immediately after asset replacement. */
const WORDMARK_SRC = "/logo.png?v=20260909b"

export function BrandLogo({
  variant = "icon",
  size = 40,
  width = 220,
  className,
  priority = false,
}: BrandLogoProps) {
  if (variant === "wordmark") {
    const height = Math.round(width * (342 / 1024))
    return (
      <Image
        src={WORDMARK_SRC}
        alt={PRODUCT_NAME}
        width={width}
        height={height}
        priority={priority}
        className={cn("h-auto w-auto object-contain", className)}
        style={{ width, height: "auto" }}
      />
    )
  }

  return (
    <Image
      src={ICON_SRC}
      alt={PRODUCT_NAME}
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  )
}
