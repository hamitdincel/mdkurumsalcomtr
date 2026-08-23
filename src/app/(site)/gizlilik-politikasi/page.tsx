import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalPage } from '@/components/shared/legal-page'
import { siteConfig } from '@/config/site'

const crumbs = [{ label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' }]

export const metadata: Metadata = buildMetadata({
  title: 'Gizlilik Politikası',
  description:
    'Web sitemizde toplanan bilgilerin nasıl kullanıldığı, korunduğu ve paylaşıldığına ilişkin gizlilik politikamız.',
  path: '/gizlilik-politikasi',
})

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Gizlilik Politikası" updatedAt="—" crumbs={crumbs}>
      <p>
        <strong>{siteConfig.legalName}</strong> olarak ziyaretçilerimizin gizliliğine önem
        veriyoruz. Bu politika, web sitemiz aracılığıyla topladığımız bilgilerin nasıl kullanıldığını
        açıklar.
      </p>

      <h2>Topladığımız Bilgiler</h2>
      <ul>
        <li>Formlar aracılığıyla doğrudan tarafınızdan ilettiğiniz bilgiler</li>
        <li>Kötüye kullanımın önlenmesi amacıyla tutulan teknik kayıtlar (özetlenmiş IP, tarayıcı bilgisi)</li>
        <li>Onay vermeniz hâlinde ölçümleme ve pazarlama çerezleri aracılığıyla toplanan veriler</li>
      </ul>

      <h2>Bilgilerin Kullanımı</h2>
      <p>
        Bilgiler yalnızca talebinizin karşılanması, sizinle iletişim kurulması ve hizmet kalitemizin
        iyileştirilmesi için kullanılır. Kişisel verileriniz üçüncü kişilere satılmaz veya
        kiralanmaz.
      </p>

      <h2>Veri Güvenliği</h2>
      <p>Verilerinizi korumak için aldığımız teknik tedbirler arasında şunlar bulunur:</p>
      <ul>
        <li>Tüm trafiğin HTTPS üzerinden şifrelenmesi</li>
        <li>Yönetim paneline erişimin kimlik doğrulama ve yetki kontrolüyle sınırlandırılması</li>
        <li>Parolaların geri döndürülemez şekilde (Argon2) saklanması</li>
        <li>Form gönderimlerinde bot koruması ve hız sınırlaması uygulanması</li>
        <li>IP adreslerinin ham olarak değil, özetlenmiş biçimde tutulması</li>
      </ul>

      <h2>Çerezler</h2>
      <p>
        Çerez kullanımına ilişkin ayrıntılar için{' '}
        <Link href="/cerez-politikasi">Çerez Politikası</Link> sayfamızı inceleyebilirsiniz.
      </p>

      <h2>Üçüncü Taraf Bağlantıları</h2>
      <p>
        Sitemiz üçüncü taraf web sitelerine bağlantı içerebilir. Bu sitelerin gizlilik
        uygulamalarından sorumlu değiliz.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> adresine
        yazabilirsiniz.
      </p>
    </LegalPage>
  )
}
