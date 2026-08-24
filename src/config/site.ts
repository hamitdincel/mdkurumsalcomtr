import { siteImages } from './images'

/**
 * MERKEZİ MARKA / ŞİRKET KONFİGÜRASYONU
 * ---------------------------------------------------------------------------
 * Buradaki TODO işaretli tüm alanlar gerçek şirket bilgileriyle doldurulmalıdır.
 * Kod içinde hiçbir yerde şirket bilgisi hard-code edilmez; her şey buradan
 * veya veritabanındaki SiteSetting kaydından okunur.
 *
 * Öncelik sırası: DB (SiteSetting) > buradaki varsayılanlar.
 * @see src/services/settings-service.ts
 */

export type SocialLink = {
  label: string
  href: string
  platform: 'linkedin' | 'instagram' | 'youtube' | 'facebook' | 'x'
}

export const siteConfig = {
  /** TODO: Gerçek ticari unvan ile değiştirin. */
  name: 'MD Kurumsal',
  /** TODO: Yasal tam ticari unvan (sözleşme/KVKK metinlerinde kullanılır). */
  legalName: 'TODO — Tam Ticari Unvan A.Ş.',
  shortName: 'MD Kurumsal',
  /** TODO: Marka sloganı. */
  tagline: 'Yükseklerde temizlik için drone destekli çözümler',
  description:
    'Drone destekli sistemlerle dış cephe, cam yüzey, güneş paneli, çatı ve endüstriyel yüzey temizliği. Keşif, planlama ve kontrollü uygulama süreciyle kurumsal temizlik çözümleri.',

  /** Canonical host. Tek host kullanılır; diğeri 301 ile buraya yönlenir. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'tr_TR',
  language: 'tr',

  /** Kaynak: MD GROUP kurumsal katalog (2026). */
  contact: {
    phone: '0501 130 05 34',
    /** tel: linki için sadece rakamlar */
    phoneRaw: '+905011300534',
    whatsapp: '905011300534',
    email: 'info@mdkurumsal.com',
    salesEmail: 'info@mdkurumsal.com',
    /** Boş bırakılırsa iletişim sayfasında adres/harita bloğu gizlenir. */
    address: {
      street: 'Atatürk Mah. İkitelli Cad. Elmas Sk. Aras İş Merkezi No:1/4',
      district: 'Küçükçekmece',
      city: 'İstanbul',
      postalCode: '',
      country: 'TR',
    },
    mapEmbedUrl: '',
    /** Boş bırakılırsa footer'da çalışma saatleri gösterilmez. */
    workingHours: '',
  },

  /**
   * GRUP ŞİRKETLERİ
   * Özel güvenlik hizmetleri ayrı bir tüzel kişilik (Yeditepe) üzerinden
   * verilir; bu yüzden kendi iletişim bilgisiyle gösterilir.
   * Kaynak: "YEDİTEPE GÜVENLİK TANITIM" dokümanı.
   */
  groupCompanies: [
    {
      name: 'Yeditepe Koruma ve Güvenlik Hizmetleri Ltd. Şti.',
      /** Marka adı — logoyla birlikte gösterilen kısa ad. */
      brand: 'Yeditepe Özel Güvenlik',
      logo: siteImages.yeditepeLogo,
      scope: 'Özel güvenlik ve elektronik güvenlik hizmetleri',
      phone: '0532 161 04 05',
      phoneRaw: '+905321610405',
      address: 'Atatürk Mah. İkitelli Cad. No:17, Küçükçekmece / İstanbul',
    },
  ] as const,

  /** TODO: Gerçek sosyal medya hesapları. Boş dizi bırakılırsa footer'da bölüm gizlenir. */
  social: [] as SocialLink[],

  /**
   * Kurumsal kimlik / doğrulanabilir bilgiler.
   * Boş olanlar schema.org çıktısına ve footer'a dahil edilmez.
   * Doğrulanmamış hiçbir iddia gösterilmez.
   */
  company: {
    /** TODO: Kuruluş yılı (gerçek değilse boş bırakın). */
    foundedYear: '',
    taxOffice: '',
    taxNumber: '',
    mersisNo: '',
    /** TODO: SHGM / ticari İHA operasyon yetki bilgileri (varsa). */
    licenses: [] as string[],
    /** TODO: Sertifikalar (ISO vb.) — yalnızca gerçek belgeler eklenmeli. */
    certifications: [] as { name: string; issuer: string; documentUrl?: string }[],
  },

  /** Hizmet verilen şehirler — yalnızca gerçekten operasyon yapılan lokasyonlar. */
  serviceAreas: [] as string[],

  /** Varsayılan WhatsApp mesajı (sayfa bağlamına göre zenginleştirilir). */
  whatsappDefaultMessage:
    'Merhaba, web siteniz üzerinden drone temizlik hizmeti hakkında bilgi almak istiyorum.',

  /** Varsayılan OG görseli (bkz. src/config/images.ts). */
  ogImage: siteImages.ogDefault,

  /** Footer alt barında gösterilen geliştirici künyesi. */
  developer: {
    name: 'HD Yazılım',
    url: 'https://www.hamitdincel.com/',
    /** Künyede adın altında gösterilen alan adı. */
    domain: 'hamitdincel.com',
  },
} as const

export type SiteConfig = typeof siteConfig

/** Adres alanının doldurulup doldurulmadığını kontrol eder. */
export function hasAddress(config: Pick<SiteConfig, 'contact'> = siteConfig): boolean {
  const a = config.contact.address
  return Boolean(a.street && a.city)
}

/** WhatsApp deep-link üretir. */
export function whatsappUrl(message?: string, phone?: string): string {
  const number = (phone ?? siteConfig.contact.whatsapp).replace(/\D/g, '')
  const text = encodeURIComponent(message ?? siteConfig.whatsappDefaultMessage)
  return `https://wa.me/${number}?text=${text}`
}

/** Mutlak URL üretir (canonical, OG, sitemap). */
export function absoluteUrl(path = '/'): string {
  const base = siteConfig.url.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
