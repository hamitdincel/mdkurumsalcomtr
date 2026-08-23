import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'
import Image from 'next/image'
import { getSettings } from '@/services/settings-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { MeasureRule } from '@/components/shared/technical'
import { StatsSection } from '@/components/home/stats-section'
import { WhyUs } from '@/components/home/why-us'
import { workPrinciples, auditRhythm } from '@/config/content'
import { siteConfig } from '@/config/site'

export const revalidate = 900

const crumbs = [{ label: 'Hakkımızda', href: '/hakkimizda' }]

export const metadata: Metadata = buildMetadata({
  title: 'Hakkımızda — Kurumsal Yapımız ve Çalışma Prensiplerimiz',
  description:
    'MD Kurumsal; drone destekli yüksek yapı temizliği, özel güvenlik ve tesis yönetimi hizmetleri verir. Çalışma prensiplerimiz, denetim yaklaşımımız ve kurumsal yapımız.',
  path: '/hakkimizda',
})

/**
 * HAKKIMIZDA
 * ---------------------------------------------------------------------------
 * Sayfanın kapsamı bilinçli olarak dardır: BU ŞİRKETİN KİM OLDUĞU.
 *
 * Bilerek burada YER ALMAYANLAR:
 *   - Uygulama süreci ("5 adımda operasyon") → hizmet sayfalarına aittir
 *   - Keşif talebi CTA'sı → dönüşüm sayfası /teklif-al
 *   - Hizmet listeleri → /hizmetler
 * Bir kurumsal tanıtım sayfası, satış akışının değil kurumun anlatısıdır.
 */
export default async function AboutPage() {
  const settings = await getSettings()
  const security = siteConfig.groupCompanies[0]

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Kurumsal"
        title="Yüksekte çalışmayı daha kontrollü hale getiriyoruz"
        description="Cephe temizliğinde amacımız yalnızca yüzeyi temizlemek değil; operasyonu güvenli, planlı ve tekrarlanabilir bir sürece dönüştürmek."
        crumbs={crumbs}
      />

      {/* --- 01 Yaklaşım: asimetrik editöryel blok --------------------------- */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
            <SectionHeader
              number="01 / YAKLAŞIM"
              title="Standart paket değil, yapıya özel plan"
              className="lg:sticky lg:top-28 lg:self-start"
            />

            <div className="prose-site">
              <p>
                Yüksek yapılarda cephe temizliği; erişim yöntemi, yüzey malzemesi, hava koşulları ve
                binanın kullanım şekli gibi birbirinden bağımsız birçok değişkeni aynı anda yönetmeyi
                gerektirir. Bu değişkenler her yapıda farklı olduğu için tek bir standart yöntem
                uygulamıyoruz.
              </p>
              <p>
                Süreç, yapının yerinde değerlendirilmesiyle başlar. Cephedeki malzemeleri, kirlilik
                türünü ve erişim koşullarını inceleyip uygulanabilir bir plan çıkarıyoruz.
                Uygulamanın mümkün olmadığı ya da başka bir yöntemin daha doğru olduğu durumlarda
                bunu açıkça belirtiyoruz.
              </p>

              <h2>İş güvenliği</h2>
              <p>
                Yüksekte çalışma, sektörün en yüksek riskli faaliyet alanlarından biridir. Drone
                destekli uygulamanın temel motivasyonu, personelin yüksekte geçirdiği süreyi
                azaltmaktır. Bunun yanında çalışma alanı güvenliği, yönlendirme ve bilgilendirme
                planı her operasyonun ayrılmaz parçasıdır.
              </p>

              <h2>Şeffaflık</h2>
              <p>
                Teklifte kapsamın ne olduğunu, hangi işlerin dahil olduğunu ve sürecin nasıl
                ilerleyeceğini açıkça belirtiyoruz. Uygulama sonrası sonucu birlikte kontrol ediyor,
                gerekli noktalarda düzeltme yapıyoruz.
              </p>

              {siteConfig.company.foundedYear && (
                <p>
                  Şirketimiz {siteConfig.company.foundedYear} yılından bu yana faaliyet
                  göstermektedir.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 02 Kurumsal yapı ------------------------------------------------ */}
      <Section spacing="md" tone="raised">
        <Container>
          <SectionHeader
            number="02 / KURUMSAL YAPI"
            title="Tek yönetim, iki uzmanlık alanı"
            description="Yüzey temizliği ve güvenlik hizmetleri ayrı ekiplerle yürütülür; planlama, denetim ve raporlama aynı merkezden yönetilir."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="panel flex flex-col gap-5 rounded-md p-7">
              {/*
                Her iki kart da logoyu aynı ölçüde açık levha üzerinde gösterir.
                Levha gereklidir: logolar koyu gövdeli olduğu için koyu temada
                kart zeminine karışırlardı.
              */}
              <span className="flex h-16 w-fit min-w-16 items-center justify-center rounded-sm bg-paper px-3 py-2">
                {settings.logoLight ? (
                  <Image
                    src={settings.logoLight}
                    alt={`${settings.brandName} logosu`}
                    width={140}
                    height={48}
                    className="h-full w-auto max-w-36 object-contain"
                  />
                ) : (
                  <Building2 className="size-6 text-brand-600" aria-hidden />
                )}
              </span>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-ink">{settings.brandName}</h3>
                <p className="text-xs text-ink-subtle">Yüzey temizliği ve tesis hizmetleri</p>
              </div>

              <p className="text-sm leading-relaxed text-ink-muted">
                Drone destekli dış cephe, cam yüzey, güneş paneli ve çatı temizliği ile bina/tesis
                yönetimi ve genel temizlik hizmetleri.
              </p>

              <Link
                href="/hizmetler"
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
              >
                Hizmetleri inceleyin
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </article>

            <article className="panel flex flex-col gap-5 rounded-md p-7">
              {/*
                Logo saydam zeminli ama gövdesi siyah; koyu temada kart zeminine
                karışmaması için her zaman açık bir levha üzerinde durur.
              */}
              <span className="flex h-16 w-fit items-center justify-center rounded-sm bg-paper px-3 py-2">
                <Image
                  src={security.logo}
                  alt={`${security.brand} logosu`}
                  width={64}
                  height={64}
                  className="h-full w-auto object-contain"
                />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-ink">{security.brand}</h3>
                <p className="text-xs text-ink-subtle">{security.name}</p>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                5188 sayılı Özel Güvenlik Hizmetlerine Dair Kanun kapsamında{' '}
                {security.scope.toLowerCase()}.
              </p>
              <p className="mt-auto text-sm text-ink-subtle">
                {security.address}
                <a
                  href={`tel:${security.phoneRaw}`}
                  className="mt-1 block font-medium text-brand-600 hover:underline"
                >
                  {security.phone}
                </a>
              </p>
            </article>
          </div>
        </Container>
      </Section>

      {/* --- 03 Çalışma prensipleri: numaralı editöryel liste ---------------- */}
      <Section spacing="md" tone="light">
        <Container>
          <SectionHeader
            number="03 / PRENSİPLER"
            title="Çalışma prensiplerimiz"
            description="Hizmet sözleşmesi öncesinde ve süresince uyduğumuz beş temel kural."
          />

          <Reveal stagger className="mt-12">
            <ol className="grid gap-x-12 md:grid-cols-2">
              {workPrinciples.map((principle, index) => (
                <RevealItem
                  as="li"
                  key={principle.title}
                  className="flex flex-col gap-2.5 border-t border-line py-6"
                >
                  <span className="tech-label text-brand-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base leading-snug font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{principle.description}</p>
                </RevealItem>
              ))}
            </ol>
          </Reveal>
        </Container>
      </Section>

      {/* --- 04 Denetim ritmi ------------------------------------------------ */}
      <Section spacing="md" tone="deep">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
            <SectionHeader
              number="04 / DENETİM"
              title="Denetim, işin bittiği yerde başlamaz"
              description="Hizmet kalitesi tek seferlik bir kontrolle değil, tekrarlayan ve önceden bildirilmeyen denetimlerle ölçülür."
              className="lg:sticky lg:top-28 lg:self-start"
            />

            <ul className="flex flex-col">
              {auditRhythm.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col gap-1.5 border-t border-line-inverse py-6 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <span className="tech-label shrink-0 text-brand-600 sm:w-44">{item.label}</span>
                  <span className="text-sm leading-relaxed text-ink-inverse-muted">
                    {item.detail}
                  </span>
                </li>
              ))}
              <li aria-hidden>
                <MeasureRule />
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* --- 05 Neden biz (mevcut bileşen) ----------------------------------- */}
      <WhyUs brandName={settings.brandName} />

      {/* İstatistikler yalnızca panelden gerçek veri girildiyse görünür */}
      <StatsSection stats={settings.stats} />
    </>
  )
}
