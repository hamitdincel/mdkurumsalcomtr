import {
  BadgeCheck,
  Building,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Factory,
  FileText,
  FolderKanban,
  GraduationCap,
  HardHat,
  HeartPulse,
  HelpCircle,
  Home,
  Hotel,
  Images,
  Inbox,
  Landmark,
  Layers,
  LayoutDashboard,
  Move3d,
  PanelsTopLeft,
  Quote,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
  Timer,
  Users,
  Warehouse,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Veritabanından/config'ten string olarak gelen ikon adlarını çözer.
 * Tüm ikonları dinamik import etmek yerine sabit bir set kullanılır —
 * bundle boyutu kontrol altında kalır.
 */
const iconMap: Record<string, LucideIcon> = {
  BadgeCheck,
  Building,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Factory,
  FileText,
  FolderKanban,
  GraduationCap,
  HardHat,
  HeartPulse,
  HelpCircle,
  Home,
  Hotel,
  Images,
  Inbox,
  Landmark,
  Layers,
  LayoutDashboard,
  Move3d,
  PanelsTopLeft,
  Quote,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
  Timer,
  Users,
  Warehouse,
  Workflow,
  Wrench,
  Zap,
}

export function Icon({
  name,
  className,
  fallback = 'Layers',
}: {
  name: string | null | undefined
  className?: string
  fallback?: keyof typeof iconMap
}) {
  const Component = (name && iconMap[name]) || iconMap[fallback] || Layers
  return <Component className={className} aria-hidden />
}

export function hasIcon(name: string | null | undefined): boolean {
  return Boolean(name && iconMap[name])
}
