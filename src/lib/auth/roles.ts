/**
 * Rol tanımları ve etiketleri.
 * Bu dosya bilinçli olarak server-only bağımlılık içermez; client
 * bileşenleri (örn. panel kabuğu) buradan güvenle import edebilir.
 */

export type Role = 'ADMIN' | 'EDITOR' | 'SALES'

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Yönetici',
  EDITOR: 'Editör',
  SALES: 'Satış',
}

/** Rol → izin listesi. '*' tüm yetkileri kapsar. */
export const rolePermissions: Record<Role, string[]> = {
  ADMIN: ['*'],
  EDITOR: ['content:read', 'content:write', 'media:write', 'lead:read'],
  SALES: ['lead:read', 'lead:write', 'content:read'],
}

export function can(role: Role, permission: string): boolean {
  const granted = rolePermissions[role] ?? []
  return granted.includes('*') || granted.includes(permission)
}
