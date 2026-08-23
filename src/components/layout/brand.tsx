import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Marka kilidi.
 *
 * Logo yüklenmediğinde geçici wordmark gösterilir; panelden (Ayarlar > Logo)
 * görsel yüklendiğinde otomatik olarak devre dışı kalır.
 *
 * Boyutlandırma notu: Logolar genellikle simge + marka adı + alt açıklama
 * (tagline) barındıran dikey istifli kompozisyonlardır. Bu tür logolar 36-40px
 * yükseklikte okunmaz hale gelir; bu nedenle varsayılan yükseklik daha
 * yüksektir ve `size` ile bağlama göre ayarlanabilir.
 */
const logoSizes = {
  sm: 'h-10', // 40px — mobil header, kompakt durum
  md: 'h-13', // 52px — masaüstü header (varsayılan)
  lg: 'h-16', // 64px — footer
} as const

export function Brand({
  name,
  logo,
  dark,
  className,
  href = '/',
  size = 'md',
  priority,
  plate,
}: {
  name: string
  logo?: string | null
  dark?: boolean
  className?: string
  href?: string
  size?: keyof typeof logoSizes
  /** Yalnızca header'daki logo için true (LCP adayı). */
  priority?: boolean
  /**
     Koyu zeminde, logonun koyu renkli versiyonu yüklenmemişse arkasına açık bir
     plaka koyar. Panelden "Logo (koyu zemin)" yüklendiğinde bu gerekmez.
   */
  plate?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2.5 transition-opacity hover:opacity-80', className)}
      aria-label={`${name} — ana sayfa`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={name}
          /* Gerçek boyut CSS ile belirlenir; buradaki değerler yalnızca en-boy
             oranı ve indirilecek çözünürlük için referanstır. */
          width={320}
          height={160}
          sizes="(max-width: 768px) 160px, 260px"
          priority={priority}
          className={cn(
            'w-auto object-contain',
            logoSizes[size],
            plate && 'rounded-sm bg-white/92 px-2.5 py-1.5',
          )}
        />
      ) : (
        <>
          <BrandMark
            className={cn(
              'shrink-0',
              size === 'lg' ? 'size-10' : size === 'md' ? 'size-9' : 'size-8',
              dark ? 'text-white' : 'text-brand-500',
            )}
          />
          <span
            className={cn(
              'font-display leading-none font-bold tracking-tight',
              size === 'lg' ? 'text-xl' : 'text-[1.0625rem]',
              dark ? 'text-white' : 'text-ink',
            )}
          >
            {name}
          </span>
        </>
      )}
    </Link>
  )
}

/**
 * Geçici marka işareti: yukarı doğru bir uçuş hattı ve yüzey çizgisi.
 * Klişe "uçan drone ikonu" yerine soyut, mimari bir form kullanılır.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path
        d="M7 24L14 14L18.5 19L25 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <rect x="6" y="26" width="20" height="1.5" fill="currentColor" opacity="0.55" />
    </svg>
  )
}
