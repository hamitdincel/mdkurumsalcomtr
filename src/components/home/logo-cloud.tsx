import Image from 'next/image'
import { Container, Section } from '@/components/shared/section'

type Reference = { id: string; name: string; logo: string; website: string | null }

/**
 * SECTION 02 — REFERANS LOGO BANDI
 *
 * Yalnızca yönetim panelinden eklenmiş GERÇEK müşteri logoları gösterilir.
 * Kayıt yoksa bölüm hiç render edilmez — sahte logo kullanılmaz.
 */
export function LogoCloud({ references }: { references: Reference[] }) {
  if (references.length === 0) return null

  // Marquee için liste iki kez basılır; 4'ten az logoda kaydırma yapılmaz.
  const shouldScroll = references.length >= 5
  const items = shouldScroll ? [...references, ...references] : references

  return (
    <Section spacing="sm" tone="raised" aria-label="Referanslarımız" className="border-y border-line">
      <Container>
        <p className="mb-8 text-center text-xs font-semibold tracking-[0.09em] text-ink-subtle uppercase">
          Birlikte çalıştığımız kurumlar
        </p>
      </Container>

      <div className={shouldScroll ? 'marquee-mask overflow-hidden' : ''}>
        <ul
          className={
            shouldScroll
              ? 'animate-marquee flex w-max items-center gap-14'
              : 'container-site flex flex-wrap items-center justify-center gap-x-14 gap-y-8'
          }
        >
          {items.map((reference, index) => (
            <li key={`${reference.id}-${index}`} className="shrink-0" aria-hidden={index >= references.length}>
              <Image
                src={reference.logo}
                alt={index < references.length ? reference.name : ''}
                width={140}
                height={44}
                className="h-9 w-auto max-w-36 object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
