import { hash, verify } from '@node-rs/argon2'

/**
 * Argon2id parametreleri — OWASP Password Storage Cheat Sheet önerisi.
 * memoryCost 19 MiB, timeCost 2, parallelism 1.
 */
const options = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, options)
}

export async function verifyPassword(hashValue: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashValue, plain, options)
  } catch {
    return false
  }
}

/** Parola politikası — admin hesapları için minimum gereklilik. */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 10) return 'Parola en az 10 karakter olmalıdır.'
  if (!/[a-zçğıöşü]/.test(password)) return 'Parola en az bir küçük harf içermelidir.'
  if (!/[A-ZÇĞİÖŞÜ]/.test(password)) return 'Parola en az bir büyük harf içermelidir.'
  if (!/[0-9]/.test(password)) return 'Parola en az bir rakam içermelidir.'
  return null
}
