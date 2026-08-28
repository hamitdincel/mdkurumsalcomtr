/**
 * MERKEZİ GÖRSEL EŞLEMESİ
 * ---------------------------------------------------------------------------
 * Kod içinde hiçbir yerde görsel yolu yazılmaz; tüm yollar buradan okunur.
 *
 * Öncelik sırası her zaman: veritabanı (admin panelinden yüklenen görsel) >
 * buradaki varsayılan. Yani panelden bir hizmete görsel yüklendiğinde bu
 * dosyadaki varsayılan otomatik devre dışı kalır.
 *
 * Görseller `public/images/` altında durur ve next/image tarafından
 * WebP/AVIF'e dönüştürülüp responsive srcset ile servis edilir.
 */

export const siteImages = {
  /** Ana sayfa hero arka planı — yatay, geniş kompozisyon (1920×1440). */
  hero: '/images/hero-drone-cephe-temizligi.jpg',

  /** Problem/Çözüm bölümü — cam cephede uygulama anı (1920×1080). */
  problemSolution: '/images/cam-cephe-temizligi.webp',

  /** Teknoloji bölümü — donanımın yakın plan görünümü (1280×720). */
  technology: '/images/drone-sistem-yakin-plan.jpg',

  /** Sosyal medya paylaşım görseli (1200×630). */
  ogDefault: '/og/default.jpg',

  /**
   * Marka logosu — schema.org Organization/LocalBusiness `logo` alanı.
   * src/app/icon.png ile aynı dosya (512x512, kare); Next bu dosyayı
   * /icon.png yolundan servis eder. Google bilgi panelinde bu görseli
   * kullanır, `image` alanı yerine geçmez — ikisi ayrı ayrı gerekir.
   */
  logo: '/icon.png',

  /**
   * Grup şirketi logosu — Yeditepe Özel Güvenlik (512×512, saydam zeminli).
   * Kaynak JPEG beyaz zeminliydi; dış beyaz alan saydamlaştırılıp kırpıldı,
   * kalkanın içindeki beyaz "ÖZEL GÜVENLİK" yazısı korundu.
   */
  yeditepeLogo: '/images/yeditepe-ozel-guvenlik.png',

  /**
   * Footer künyesindeki geliştirici logosu — HD Yazılım (hamitdincel.com).
   * Kaynak: hamitdincelcom projesindeki public/brand/icon.svg, birebir kopya.
   * Kendi koyu yuvarlatılmış zeminini taşıdığı için ayrıca çerçeve/kırpma
   * gerekmez ve açık/koyu temanın ikisinde de okunur.
   */
  hdYazilimLogo: '/images/hd-yazilim.svg',
} as const

/**
 * Yeditepe Özel Güvenlik görselleri (/hizmetler/yeditepe-guvenlik).
 *
 * Müşteri tarafından sağlanan MARKA TANITIM görselleri. Hizmetin ne olduğunu
 * anlatmak için kullanılırlar; tamamlanmış bir işin belgesi olarak
 * sunulmazlar. Bu yüzden "Projeler" ve "Öncesi & Sonrası" bölümlerinde
 * kullanılmazlar — oralar kanıt bölümleridir ve sahada çekilmiş fotoğraf
 * gerektirir.
 *
 * Kaynak PNG'ler ~2 MB idi; 1200-1600px genişliğe indirilip WebP'ye
 * çevrildi (toplam 14 MB → 756 KB).
 */
export const securityImages = {
  stadium: '/images/guvenlik/stadyum-guvenligi.webp',
  vip: '/images/guvenlik/vip-koruma.webp',
  hospital: '/images/guvenlik/hastane-guvenligi.webp',
  facility: '/images/guvenlik/tesis-yonetimi.webp',
  xray: '/images/guvenlik/x-ray-kontrol.webp',
  mall: '/images/guvenlik/avm-giris-kontrol.webp',
  k9: '/images/guvenlik/k9-arama-ekibi.webp',
} as const

/**
 * Hizmet slug'ına göre varsayılan kapak görselleri.
 * Karşılığı olmayan hizmetlerde görsel gösterilmez (placeholder blok çıkar) —
 * alakasız bir stok görsel yerleştirilmez.
 */
export const serviceImages: Record<string, string> = {
  'drone-ile-dis-cephe-temizligi': '/images/dis-cephe-temizligi.webp',
  'cam-cephe-temizligi': '/images/cam-cephe-temizligi.webp',
  'gunes-paneli-temizligi': '/images/gunes-paneli-temizligi.jpg',
  'cati-temizligi': '/images/cati-temizligi.webp',
  'endustriyel-cephe-temizligi': '/images/endustriyel-cephe-temizligi.png',
  'kompozit-metal-beton-yuzey-temizligi': '/images/kompozit-yuzey-temizligi.avif',
}

/** Çalışma alanı slug'ına göre varsayılan kapak görselleri. */
export const sectorImages: Record<string, string> = {
  'gokdelenler-ve-rezidanslar': '/images/gokdelen-cephe-temizligi.jpeg',
  'plazalar-ve-ofis-binalari': '/images/cam-cephe-temizligi.webp',
  'enerji-santralleri': '/images/gunes-paneli-temizligi.jpg',
  'fabrikalar-ve-sanayi': '/images/endustriyel-cephe-temizligi.png',
  'lojistik-ve-depolar': '/images/cati-temizligi.webp',
}

/**
 * Görsellerin alternatif metinleri (erişilebilirlik + SEO).
 * Görselin ne gösterdiğini tarif eder; anahtar kelime doldurulmaz.
 */
export const imageAltTexts: Record<string, string> = {
  '/images/hero-drone-cephe-temizligi.jpg':
    'Bir binanın dış cephesine su püskürterek temizlik yapan drone',
  '/images/cam-cephe-temizligi.webp':
    'Yüksek katlı bir yapının cam cephesini temizleyen drone',
  '/images/drone-sistem-yakin-plan.jpg':
    'Temizlik dronunun fırça ve püskürtme düzeneğinin yakın plan görünümü',
  '/images/dis-cephe-temizligi.webp':
    'Cam bir cepheye temizlik çözeltisi uygulayan drone',
  '/images/kompozit-yuzey-temizligi.avif':
    'Köpüklü su ile temizlenen cam cephe ve önünde çalışan drone',
  '/images/gokdelen-cephe-temizligi.jpeg':
    'Alttan görünen gökdelen cephesi ve tepesinde çalışan temizlik dronu',
  '/images/gunes-paneli-temizligi.jpg':
    'Güneş enerjisi santralinde panel dizilerini su püskürterek temizleyen drone',
  '/images/cati-temizligi.webp':
    'Bir yapının kiremit çatısını yukarıdan su püskürterek temizleyen drone',
  '/images/endustriyel-cephe-temizligi.png':
    'Çelik konstrüksiyonlu endüstriyel bir cam cepheyi temizleyen drone',
}

/** Bir görselin alt metnini döner; tanımlı değilse verilen yedeği kullanır. */
export function altFor(src: string | null | undefined, fallback: string): string {
  if (!src) return fallback
  return imageAltTexts[src] ?? fallback
}
