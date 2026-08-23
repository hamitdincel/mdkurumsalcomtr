import { createHash } from 'node:crypto'
import { env } from '@/config/env'

/**
 * IP adresi ham olarak saklanmaz.
 * KVKK gereği veri minimizasyonu: yalnızca tuzlanmış, geri döndürülemez hash
 * saklanır ve spam denetimi için kullanılır.
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  const salt = env.AUTH_SECRET ?? 'fallback-salt'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** Rate limit anahtarları için genel amaçlı hash. */
export function hashKey(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 40)
}
