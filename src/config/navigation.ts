/**
 * Merkezi navigasyon yapısı. Header, MobileNav, Footer ve breadcrumb
 * üretimi buradan beslenir.
 */

export type NavItem = {
  label: string
  href: string
  description?: string
  children?: NavItem[]
}

export const mainNav: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  {
    label: 'Kurumsal',
    href: '/hakkimizda',
    children: [
      { label: 'Hakkımızda', href: '/hakkimizda', description: 'Ekibimiz ve çalışma prensiplerimiz' },
      { label: 'İletişim', href: '/iletisim', description: 'Bize ulaşın' },
    ],
  },
  // Hizmetler bilinçli olarak açılır menü DEĞİL: tek bir sayfaya götürür.
  // (Header bileşeni de bu öğeye alt menü enjekte etmez.)
  { label: 'Hizmetler', href: '/hizmetler' },
  // SSS ana sayfadan kaldırıldı; erişim buradan sağlanır.
  { label: 'SSS', href: '/sss' },
  {
    label: 'Çalışma Alanları',
    href: '/sektorler',
    children: [],
  },
  {
    label: 'Projeler',
    href: '/projeler',
    children: [
      { label: 'Tüm Projeler', href: '/projeler', description: 'Tamamlanan işler ve vaka çalışmaları' },
      { label: 'Öncesi & Sonrası', href: '/once-sonra', description: 'Görsel karşılaştırmalar' },
    ],
  },
  { label: 'İletişim', href: '/iletisim' },
]

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    /*
     * Bu gruptaki bağlantılar footer'da DİNAMİK hizmet listesinin ARDINDAN
     * gelir (bkz. footer.tsx). Hizmetlerin kendisi veritabanından beslendiği
     * için burada tekrarlanmaz; yalnızca sabit sayfalar listelenir.
     */
    title: 'Hizmetler',
    items: [
      { label: 'Yeditepe Özel Güvenlik', href: '/hizmetler/yeditepe-guvenlik' },
      { label: 'Tüm Hizmetler', href: '/hizmetler' },
    ],
  },
  {
    title: 'Kurumsal',
    items: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Çalışma Alanları', href: '/sektorler' },
      { label: 'Sık Sorulan Sorular', href: '/sss' },
      { label: 'İletişim', href: '/iletisim' },
    ],
  },
  {
    title: 'Çalışmalar',
    items: [
          { label: 'Projeler', href: '/projeler' },
      { label: 'Öncesi & Sonrası', href: '/once-sonra' },
      { label: 'Blog', href: '/blog' },
    ],
  },
]

export const legalNav: NavItem[] = [
  { label: 'KVKK', href: '/kvkk' },
  { label: 'Aydınlatma Metni', href: '/aydinlatma-metni' },
  { label: 'Çerez Politikası', href: '/cerez-politikasi' },
  { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
]

export const adminNav: { title: string; items: { label: string; href: string; icon: string }[] }[] = [
  {
    title: 'Genel',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
      { label: 'Teklif Talepleri', href: '/admin/leads', icon: 'Inbox' },
    ],
  },
  {
    title: 'İçerik',
    items: [
      { label: 'Hizmetler', href: '/admin/services', icon: 'Wrench' },
      { label: 'Çalışma Alanları', href: '/admin/sectors', icon: 'Building2' },
      { label: 'Projeler', href: '/admin/projects', icon: 'FolderKanban' },
      { label: 'Blog', href: '/admin/blog', icon: 'FileText' },
      { label: 'SSS', href: '/admin/faq', icon: 'HelpCircle' },
    ],
  },
  {
    title: 'Güven Unsurları',
    items: [
      { label: 'Referanslar', href: '/admin/references', icon: 'BadgeCheck' },
      { label: 'Müşteri Yorumları', href: '/admin/testimonials', icon: 'Quote' },
      { label: 'Medya', href: '/admin/media', icon: 'Images' },
    ],
  },
  {
    title: 'Sistem',
    items: [{ label: 'Site Ayarları', href: '/admin/settings', icon: 'Settings' }],
  },
]
