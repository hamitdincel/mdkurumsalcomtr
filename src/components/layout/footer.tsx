import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin, Phone, Clock, Code2, ArrowUpRight } from 'lucide-react'
import { Brand } from './brand'
import { CookiePreferencesButton } from '@/components/analytics/cookie-consent'
import { TrackedLink } from '@/components/shared/tracked-link'
import { footerNav, legalNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { siteImages } from '@/config/images'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { toTelHref } from '@/lib/utils'
import type { ResolvedSettings } from '@/services/settings-service'

type FooterProps = {
  settings: ResolvedSettings
  services: { title: string; slug: string }[]
  hasAnalytics: boolean
}

export function Footer({ settings, services, hasAnalytics }: FooterProps) {
  const year = new Date().getFullYear()
  const address = settings.address

  return (
    /*
      Footer, final CTA ile aynı yüzey tonunu kullanır ve aralarında ayraç
      yoktur: ikisi birlikte tek bir kapanış kompozisyonu oluşturur.
    */
    <footer className="section-deep grain no-print relative overflow-hidden">
      {/* Üst kenarda marka hattı — footer'ı önceki bölümden keskin ayırır */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent"
      />
      {/* Çok hafif koordinat dokusu */}
      <div aria-hidden className="dot-matrix absolute inset-0 text-ink/[0.06]" />
      {/* Alttan yükselen marka ışığı — düz siyah bloğu kırar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-80"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgba(17,85,240,0.16), transparent 70%)',
        }}
      />

      <div className="container-site relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-10">
          {/* Marka */}
          <div className="flex flex-col gap-5">
            <Brand
              name={settings.brandName}
              logo={settings.logoDark ?? settings.logoLight}
              dark
              size="lg"
              // Koyu zemine uygun logo yüklenmediyse okunabilirlik için plaka kullanılır.
              plate={!settings.logoDark && Boolean(settings.logoLight)}
            />
            <p className="max-w-sm text-sm leading-relaxed text-ink-inverse-muted">
              {settings.tagline}
            </p>

            {settings.social.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {settings.social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex min-h-11 items-center rounded-sm border border-line-inverse px-3.5 text-sm text-ink-inverse-muted transition-colors hover:border-line-inverse hover:text-ink-inverse"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hizmetler */}
          <FooterColumn title="Hizmetler">
            {services.slice(0, 6).map((service) => (
              <FooterLink key={service.slug} href={`/hizmetler/${service.slug}`}>
                {service.title}
              </FooterLink>
            ))}
            <FooterLink href="/hizmetler">Tüm Hizmetler</FooterLink>
          </FooterColumn>

          {/* Kurumsal + Çalışmalar */}
          {footerNav.slice(1).map((group) => (
            <FooterColumn key={group.title} title={group.title}>
              {group.items.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>
          ))}
        </div>

        {/* İletişim bloğu */}
        <div className="mt-14 grid gap-6 border-t border-line-inverse pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <ContactItem icon={<Phone className="size-4" aria-hidden />} label="Telefon">
            <TrackedLink
              href={`tel:${toTelHref(settings.phone)}`}
              event="phone_click"
              eventParams={{ location: 'footer' }}
              className="transition-colors hover:text-ink-inverse"
            >
              {settings.phone}
            </TrackedLink>
          </ContactItem>

          <ContactItem icon={<Mail className="size-4" aria-hidden />} label="E-posta">
            <TrackedLink
              href={`mailto:${settings.email}`}
              event="email_click"
              eventParams={{ location: 'footer' }}
              className="break-all transition-colors hover:text-ink-inverse"
            >
              {settings.email}
            </TrackedLink>
          </ContactItem>

          {settings.hasAddress && (
            <ContactItem icon={<MapPin className="size-4" aria-hidden />} label="Adres">
              <address className="not-italic">
                {address.street}
                <br />
                {[address.postalCode, address.district, address.city].filter(Boolean).join(' ')}
              </address>
            </ContactItem>
          )}

          {settings.workingHours && (
            <ContactItem icon={<Clock className="size-4" aria-hidden />} label="Çalışma Saatleri">
              {settings.workingHours}
            </ContactItem>
          )}

          {/*
            Geliştirici künyesi. Alt bardan buraya alındı: alt bar telif +
            görünüm seçici + dört yasal bağlantıyla zaten kalabalıktı, künye
            orada satır sonuna sıkışıyordu. İletişim ızgarasının son hücresinde
            adresin sağında duruyor ve komşularından bir kademe büyük.
            Izgarada son sırada: çalışma saatleri girilirse iş bilgisi önce gelir.
          */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-ink-inverse-muted/70 uppercase">
              <Code2 className="size-4" aria-hidden />
              Yazılım
            </span>
            {/*
              Düz metin olarak durduğunda komşularından büyük ve koyu olması
              hata gibi görünüyordu: boyutu haklı çıkaran bir kimlik yoktu.
              Logo + ad + alan adı üçlüsü, boyutu gerekçelendiren küçük bir
              marka kilidi kuruyor; ok işareti sitenin geri kalanında kullanılan
              dış bağlantı işaretiyle aynı.

              Dış bağlantı: yeni sekme + rel="noreferrer" (opener sızıntısı).
            */}
            <a
              href={siteConfig.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2.5"
            >
              {/*
                `unoptimized`: kaynak bir SVG. next/image optimizasyon hattı
                SVG'yi varsayılan olarak reddeder; bu bayrakla dosya /public'ten
                doğrudan servis edilir ve `dangerouslyAllowSVG` açmak gerekmez.
              */}
              <Image
                src={siteImages.hdYazilimLogo}
                alt=""
                width={36}
                height={36}
                unoptimized
                className="size-9 shrink-0 transition-transform duration-200 group-hover:scale-105"
              />

              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-ink-inverse transition-colors group-hover:text-brand-500">
                  {siteConfig.developer.name}
                </span>
                <span className="text-xs text-ink-inverse-muted">
                  {siteConfig.developer.domain}
                </span>
              </span>

              <ArrowUpRight
                aria-hidden
                className="size-3.5 shrink-0 text-ink-inverse-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500"
              />
            </a>
          </div>
        </div>

        {/* Alt bar */}
        <div className="mt-12 flex flex-col gap-5 border-t border-line-inverse pt-8 text-sm text-ink-inverse-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.brandName}. Tüm hakları saklıdır.
            {siteConfig.legalName && !siteConfig.legalName.startsWith('TODO') && (
              <span className="ml-1 opacity-70">{siteConfig.legalName}</span>
            )}
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li className="flex items-center gap-2.5">
              <span className="text-ink-inverse-muted">Görünüm</span>
              {/* Footer artık temayla döndüğü için seçici de standart yüzey
                  token'larını kullanır; `inverse` tonu beyaz zeminde kaybolurdu. */}
              <ThemeToggle />
            </li>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="underline-offset-4 transition-colors hover:text-ink-inverse hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {hasAnalytics && (
              <li>
                <CookiePreferencesButton />
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold tracking-[0.09em] text-ink-inverse uppercase">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-ink-inverse-muted underline-offset-4 transition-colors hover:text-ink-inverse hover:underline"
      >
        {children}
      </Link>
    </li>
  )
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-ink-inverse-muted/70 uppercase">
        {icon}
        {label}
      </span>
      <div className="text-sm leading-relaxed text-ink-inverse-muted">{children}</div>
    </div>
  )
}
