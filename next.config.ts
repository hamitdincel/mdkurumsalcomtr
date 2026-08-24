import type { NextConfig } from 'next'

/**
 * Görsel CDN host'ları .env üzerinden yönetilir (R2 / S3 / özel CDN).
 * Örn: NEXT_PUBLIC_MEDIA_HOSTNAMES="cdn.example.com,pub-xxx.r2.dev"
 */
const remoteHostnames = (process.env.NEXT_PUBLIC_MEDIA_HOSTNAMES ?? '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean)

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
  // Not: Lint, build'den bağımsız bir CI adımı olarak `npm run lint` ile koşar.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: remoteHostnames.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverActions: {
      // Medya yüklemesi bir server action üzerinden yapılıyor ve action gövdesi
      // varsayılan olarak 1 MB ile sınırlı. Sınır aşılınca Next 413/500 döner,
      // action promise'i reject olur ve arayüzde hiçbir şey olmamış gibi görünür.
      // MAX_UPLOAD_BYTES 15 MB; multipart boundary/başlık payı için 16 MB.
      bodySizeLimit: '16mb',
    },
  },
}

export default nextConfig
