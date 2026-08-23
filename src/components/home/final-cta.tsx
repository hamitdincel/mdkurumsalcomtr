import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { TrackedLink } from '@/components/shared/tracked-link'
import { MediaImage } from '@/components/shared/media-image'
import { BlueprintBackground, RadialLight, SectionLabel } from '@/components/shared/technical'
import { whatsappUrl } from '@/config/site'
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon'

/**
 * SECTION 16 — FİNAL CTA
 *
 * Marka kapanışı: en koyu yüzey, arka planda düşük opaklıkta gerçek operasyon
 * fotoğrafı + blueprint + radyal marka ışığı. Footer ile birlikte tek bir
 * kapanış kompozisyonu oluşturur (aralarında ayraç yoktur).
 *
 * WhatsApp düğmesi yalnızca config'te numara tanımlıysa gösterilir.
 */
export function FinalCta({ whatsapp, image }: { whatsapp: string; image?: string | null }) {
  const hasWhatsapp = Boolean(whatsapp && whatsapp.replace(/\D/g, '').length >= 10)

  return (
    <Section tone="deep" spacing="lg" className="relative overflow-hidden">
      {image && (
        <div aria-hidden className="absolute inset-0 opacity-[0.18]">
          <MediaImage src={image} alt="" sizes="100vw" className="object-cover" />
        </div>
      )}
      <BlueprintBackground opacity="opacity-40" />
      <RadialLight position="25% 20%" color="rgba(17,85,240,0.26)" size="70% 70%" />

      <Container className="relative">
        <div className="flex max-w-4xl flex-col gap-8">
          <SectionLabel>Keşif Talebi</SectionLabel>

          <h2 className="text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink-inverse">
            Binanız için doğru temizlik yöntemini birlikte belirleyelim.
          </h2>

          <p className="max-w-xl text-lg leading-relaxed text-ink-inverse-muted">
            Keşif talebinizi iletin; cephenizi değerlendirip uygulanabilir bir plan ve şeffaf bir
            teklif hazırlayalım.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/teklif-al">
                Ücretsiz Keşif Talep Et
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>

            {hasWhatsapp && (
              <Button asChild size="lg" variant="secondary">
                <TrackedLink
                  href={whatsappUrl(undefined, whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="whatsapp_click"
                  eventParams={{ location: 'final_cta' }}
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp&apos;tan Yazın
                </TrackedLink>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
