import { Badge } from '@/components/ui/badge'
import type { LeadStatus } from '@prisma/client'

/** Satış hunisi durumları — tek noktadan etiket ve renk eşlemesi. */
export const leadStatusConfig: Record<
  LeadStatus,
  { label: string; tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  NEW: { label: 'Yeni', tone: 'brand' },
  CONTACTED: { label: 'Görüşüldü', tone: 'info' },
  DISCOVERY_SCHEDULED: { label: 'Keşif Planlandı', tone: 'warning' },
  OFFER_SENT: { label: 'Teklif Verildi', tone: 'warning' },
  WON: { label: 'Kazanıldı', tone: 'success' },
  LOST: { label: 'Kaybedildi', tone: 'neutral' },
  SPAM: { label: 'Spam', tone: 'danger' },
}

export const leadStatusOrder: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'DISCOVERY_SCHEDULED',
  'OFFER_SENT',
  'WON',
  'LOST',
  'SPAM',
]

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = leadStatusConfig[status]
  return <Badge tone={config.tone}>{config.label}</Badge>
}
