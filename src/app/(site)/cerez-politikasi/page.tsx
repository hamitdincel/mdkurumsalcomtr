import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalPage } from '@/components/shared/legal-page'
import { CookiePreferencesTrigger } from '@/components/analytics/cookie-preferences-trigger'

const crumbs = [{ label: 'Çerez Politikası', href: '/cerez-politikasi' }]

export const metadata: Metadata = buildMetadata({
  title: 'Çerez Politikası',
  description:
    'Web sitemizde kullanılan çerez kategorileri, amaçları ve çerez tercihlerinizi nasıl yönetebileceğiniz.',
  path: '/cerez-politikasi',
})

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Çerez Politikası" updatedAt="—" crumbs={crumbs}>
      <p>
        Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin
        dosyalarıdır. Bu politika, sitemizde hangi çerezleri hangi amaçla kullandığımızı ve
        tercihlerinizi nasıl yönetebileceğinizi açıklar.
      </p>

      <h2>Çerez Kategorileri</h2>

      <h3>1. Zorunlu Çerezler</h3>
      <p>
        Sitenin temel işlevlerinin çalışması için gereklidir: oturum yönetimi, güvenlik ve form
        gönderimi. Bu çerezler olmadan site düzgün çalışmaz ve kapatılamazlar. Çerez tercihinizin
        kendisi de bu kategoride saklanır.
      </p>

      <h3>2. Ölçümleme (Analytics) Çerezleri</h3>
      <p>
        Ziyaretçi sayısı, hangi sayfaların görüntülendiği ve sitede nasıl gezinildiği gibi bilgileri
        toplu ve anonim biçimde ölçmemizi sağlar. Bu veriler siteyi iyileştirmek için kullanılır.
      </p>

      <h3>3. Pazarlama Çerezleri</h3>
      <p>
        Reklam performansının ölçülmesi ve yeniden pazarlama faaliyetleri için kullanılır.
      </p>

      <h2>Onay ve Tercih Yönetimi</h2>
      <p>
        Ölçümleme ve pazarlama çerezleri <strong>yalnızca açık onayınız verildikten sonra</strong>{' '}
        yüklenir. Onay vermediğiniz sürece bu servislerin script&apos;leri siteye hiç dahil edilmez
        ve ilgili sağlayıcılara herhangi bir istek gönderilmez.
      </p>
      <p>
        Tercihlerinizi dilediğiniz zaman aşağıdaki düğmeyle veya sayfa altındaki &quot;Çerez
        Tercihleri&quot; bağlantısıyla değiştirebilirsiniz.
      </p>

      <p>
        <CookiePreferencesTrigger />
      </p>

      <h2>Tarayıcı Ayarları</h2>
      <p>
        Çerezleri tarayıcınızın ayarlarından da yönetebilir veya silebilirsiniz. Zorunlu çerezlerin
        engellenmesi durumunda sitenin bazı bölümleri çalışmayabilir.
      </p>

      <h2>Kullanılan Çerezler</h2>
      <p>
        <em>
          [TODO: Yayına geçmeden önce kullanılan tüm çerezlerin adı, sağlayıcısı, amacı ve saklama
          süresi tablo hâlinde listelenmelidir.]
        </em>
      </p>
    </LegalPage>
  )
}
