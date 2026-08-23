import { cn } from '@/lib/utils'

/**
 * TEKNİK GÖRSEL DİL PRIMITIVE'LERİ
 * ---------------------------------------------------------------------------
 * Markanın "operasyon şirketi" hissini kuran dekoratif parçalar. Tamamı
 * aria-hidden'dır; hiçbiri anlam taşımaz, yalnızca kompozisyonu destekler.
 *
 * KURAL: Bir bölümde en fazla BİR ana dekoratif sistem + bir hafif doku
 * kullanılır (bkz. docs/tasarim-sistemi.txt § Background).
 */

/**
 * Bölüm numarası + adı: "01 / HİZMETLER". Başlık hiyerarşisini etkilemez.
 *
 * `onMedia`: YALNIZCA fotoğraf/video üstünde kullanılır ve BEYAZ basar.
 * Önce cyan (`signal`) kullanılıyordu; parlak gökyüzü içeren bir fotoğrafta
 * kontrast 1.98'e kadar düşüyordu. Fotoğrafın parlaklığı önceden bilinemez,
 * bu yüzden en güvenli renk beyazdır. Marka vurgusu CTA butonunda zaten var.
 */
export function SectionNumber({
  number,
  label,
  onMedia,
  className,
}: {
  number: string
  label: string
  onMedia?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        'tech-label flex items-center gap-2.5',
        onMedia ? 'text-ink-on-dark-muted' : 'text-ink-subtle',
        className,
      )}
    >
      <span className={onMedia ? 'text-ink-on-dark' : 'text-brand-600'}>{number}</span>
      <span aria-hidden className="h-px w-6 bg-current opacity-40" />
      <span>{label}</span>
    </p>
  )
}

/**
 * Küçük teknik etiket. `onMedia` kuralı SectionNumber ile aynıdır.
 */
export function SectionLabel({
  children,
  onMedia,
  className,
}: {
  children: React.ReactNode
  onMedia?: boolean
  className?: string
}) {
  return (
    <span
      className={cn('tech-label', onMedia ? 'text-ink-on-dark' : 'text-brand-600', className)}
    >
      {children}
    </span>
  )
}

/** Blueprint ızgara — koyu yüzeylerde teknik plan hissi. */
export function BlueprintBackground({
  className,
  opacity = 'opacity-60',
}: {
  className?: string
  opacity?: string
}) {
  return <div aria-hidden className={cn('blueprint-grid absolute inset-0', opacity, className)} />
}

/** Nokta matrisi — açık yüzeylerde çok hafif doku. */
export function DotMatrix({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('dot-matrix absolute inset-0 text-ink/[0.07]', className)}
    />
  )
}

/** Radyal marka ışığı — koyu bölümlerde derinlik. */
export function RadialLight({
  className,
  position = '50% 0%',
  color = 'rgba(17,85,240,0.22)',
  size = '70% 60%',
}: {
  className?: string
  position?: string
  color?: string
  size?: string
}) {
  return (
    <div
      aria-hidden
      className={cn('absolute inset-0', className)}
      style={{ background: `radial-gradient(${size} at ${position}, ${color}, transparent 68%)` }}
    />
  )
}

/** Köşe braketleri — bir görseli veya bloğu "hedeflenmiş" gösterir. */
export function CornerBrackets({
  className,
  tone = 'accent',
  size = 'md',
}: {
  className?: string
  tone?: 'accent' | 'light' | 'dark'
  size?: 'sm' | 'md'
}) {
  const color =
    tone === 'accent' ? 'border-brand-500' : tone === 'light' ? 'border-white/60' : 'border-ink/40'
  const dimension = size === 'sm' ? 'size-4' : 'size-7'

  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      <span className={cn('absolute top-0 left-0 border-t-2 border-l-2', color, dimension)} />
      <span className={cn('absolute top-0 right-0 border-t-2 border-r-2', color, dimension)} />
      <span className={cn('absolute bottom-0 left-0 border-b-2 border-l-2', color, dimension)} />
      <span className={cn('absolute right-0 bottom-0 border-b-2 border-r-2', color, dimension)} />
    </span>
  )
}

/**
 * Görsel üzerindeki teknik açıklama etiketi.
 * İçeriği çağıran belirler — buraya asla uydurma teknik değer yazılmaz.
 */
export function TechnicalAnnotation({
  children,
  className,
  align = 'left',
}: {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right'
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'tech-label pointer-events-none absolute flex items-center gap-2 text-white/70',
        className,
      )}
    >
      {align === 'right' && <span className="measure-line h-px w-10 opacity-60" />}
      <span className="border border-white/20 bg-scrim/40 px-2 py-1 backdrop-blur-sm">{children}</span>
      {align === 'left' && <span className="measure-line h-px w-10 opacity-60" />}
    </span>
  )
}

/** Yatay ölçüm çizgisi — bölüm başlangıçlarında ince teknik vurgu. */
export function MeasureRule({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'measure-line block h-px w-full',
        dark ? 'text-white/25' : 'text-ink/20',
        className,
      )}
    />
  )
}
