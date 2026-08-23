import { Container, Section, SectionHeader, type SectionTone } from './section'
import { referenceGroups } from '@/config/content'
import { cn } from '@/lib/utils'

/** Listedeki toplam kurum sayısı — metinde elle yazılmaz, listeden türetilir. */
export const referenceTotal = referenceGroups.reduce(
  (sum, group) => sum + group.institutions.length,
  0,
)

/**
 * REFERANSLAR
 * ---------------------------------------------------------------------------
 * Hizmet verilen kurumlar, sektöre göre gruplanmış düz metin listesi.
 *
 * Neden logo değil de isim?
 *   Kurum logolarının izinsiz kullanımı marka hakkı sorunudur. İsim listesi
 *   hem doğrulanabilir hem de logo temin edilmeden yayınlanabilir. Logolar
 *   temin edildikçe yönetim panelindeki "Referanslar" bölümünden eklenir ve
 *   ana sayfadaki logo bandı otomatik görünür hale gelir.
 *
 * Liste uzun olduğu için görsel ağırlık bilinçli olarak düşük tutulur:
 * küçük tipografi, çok sütunlu akış, kart yok.
 */
export function References({
  tone = 'light',
  /**
   * Kendi başlık bloğunu basar mı?
   * Referanslar sayfasında başlık zaten PageHero'da olduğu için kapatılır;
   * aksi halde aynı metin sayfada iki kez görünürdü.
   */
  withHeading = true,
  className,
}: {
  tone?: SectionTone
  withHeading?: boolean
  className?: string
}) {
  return (
    <Section spacing="md" tone={tone} className={className}>
      <Container>
        {withHeading && (
          <SectionHeader
            eyebrow="Referanslar"
            title="Hizmet verdiğimiz kurumlar"
            description={`Kamu kurumları, üniversiteler, hastaneler, plazalar ve sanayi tesisleri dâhil ${referenceTotal} kurumda hizmet verdik ve vermeye devam ediyoruz.`}
          />
        )}

        <div
          className={cn(
            'grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4',
            withHeading && 'mt-12',
          )}
        >
          {referenceGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3 border-t border-line pt-5">
              <h3 className="tech-label text-brand-600">{group.title}</h3>
              <ul className="flex flex-col gap-1.5">
                {group.institutions.map((institution) => (
                  <li key={institution} className="text-sm leading-snug text-ink-muted">
                    {institution}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
