import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  Upload,
  Play,
  Headphones,
  Gem,
  Sparkles,
  Zap,
  ShieldCheck,
  FileText,
  BookOpen,
  Package,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import type { NavIconName } from "@/config/navigation.config"

export const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  LayoutDashboard,
  Brain,
  FolderOpen,
  Upload,
  Play,
  Headphones,
  Gem,
  Sparkles,
  Zap,
  ShieldCheck,
  FileText,
  BookOpen,
  Package,
}

export const OFFER_ICONS = {
  UserPlus,
  Play,
  Wallet,
} as const
