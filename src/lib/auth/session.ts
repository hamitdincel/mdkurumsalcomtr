import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { env, isProduction } from '@/config/env'

export const SESSION_COOKIE = '__Host-drone_session'
/** __Host- öneki secure + path=/ + domain'siz cookie gerektirir; HTTP'de çalışmaz. */
const COOKIE_NAME = isProduction ? SESSION_COOKIE : 'drone_session'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR' | 'SALES'
}

function getSecret(): Uint8Array {
  const secret = env.AUTH_SECRET
  if (!secret) {
    throw new Error(
      'AUTH_SECRET tanımlı değil. Admin oturumu açılamaz. .env dosyanızı kontrol edin.',
    )
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${env.AUTH_SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
    if (!payload.sub) return null

    return {
      id: payload.sub,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: (payload.role as SessionUser['role']) ?? 'EDITOR',
    }
  } catch {
    return null
  }
}

/** Oturum cookie'sini yazar. httpOnly + secure + sameSite=lax. */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: env.AUTH_SESSION_MAX_AGE,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
}

/** Aktif oturumu döner; oturum yoksa null. */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export { COOKIE_NAME as sessionCookieName }
