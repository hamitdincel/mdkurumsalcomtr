import { Container, Section } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { SectionNumber } from '@/components/shared/technical'
import { whyUsItems } from '@/config/content'
import { siteConfig } from '@/config/site'

/**
 * SECTION 11 — NEDEN MD KURUMSAL (marka manifestosu)
 *
 * İkon kartı yığını yerine manifesto düzeni: solda büyük ifade, sağda
 * numaralı prensip listesi (alt çizgiyle ayrılır). Arka planda çok hafif
 * monogram; dekoratif olduğu için ekran okuyucudan gizli.
 *
 * Sertifika/yetki şeridi yalnızca site config'te gerçek belge tanımlıysa
 * görünür — boş kutu veya uydurma belge gösterilmez.
 */
export function WhyUs({ brandName }: { brandName: string }) {
  const certifications = siteConfig.company.certifications
  const licenses = siteConfig.company.licenses
  const monogram = brandName.slice(0, 2).toUpperCase()

  return (
    <Section tone="raised" spacing="md" className="relative overflow-hidden border-y border-line">
      {/* Dev monogram — dekoratif */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-10 hidden font-display text-[20rem] leading-none font-extrabold text-ink/[0.025] select-none lg:block"
      >
        {monogram}
      </span>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionNumber number="06" label={`NEDEN ${brandName.toUpperCase()}`} />

            <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
              Çalışma biçimimiz, sonucun kendisi kadar önemli.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              Teklif aşamasından teslime kadar süreci şeffaf yürütüyoruz. Her adımda ne yapıldığını
              ve neden yapıldığını paylaşıyoruz.
            </p>
          </div>

          <Reveal stagger>
            <ul className="flex flex-col">
              {whyUsItems.map((item, index) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  className="flex gap-6 border-b border-line py-6 first:border-t"
                >
                  <span className="tech-label mt-1 shrink-0 text-brand-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="max-w-lg text-base leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </div>

        {(certifications.length > 0 || licenses.length > 0) && (
          <div className="mt-16 border-t border-line pt-10">
            <p className="tech-label text-ink-subtle">Belgeler ve Yetkiler</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {licenses.map((license) => (
                <li
                  key={license}
                  className="rounded-sm border border-line px-4 py-2.5 text-sm text-ink-muted"
                >
                  {license}
                </li>
              ))}
              {certifications.map((certification) => (
                <li
                  key={certification.name}
                  className="rounded-sm border border-line px-4 py-2.5 text-sm text-ink-muted"
                >
                  <span className="font-medium text-ink">{certification.name}</span>
                  <span className="ml-2 text-ink-subtle">{certification.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  )
}
