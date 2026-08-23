import { env, hasTurnstile } from '@/config/env'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Cloudflare Turnstile doğrulaması (server-side).
 *
 * Anahtarlar tanımlı değilse doğrulama atlanır — bu yalnızca geliştirme
 * ortamı içindir. Production'da anahtarların tanımlı olması beklenir;
 * tanımsızsa uyarı log'lanır.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<{ success: boolean; reason?: string }> {
  if (!hasTurnstile) {
    if (env.NODE_ENV === 'production') {
      console.warn('[turnstile] Anahtarlar tanımlı değil — bot koruması devre dışı!')
    }
    return { success: true }
  }

  if (!token) {
    return { success: false, reason: 'Doğrulama tamamlanmadı.' }
  }

  try {
    const body = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY!,
      response: token,
    })
    if (remoteIp) body.append('remoteip', remoteIp)

    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // Doğrulama servisi yanıt vermezse istek sonsuza kadar beklemesin.
      signal: AbortSignal.timeout(8000),
    })

    const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] }

    if (!result.success) {
      console.warn('[turnstile] Doğrulama başarısız:', result['error-codes'])
      return { success: false, reason: 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.' }
    }

    return { success: true }
  } catch (error) {
    console.error('[turnstile] Doğrulama servisi hatası:', error)
    // Servis erişilemezse kullanıcı mağdur edilmez; diğer koruma katmanları
    // (honeypot + rate limit) devrede kalır.
    return { success: true }
  }
}
