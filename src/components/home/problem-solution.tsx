import { Container, Section } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { ImageReveal } from '@/components/shared/image-reveal'
import { SectionNumber, TechnicalAnnotation } from '@/components/shared/technical'
import { solutionAdvantages } from '@/config/content'
import { altFor } from '@/config/images'

/**
 * SECTION 03 — PROBLEM / ÇÖZÜM (editorial)
 *
 * Düzen kararları:
 *  - Solda büyük operasyon fotoğrafı (maske açılışlı).
 *  - Sağda güçlü başlık; avantajlar KART DEĞİL, üst çizgiyle ayrılan
 *    numaralı iki kolonlu özellik listesi.
 *
 * İçerik kuralı: "daha ucuz", "X kat hızlı" gibi doğrulanmamış finansal ya da
 * sayısal iddialar KULLANILMAZ.
 */
export function ProblemSolution({ image }: { image?: string | null }) {
  return (
    <Section spacing="md" tone="light">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          {/* --- Sol: operasyon fotoğrafı --- */}
          <Reveal variant="fade" className="relative">
            <ImageReveal
              src={image}
              alt={altFor(image, 'Yüksek bir yapının cephesinde yürütülen temizlik çalışması')}
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="aspect-[4/3] rounded-md md:aspect-[16/11]"
              placeholderLabel="Cephe çalışması görseli"
            />

            {/* Fotoğraf üzerinde çok minimal teknik açıklama */}
            <TechnicalAnnotation className="bottom-5 left-5" align="left">
              Saha Uygulaması
            </TechnicalAnnotation>

            <span
              aria-hidden
              className="absolute -right-3 -bottom-3 hidden size-24 border-r-2 border-b-2 border-brand-500 lg:block"
            />
          </Reveal>

          {/* --- Sağ: başlık + özellik listesi --- */}
          <div className="flex flex-col gap-10">
            <div>
              <SectionNumber number="00" label="PROBLEM / ÇÖZÜM" />
              <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
                Geleneksel yöntemlerin zorlandığı noktalar için modern çözüm.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                Yüksek yapılarda cephe temizliği; erişim, iş güvenliği ve zaman planlaması açısından
                ciddi hazırlık gerektirir. Drone destekli uygulama bu hazırlığın bir bölümünü
                sadeleştirerek operasyonu daha kontrollü hale getirmeyi hedefler.
              </p>
            </div>

            <Reveal stagger>
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {solutionAdvantages.map((advantage, index) => (
                  <RevealItem
                    as="li"
                    key={advantage.title}
                    className="flex flex-col gap-2 border-t border-line py-5"
                  >
                    <span className="tech-label text-brand-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-semibold text-ink">{advantage.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{advantage.description}</p>
                  </RevealItem>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
