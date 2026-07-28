import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 removed support for `eslint` config here; use `next lint` instead.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Keep the MaxMind country DB on disk (not bundled into a broken webpack chunk).
  serverExternalPackages: ["geoip-country"],
  // Prevent Turbopack from inferring the wrong workspace root and trying to scan /Users/.../Desktop.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
