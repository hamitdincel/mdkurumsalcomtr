import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * PROXY (Next.js 16'da `middleware` bu isimle kullanılır)
 * ---------------------------------------------------------------------------
 * 1) Canonical host zorlaması: www/non-www ikilisinden yalnızca biri yayında
 *    kalır, diğeri 301 ile yönlendirilir (SEO: içerik tekrarını önler).
 * 2) Admin route koruması: geçerli oturum yoksa /admin/login'e yönlendirilir.
 *
 * Edge runtime'da çalışır; bu nedenle burada veritabanı sorgusu yapılmaz.
 * Token doğrulaması `jose` ile (edge uyumlu) yapılır.
 * İçerik yönlendirmeleri (Redirect modeli) katalog sayfalarında ele alınır.
 */

const SESSION_COOKIE_PROD = '__Host-drone_session'
const SESSION_COOKIE_DEV = 'drone_session'

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token =
    request.cookies.get(SESSION_COOKIE_PROD)?.value ??
    request.cookies.get(SESSION_COOKIE_DEV)?.value

  if (!token) return false

  const secret = process.env.AUTH_SECRET
  if (!secret) return false

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // --- 1) Canonical host
  const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (canonicalUrl && process.env.NODE_ENV === 'production') {
    try {
      const canonicalHost = new URL(canonicalUrl).host
      const requestHost = request.headers.get('host')

      if (requestHost && canonicalHost && requestHost !== canonicalHost) {
        const target = new URL(request.url)
        target.host = canonicalHost
        target.protocol = 'https:'
        target.port = ''
        return NextResponse.redirect(target, 301)
      }
    } catch {
      // Geçersiz NEXT_PUBLIC_SITE_URL — yönlendirme yapılmaz.
    }
  }

  // --- 2) Admin koruması
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authenticated = await hasValidSession(request)

    if (!authenticated) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('devam', `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Oturumu olan kullanıcı login sayfasına giderse panele yönlendirilir.
  if (pathname === '/admin/login') {
    if (await hasValidSession(request)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Statik dosyalar ve görsel optimizasyonu hariç tüm istekler.
     */
    '/((?!_next/static|_next/image|favicon.ico|medya|gallery|uploads|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|webmanifest)$).*)',
  ],
}
