import 'server-only'
import { redirect } from 'next/navigation'
import { getSession, type SessionUser } from './session'
import { can, type Role } from './roles'

export type { Role } from './roles'
export { can, roleLabels } from './roles'

/**
 * Server Component / Server Action içinde oturum zorunluluğu.
 * Oturum yoksa login sayfasına yönlendirir.
 */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

/** Belirli bir yetki gerektiren sayfalar için. */
export async function requirePermission(permission: string): Promise<SessionUser> {
  const session = await requireSession()
  if (!can(session.role as Role, permission)) {
    redirect('/admin/dashboard?hata=yetkisiz')
  }
  return session
}

/** Server Action içinde yetki kontrolü — yönlendirme yerine hata döner. */
export async function checkPermission(
  permission: string,
): Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }> {
  const session = await getSession()
  if (!session) return { ok: false, error: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.' }
  if (!can(session.role as Role, permission)) {
    return { ok: false, error: 'Bu işlem için yetkiniz bulunmuyor.' }
  }
  return { ok: true, user: session }
}
