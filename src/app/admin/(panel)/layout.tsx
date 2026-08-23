import { requireSession } from '@/lib/auth/guard'
import { getLeadStats } from '@/repositories/lead-repository'
import { AdminShell } from '@/components/admin/admin-shell'

/**
 * Korumalı panel layout'u.
 * Middleware zaten token kontrolü yapar; burada ikinci kez (defense in depth)
 * sunucu tarafında oturum doğrulanır.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const stats = await getLeadStats()

  return (
    <AdminShell
      user={{ name: session.name, email: session.email, role: session.role }}
      unreadLeads={stats.unread}
    >
      {children}
    </AdminShell>
  )
}
