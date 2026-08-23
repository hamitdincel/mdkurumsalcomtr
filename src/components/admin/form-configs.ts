import type { FieldSection } from './entity-form'

/**
 * Form alan tanımları.
 * Server component'ler bu fonksiyonlardan aldığı düz veri yapısını
 * EntityForm'a aktarır (serileştirilebilir olmak zorundadır).
 */

const iconOptions = [
  { value: 'Building', label: 'Bina' },
  { value: 'Building2', label: 'Plaza / Kule' },
  { value: 'PanelsTopLeft', label: 'Cam cephe' },
  { value: 'Sun', label: 'Güneş' },
  { value: 'Home', label: 'Çatı / Ev' },
  { value: 'Factory', label: 'Fabrika' },
  { value: 'Layers', label: 'Katmanlar' },
  { value: 'Warehouse', label: 'Depo' },
  { value: 'Hotel', label: 'Otel' },
  { value: 'HeartPulse', label: 'Sağlık' },
  { value: 'GraduationCap', label: 'Eğitim' },
  { value: 'ShoppingBag', label: 'Perakende' },
  { value: 'Landmark', label: 'Kamu' },
  { value: 'Zap', label: 'Enerji' },
]

const seoSection = (): FieldSection => ({
  title: 'SEO',
  description:
    'Her sayfa için benzersiz başlık ve açıklama girin. Boş bırakılırsa içerikteki başlık ve kısa açıklama kullanılır.',
  fields: [
    { type: 'text', name: 'seoTitle', label: 'SEO Başlığı', hint: 'En fazla 60-70 karakter önerilir.' },
    { type: 'image', name: 'ogImage', label: 'Paylaşım Görseli (OG)' },
    {
      type: 'textarea',
      name: 'metaDescription',
      label: 'Meta Açıklama',
      rows: 3,
      hint: '150-160 karakter arası önerilir.',
      span: 2,
    },
  ],
})

export function serviceFormSections(): FieldSection[] {
  return [
    {
      title: 'Temel Bilgiler',
      fields: [
        { type: 'text', name: 'title', label: 'Hizmet Adı', required: true },
        { type: 'slug', name: 'slug', label: 'Slug', sourceField: 'title', required: true },
        {
          type: 'textarea',
          name: 'shortDescription',
          label: 'Kısa Açıklama',
          rows: 3,
          required: true,
          hint: 'Kartlarda ve listelerde görünür.',
          span: 2,
        },
        {
          type: 'textarea',
          name: 'intro',
          label: 'Giriş Metni',
          rows: 5,
          hint: 'Hizmet detay sayfasının "nedir?" bölümü.',
          span: 2,
        },
        {
          type: 'html',
          name: 'content',
          label: 'Ek İçerik (HTML)',
          rows: 8,
          hint: 'Kaydedilirken güvenlik için temizlenir (sanitize).',
          span: 2,
        },
      ],
    },
    {
      title: 'Görsel ve Görünüm',
      fields: [
        { type: 'image', name: 'heroImage', label: 'Kapak Görseli' },
        { type: 'select', name: 'icon', label: 'İkon', options: iconOptions },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'active', label: 'Yayında', hint: 'Kapalıysa sitede görünmez.' },
        { type: 'checkbox', name: 'featured', label: 'Ana sayfada öne çıkar' },
      ],
    },
    {
      title: 'İçerik Blokları',
      description: 'Detay sayfasındaki listeler. Boş bırakılan bloklar sayfada gösterilmez.',
      fields: [
        {
          type: 'stringList',
          name: 'problems',
          label: 'Hangi sorunları çözer?',
          itemLabel: 'Sorun ekleyin',
          span: 2,
        },
        {
          type: 'stringList',
          name: 'surfaces',
          label: 'Uygun yüzeyler',
          itemLabel: 'Yüzey ekleyin',
          span: 2,
        },
        { type: 'itemList', name: 'advantages', label: 'Avantajlar', span: 2 },
        { type: 'itemList', name: 'processSteps', label: 'Uygulama süreci adımları', span: 2 },
      ],
    },
    seoSection(),
  ]
}

export function sectorFormSections(
  serviceOptions: { value: string; label: string }[],
): FieldSection[] {
  return [
    {
      title: 'Temel Bilgiler',
      fields: [
        { type: 'text', name: 'title', label: 'Çalışma Alanı Adı', required: true },
        { type: 'slug', name: 'slug', label: 'Slug', sourceField: 'title', required: true },
        {
          type: 'textarea',
          name: 'shortDescription',
          label: 'Kısa Açıklama',
          rows: 3,
          required: true,
          span: 2,
        },
        { type: 'textarea', name: 'intro', label: 'Giriş Metni', rows: 5, span: 2 },
        { type: 'html', name: 'content', label: 'Ek İçerik (HTML)', rows: 8, span: 2 },
      ],
    },
    {
      title: 'Görsel ve Görünüm',
      fields: [
        { type: 'image', name: 'heroImage', label: 'Kapak Görseli' },
        { type: 'select', name: 'icon', label: 'İkon', options: iconOptions },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'active', label: 'Yayında' },
      ],
    },
    {
      title: 'İçerik Blokları',
      fields: [
        { type: 'stringList', name: 'needs', label: 'Öne çıkan ihtiyaçlar', span: 2 },
        { type: 'stringList', name: 'approach', label: 'Planlama yaklaşımı', span: 2 },
        {
          type: 'multiselect',
          name: 'serviceIds',
          label: 'İlgili hizmetler',
          options: serviceOptions,
          hint: 'Bu alanda sunulan hizmetler — iç linkleme için önemlidir.',
          span: 2,
        },
      ],
    },
    seoSection(),
  ]
}

export function projectFormSections(
  serviceOptions: { value: string; label: string }[],
  sectorOptions: { value: string; label: string }[],
): FieldSection[] {
  return [
    {
      title: 'Temel Bilgiler',
      fields: [
        { type: 'text', name: 'title', label: 'Proje Adı', required: true },
        { type: 'slug', name: 'slug', label: 'Slug', sourceField: 'title', required: true },
        { type: 'text', name: 'city', label: 'Şehir', required: true },
        { type: 'text', name: 'clientName', label: 'Müşteri Adı', hint: 'Gizlenecekse boş bırakın.' },
        {
          type: 'checkbox',
          name: 'anonymized',
          label: 'Müşteri adını gizle',
          hint: 'Açıkken müşteri yerine sektör adı gösterilir.',
          span: 2,
        },
        {
          type: 'textarea',
          name: 'summary',
          label: 'Özet',
          rows: 3,
          required: true,
          hint: 'Kartlarda ve meta açıklamada kullanılır.',
          span: 2,
        },
      ],
    },
    {
      title: 'Proje Künyesi',
      description: 'Yalnızca gerçek veriler girin. Boş bırakılan alanlar sayfada gösterilmez.',
      fields: [
        { type: 'select', name: 'serviceId', label: 'Hizmet', options: serviceOptions },
        { type: 'select', name: 'sectorId', label: 'Çalışma Alanı', options: sectorOptions },
        { type: 'text', name: 'buildingType', label: 'Yapı Türü' },
        { type: 'text', name: 'surfaceType', label: 'Yüzey Türü' },
        { type: 'number', name: 'area', label: 'Alan (m²)', min: 0 },
        { type: 'number', name: 'height', label: 'Yükseklik (m)', min: 0 },
        { type: 'text', name: 'duration', label: 'Proje Süresi', hint: 'Örn: 3 gün' },
        { type: 'date', name: 'completionDate', label: 'Tamamlanma Tarihi' },
      ],
    },
    {
      title: 'Vaka Çalışması İçeriği',
      fields: [
        { type: 'textarea', name: 'challenge', label: 'Problem', rows: 4, span: 2 },
        { type: 'textarea', name: 'solution', label: 'Planlama ve Uygulama', rows: 4, span: 2 },
        { type: 'textarea', name: 'result', label: 'Sonuç', rows: 4, span: 2 },
      ],
    },
    {
      title: 'Görsel ve Yayın',
      fields: [
        { type: 'image', name: 'coverImage', label: 'Kapak Görseli' },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'published', label: 'Yayında' },
        { type: 'checkbox', name: 'featured', label: 'Ana sayfada öne çıkar' },
      ],
    },
    seoSection(),
  ]
}

export function beforeAfterFormSections(
  serviceOptions: { value: string; label: string }[],
  projectOptions: { value: string; label: string }[],
): FieldSection[] {
  return [
    {
      title: 'Görseller',
      description: 'Yalnızca gerçek proje fotoğrafları kullanılmalıdır.',
      fields: [
        { type: 'image', name: 'beforeImage', label: 'Öncesi Görseli' },
        { type: 'image', name: 'afterImage', label: 'Sonrası Görseli' },
        { type: 'text', name: 'beforeAlt', label: 'Öncesi Alt Metni' },
        { type: 'text', name: 'afterAlt', label: 'Sonrası Alt Metni' },
      ],
    },
    {
      title: 'Bilgiler',
      fields: [
        { type: 'text', name: 'title', label: 'Başlık', required: true },
        { type: 'text', name: 'city', label: 'Şehir' },
        { type: 'text', name: 'buildingType', label: 'Yapı Türü' },
        { type: 'text', name: 'surfaceType', label: 'Yüzey Türü' },
        { type: 'select', name: 'serviceId', label: 'Hizmet', options: serviceOptions },
        { type: 'select', name: 'projectId', label: 'Proje', options: projectOptions },
        { type: 'textarea', name: 'description', label: 'Açıklama', rows: 3, span: 2 },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'active', label: 'Yayında' },
        { type: 'checkbox', name: 'featured', label: 'Ana sayfada göster' },
      ],
    },
  ]
}

export function referenceFormSections(): FieldSection[] {
  return [
    {
      title: 'Referans Bilgileri',
      description:
        'Yalnızca gerçekten çalıştığınız ve logosunu kullanma izni aldığınız kurumları ekleyin.',
      fields: [
        { type: 'text', name: 'name', label: 'Firma Adı', required: true },
        { type: 'text', name: 'website', label: 'Web Sitesi' },
        { type: 'image', name: 'logo', label: 'Logo', span: 2 },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'active', label: 'Yayında' },
      ],
    },
  ]
}

export function testimonialFormSections(
  projectOptions: { value: string; label: string }[],
): FieldSection[] {
  return [
    {
      title: 'Müşteri Yorumu',
      description:
        'Yalnızca müşteriden alınmış gerçek yorumları ekleyin. Yayın için müşteri onayı alınmalıdır.',
      fields: [
        { type: 'text', name: 'personName', label: 'Kişi Adı', required: true },
        { type: 'text', name: 'jobTitle', label: 'Pozisyon' },
        { type: 'text', name: 'company', label: 'Firma', required: true },
        { type: 'select', name: 'projectId', label: 'İlgili Proje', options: projectOptions },
        { type: 'textarea', name: 'text', label: 'Yorum', rows: 5, required: true, span: 2 },
        { type: 'image', name: 'avatar', label: 'Kişi Fotoğrafı' },
        { type: 'image', name: 'logo', label: 'Firma Logosu' },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'active', label: 'Yayında' },
      ],
    },
  ]
}

export function faqFormSections(
  serviceOptions: { value: string; label: string }[],
): FieldSection[] {
  return [
    {
      title: 'Soru ve Cevap',
      fields: [
        { type: 'text', name: 'question', label: 'Soru', required: true, span: 2 },
        { type: 'textarea', name: 'answer', label: 'Cevap', rows: 5, required: true, span: 2 },
        {
          type: 'select',
          name: 'serviceId',
          label: 'İlgili Hizmet',
          options: serviceOptions,
          hint: 'Boş bırakılırsa genel SSS listesinde görünür.',
        },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
        { type: 'checkbox', name: 'active', label: 'Yayında' },
      ],
    },
  ]
}

export function categoryFormSections(): FieldSection[] {
  return [
    {
      title: 'Kategori',
      fields: [
        { type: 'text', name: 'name', label: 'Kategori Adı', required: true },
        { type: 'slug', name: 'slug', label: 'Slug', sourceField: 'name', required: true },
        { type: 'textarea', name: 'description', label: 'Açıklama', rows: 3, span: 2 },
        { type: 'number', name: 'sortOrder', label: 'Sıralama', min: 0, max: 999 },
      ],
    },
  ]
}

export function redirectFormSections(): FieldSection[] {
  return [
    {
      title: 'Yönlendirme',
      description: 'URL değişikliklerinde SEO değerinin korunması için kullanılır.',
      fields: [
        {
          type: 'text',
          name: 'oldPath',
          label: 'Eski Yol',
          required: true,
          placeholder: '/eski-sayfa',
        },
        {
          type: 'text',
          name: 'newPath',
          label: 'Yeni Yol',
          required: true,
          placeholder: '/yeni-sayfa',
        },
        {
          type: 'select',
          name: 'statusCode',
          label: 'Yönlendirme Tipi',
          required: true,
          options: [
            { value: '301', label: '301 — Kalıcı (önerilen)' },
            { value: '302', label: '302 — Geçici' },
          ],
        },
        { type: 'checkbox', name: 'active', label: 'Aktif' },
      ],
    },
  ]
}
