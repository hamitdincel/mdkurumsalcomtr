import * as React from 'react'
import { SectionNumber } from './technical'
import { cn } from '@/lib/utils'

/**
 * Yüzey tonu — sayfa ritmini kuran altı katman.
 *
 *   sunken : en girintili açık yüzey (liste/ızgara zemini)
 *   light  : sayfa zemini
 *   raised : yükseltilmiş panel bandı (üst kenarında ışık çizgisi taşır)
 *   brand  : marka tonlu accent
 *   dark   : graphite
 *   deep   : en koyu (teknoloji, final CTA)
 *
 * Ardışık iki bölüm aynı tonu kullanmaz; ton değişimi sayfanın "tek parça
 * beyaz" okunmasını engelleyen asıl araçtır.
 */
export type SectionTone = 'sunken' | 'light' | 'raised' | 'brand' | 'dark' | 'deep'

const toneMap: Record<SectionTone, string> = {
  sunken: 'section-sunken',
  light: 'bg-surface',
  raised: 'section-raised',
  brand: 'section-brand',
  dark: 'section-dark',
  deep: 'section-deep',
}

export function isDarkTone(tone?: SectionTone): boolean {
  return tone === 'dark' || tone === 'deep'
}

/**
 * TON RİTMİ — KALDIRILDI
 * ---------------------------------------------------------------------------
 * Burada `createToneRhythm()` adında, bölümlere sırayla ton dağıtan bir
 * yardımcı vardı. Kaldırıldı.
 *
 * Gerekçe: Ton değişimi bir ANLAM/VURGU aracıdır, ritim üretmek için
 * kullanılan bir dekorasyon değil. Otomatik dağıtım her bölüm sınırında
 * yüzey rengini değiştiriyordu; tonlar birbirine yakın olduğu için bu
 * "kasıtlı katman" değil "tutarsızlık" gibi okunuyor ve uzun sayfalarda
 * göz yoruyordu.
 *
 * YENİ KURAL: Bir sayfanın gövdesi büyük ölçüde TEK bir nötr yüzeyde ilerler.
 * Bölüm ayrımı önce whitespace ve başlık hiyerarşisiyle, gerekirse ince bir
 * ayraçla yapılır. Ardışık bölümlerin aynı tonu paylaşması normaldir.
 * Güçlü tonlar (brand / dark / deep) sayfada yalnızca birkaç kez, bilinçli
 * vurgu noktalarında elle yazılır.
 */

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Koyu tema bölümü (tone="dark" ile eşdeğer kısayol) */
  dark?: boolean
  tone?: SectionTone
  /** Dikey ritim — section-to-section görsel ritmin parçası */
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  as?: 'section' | 'div' | 'article' | 'aside'
}

/**
 * DİKEY RİTİM
 * ---------------------------------------------------------------------------
 * Dolgu bölümün İKİ yanına da uygulanır; iki komşu bölüm arasındaki boşluk bu
 * değerin İKİ KATIDIR.
 *
 * Masaüstünde komşu bölümler arası hedef mesafeler:
 *   md + md = 128px   ← standart okuma akışı
 *   lg + lg = 160px   ← vurgulu bölümler
 *
 * KURAL: `md` VARSAYILANDIR. Ana içerik bölümlerinin ÇOĞU `md` kullanır;
 * `lg` yalnızca gerçekten ana odak olan bölümler içindir. Her bölümü `lg`
 * yapmak hiyerarşiyi yok eder ve sayfayı "dev boşluklarla dolu" hale getirir.
 */
const spacingMap = {
  none: '',
  sm: 'py-8 md:py-10',
  md: 'py-10 md:py-16',
  lg: 'py-14 md:py-20',
  xl: 'py-16 md:py-24',
} as const

export function Section({
  className,
  dark,
  tone,
  spacing = 'md',
  as: Comp = 'section',
  children,
  ...props
}: SectionProps) {
  const resolvedTone: SectionTone | undefined = tone ?? (dark ? 'dark' : undefined)

  return (
    <Comp
      className={cn(spacingMap[spacing], resolvedTone && toneMap[resolvedTone], className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('container-site', className)} {...props}>
      {children}
    </div>
  )
}

type SectionHeaderProps = {
  eyebrow?: string
  /** "01 / HİZMETLER" biçiminde dekoratif bölüm numarası */
  number?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  dark?: boolean
  /** Başlık seviyesini bağlama göre ayarlar (SEO/erişilebilirlik) */
  as?: 'h1' | 'h2' | 'h3'
  /** Sinematik alanlarda akışkan büyük başlık ölçeği */
  size?: 'default' | 'display'
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({
  eyebrow,
  number,
  title,
  description,
  align = 'left',
  dark,
  as: Heading = 'h2',
  size = 'default',
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        // Satır düzeni `lg`'de başlar: 768px'te başlık + yan blok yan yana
        // sığmıyor ve yatay taşmaya yol açıyordu.
        action && 'lg:flex-row lg:items-end lg:justify-between lg:gap-10',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-4', align === 'center' && 'items-center')}>
        {number && (
          <SectionNumber
            number={number.split('/')[0]?.trim() ?? number}
            label={number.split('/')[1]?.trim() ?? ''}
          />
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Heading
          className={cn(
            'font-bold',
            size === 'display'
              ? 'text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[-0.03em]'
              : 'text-[2.125rem] leading-[1.08] md:text-5xl',
            dark ? 'text-ink-inverse' : 'text-ink',
            align === 'center' ? 'max-w-4xl' : 'max-w-3xl',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p
            className={cn(
              'text-lg leading-relaxed md:text-xl',
              dark ? 'text-ink-inverse-muted' : 'text-ink-muted',
              align === 'center' ? 'max-w-2xl' : 'max-w-xl',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full lg:w-auto lg:shrink-0">{action}</div>}
    </div>
  )
}
