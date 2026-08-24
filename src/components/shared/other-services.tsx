import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Container, Section, SectionHeader, type SectionTone } from './section'
import { Icon } from './icon'
import { MediaImage } from './media-image'
import { Reveal, RevealItem } from './reveal'
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
 * ÖNCE: fotoğrafsız, dört sütunlu, tıklanamayan bir madde listesiydi. Bloğun
 * düşük vurgulu tutulması bilinçli bir karardı (ana odak drone temizliği) ama
 * pratikte hizmetler görünmez kalıyordu: ne kapak görseli, ne detay sayfası,
 * ne de tıklanacak bir yüzey vardı.
 *
 * ŞİMDİ: her başlık kendi kapak görseli olan, tamamı tıklanabilir bir kart.
 * Kartlar detay sayfasındaki ilgili bölüme derin bağlantı verir
 * (/hizmetler/yeditepe-guvenlik#<id>). Vurgu dengesi kart SAYISI ve
 * KONUMUYLA korunur — blok hâlâ sayfanın sonunda ve dört kart ile sınırlı;
 * drone hizmetleri bento ızgarasında altı kartla ve sayfanın üstünde durur.
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

        <Reveal stagger className="mt-12">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherServiceGroups.map((group) => (
              <RevealItem as="li" key={group.id}>
                <article className="group panel relative flex h-full flex-col overflow-hidden rounded-md transition-colors duration-300 hover:border-line-strong">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
                    <MediaImage
                      src={group.image}
                      alt={group.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    {/* İkon rozeti görselin alt kenarına oturur, başlığa köprü kurar */}
                    <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-sm bg-paper text-brand-600 shadow-md">
                      <Icon name={group.icon} className="size-5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-base leading-snug font-semibold text-ink">
                      {/*
                        after:inset-0 kartın TAMAMINI tıklanabilir yapar; ayrıca
                        bir bağlantı katmanı eklenmez, böylece ekran okuyucuda
                        tek ve anlamlı bir bağlantı kalır.
                      */}
                      <Link
                        href={`/hizmetler/yeditepe-guvenlik#${group.id}`}
                        className="after:absolute after:inset-0"
                      >
                        {group.title}
                      </Link>
                    </h3>

                    <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">
                      {group.description}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-brand-600">
                      Detayları Gör
                      <ArrowUpRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </article>
              </RevealItem>
            ))}
          </ul>
        </Reveal>

        <Button asChild variant="secondary" size="md" className="mt-10">
          <Link href="/hizmetler/yeditepe-guvenlik">
            Tüm güvenlik hizmetlerini inceleyin
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </Container>
    </Section>
  )
}
