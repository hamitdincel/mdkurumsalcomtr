import { Breadcrumb, type Crumb } from './breadcrumb'
import { Container } from './section'
import { MediaImage } from './media-image'
import { MediaScrim } from './media-scrim'
import {
  BlueprintBackground,
  RadialLight,
  SectionLabel,
} from './technical'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  eyebrow?: string
  title: string
  description?: string
  crumbs: Crumb[]
  image?: string | null
  children?: React.ReactNode
  /**
   * media   : sinematik koyu hero (hizmet, sektör, proje detayları)
   * default : editorial açık başlık bloğu (liste ve hukuki sayfalar)
   */
  variant?: 'default' | 'media'
  /** Sağ üstte gösterilecek meta bilgi (yalnızca gerçek veri) */
  meta?: { label: string; value: string }[]
  className?: string
}

/**
 * İÇ SAYFA BAŞLIK BLOĞU
 *
 * Her iki varyant da ana sayfayla aynı görsel dili kullanır: teknik etiket,
 * akışkan büyük başlık ve ölçüm/köşe motifleri. Generic "gri şerit + başlık"
 * görünümü bilinçli olarak terk edilmiştir.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  children,
  variant = 'default',
  meta,
  className,
}: PageHeroProps) {
  if (variant === 'media') {
    return (
      <section
        className={cn(
          'relative isolate flex min-h-[46svh] flex-col justify-end overflow-hidden bg-onyx md:min-h-[54svh]',
          className,
        )}
      >
        <div className="absolute inset-0 -z-10">
          {image ? (
            <MediaImage src={image} alt="" priority sizes="100vw" className="object-cover" />
          ) : (
            <>
              <BlueprintBackground opacity="opacity-60" />
              <RadialLight position="80% 10%" color="rgba(17,85,240,0.25)" />
            </>
          )}
          <MediaScrim variant="hero" />
        </div>

        <Container className="relative pt-28 pb-10 md:pt-32 md:pb-14">
          <Breadcrumb items={crumbs} dark className="mb-8" />

          {eyebrow && <SectionLabel onMedia>{eyebrow}</SectionLabel>}

          <h1 className="mt-5 max-w-4xl text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-white">
            {title}
          </h1>

          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-on-dark-muted">
              {description}
            </p>
          )}

          {meta && meta.length > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line-on-dark pt-6">
              {meta.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="tech-label text-white/50">{item.label}</dt>
                  <dd className="text-sm font-medium text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {children && <div className="mt-9">{children}</div>}
        </Container>
      </section>
    )
  }

  /*
   * Editorial varyant: fotoğrafı olmayan liste ve hukuki sayfaların başlığı.
   *
   * SADELEŞTİRİLDİ. Önce marka tonlu gradyan + teknik ızgara dokusu + radyal
   * marka ışığı + alt kenarda marka hattı birlikte kullanılıyordu; dört
   * dekoratif katman, içeriği (başlık + açıklama) bastırıyordu.
   * Artık nötr yüzey + tek bir alt ayraç. Hiyerarşiyi tipografi kuruyor.
   */
  return (
    <section className={cn('border-b border-line bg-surface', className)}>
      <Container className="py-10 md:py-14">
        <Breadcrumb items={crumbs} className="mb-8" />

        {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}

        <h1 className="mt-5 max-w-4xl text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
          {title}
        </h1>

        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{description}</p>
        )}

        {meta && meta.length > 0 && (
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="tech-label text-ink-subtle">{item.label}</dt>
                <dd className="text-sm font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children && <div className="mt-9">{children}</div>}
      </Container>
    </section>
  )
}
