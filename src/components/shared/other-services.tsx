import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Container, Section, SectionHeader, type SectionTone } from './section'
import { Icon } from './icon'
import { Button } from '@/components/ui/button'
import { otherServiceGroups } from '@/config/content'
import { siteConfig } from '@/config/site'
import { toTelHref } from '@/lib/utils'

/**
 * DİĞER HİZMETLERİMİZ
 * ---------------------------------------------------------------------------
 * Grup çatısı altındaki tamamlayıcı hizmetler (özel güvenlik, elektronik
 * güvenlik, tesis yönetimi).
 *
 * TASARIM KARARI: Bu blok bilinçli olarak DÜŞÜK VURGULU tutulur. Sitenin ana
 * odağı drone destekli yüzey temizliğidir; bu yüzden burada fotoğraf, büyük
 * kart veya renkli vurgu kullanılmaz. Dört sütunlu sade bir liste, hizmetlerin
 * varlığını duyurur ama drone içeriğiyle görsel olarak yarışmaz.
 */
export function OtherServices({
  tone = 'raised',
  /** Ana sayfada bölüm numarası gösterilir, hizmetler sayfasında gösterilmez. */
  number,
  className,
}: {
  tone?: SectionTone
  number?: string
  className?: string
}) {
  const security = siteConfig.groupCompanies[0]

  return (
    <Section spacing="md" tone={tone} className={className}>
      <Container>
        <SectionHeader
          number={number}
          // Numara zaten "08 / GRUP HİZMETLERİ" biçiminde etiketi taşır;
          // ikisi birlikte kullanılırsa aynı metin iki kez görünür.
          eyebrow={number ? undefined : 'Grup Hizmetleri'}
          title="Diğer hizmetlerimiz"
          description="Drone destekli yüzey temizliği ana uzmanlık alanımız. Bunun yanında aynı yönetim ve denetim yapısı altında aşağıdaki hizmetleri de veriyoruz."
          action={
            /*
             * Güvenlik hizmetlerinin ayrı bir tüzel kişilik tarafından
             * verildiği bilgisi BAŞLIKLA BİRLİKTE verilir. Bölümün en altında
             * dururken listeye ait bir dipnot gibi görünüyor ve bağlamı
             * kayboluyordu; burada başlığın karşılığı olarak okunuyor.
             */
            <div className="panel flex w-full flex-col gap-3 rounded-md p-5 lg:max-w-sm">
              <div className="flex items-center gap-3">
                {/* Açık levha: logonun koyu gövdesi koyu temada zemine karışmasın */}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-paper p-1">
                  <Image
                    src={security.logo}
                    alt={`${security.brand} logosu`}
                    width={44}
                    height={44}
                    className="size-full object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{security.brand}</p>
                  <p className="truncate text-xs text-ink-subtle">{security.name}</p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-ink-muted">
                Özel güvenlik ve elektronik güvenlik hizmetleri grup bünyesindeki bu şirket
                tarafından, 5188 sayılı kanun kapsamında verilir.
              </p>

              <a
                href={`tel:${toTelHref(security.phone)}`}
                className="text-sm font-medium text-brand-600 underline-offset-4 hover:underline"
              >
                {security.phone}
              </a>
            </div>
          }
        />

        <Button asChild variant="secondary" size="md" className="mt-8">
          <Link href="/iletisim">
            Bu hizmetler için bize ulaşın
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {otherServiceGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4 border-t border-line pt-6">
              <span className="flex size-10 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
                <Icon name={group.icon} className="size-5" />
              </span>

              <div className="flex flex-col gap-2">
                <h3 className="text-base leading-snug font-semibold text-ink">{group.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{group.description}</p>
              </div>

              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden />
                    <span>{item}</span>
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
