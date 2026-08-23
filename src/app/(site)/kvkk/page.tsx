import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalPage } from '@/components/shared/legal-page'
import { siteConfig } from '@/config/site'

const crumbs = [{ label: 'KVKK', href: '/kvkk' }]

export const metadata: Metadata = buildMetadata({
  title: 'KVKK — Kişisel Verilerin Korunması Politikası',
  description:
    'Kişisel verilerin işlenmesine ilişkin politikamız, veri sahibi hakları ve başvuru yöntemleri.',
  path: '/kvkk',
})

export default function KvkkPage() {
  return (
    <LegalPage title="Kişisel Verilerin Korunması Politikası" updatedAt="—" crumbs={crumbs}>
      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri sorumlusu
        sıfatıyla hareket eden <strong>{siteConfig.legalName}</strong> (&quot;Şirket&quot;), kişisel
        verilerinizin hukuka uygun biçimde işlenmesi ve korunması için gerekli teknik ve idari
        tedbirleri almaktadır.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <p>Web sitemiz üzerinden aşağıdaki kişisel veriler işlenebilmektedir:</p>
      <ul>
        <li>
          <strong>Kimlik ve iletişim verileri:</strong> ad soyad, firma adı, telefon numarası,
          e-posta adresi, şehir bilgisi
        </li>
        <li>
          <strong>Talep bilgileri:</strong> yapı türü, yüzey alanı, yüzey türü, kirlilik durumu,
          tercih edilen zaman aralığı ve tarafınızca iletilen açıklama
        </li>
        <li>
          <strong>Tarafınızca yüklenen görsel/video dosyaları</strong> (opsiyonel)
        </li>
        <li>
          <strong>İşlem güvenliği verileri:</strong> talep tarihi, tarayıcı bilgisi ve IP adresinin
          geri döndürülemez şekilde özetlenmiş (hash) hali
        </li>
        <li>
          <strong>Pazarlama kaynak verileri:</strong> siteye yönlendiren bağlantı ve kampanya
          parametreleri (yalnızca mevcutsa)
        </li>
      </ul>
      <p>
        Talebinizin değerlendirilmesi için gerekli olmayan hiçbir kişisel veri talep edilmez. IP
        adresi ham olarak saklanmaz; yalnızca kötüye kullanımın önlenmesi amacıyla tuzlanmış özet
        değeri tutulur.
      </p>

      <h2>3. İşleme Amaçları ve Hukuki Sebepler</h2>
      <ul>
        <li>
          <strong>Talebinizin değerlendirilmesi, keşif planlanması ve teklif hazırlanması:</strong>{' '}
          sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK m.5/2-c)
        </li>
        <li>
          <strong>İletişim faaliyetlerinin yürütülmesi:</strong> meşru menfaat (KVKK m.5/2-f)
        </li>
        <li>
          <strong>Hukuki yükümlülüklerin yerine getirilmesi ve kayıtların saklanması:</strong> KVKK
          m.5/2-ç
        </li>
        <li>
          <strong>Ticari elektronik ileti gönderimi:</strong> yalnızca ayrıca ve açıkça verilen
          rızaya dayanır (KVKK m.5/1). Bu rıza teklif talebinin ön şartı değildir ve
          verilmemesi hizmet almanıza engel oluşturmaz.
        </li>
      </ul>

      <h2>4. Aktarım</h2>
      <p>
        Kişisel verileriniz; barındırma, e-posta gönderimi ve dosya depolama hizmeti aldığımız
        tedarikçilere, yalnızca hizmetin gerektirdiği ölçüde ve gizlilik yükümlülüğü altında
        aktarılabilir. Yurt dışına aktarım söz konusu olduğunda KVKK m.9 hükümlerine uygun hareket
        edilir.
      </p>
      <p>
        <em>
          [TODO: Kullanılan tedarikçiler (barındırma sağlayıcısı, e-posta servisi, depolama
          sağlayıcısı, analitik servisler) ve bunların lokasyonları burada açıkça listelenmelidir.]
        </em>
      </p>

      <h2>5. Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve ilgili mevzuatta
        öngörülen zamanaşımı süreleri dikkate alınarak saklanır. Süre sonunda veriler silinir, yok
        edilir veya anonim hale getirilir.
      </p>
      <p>
        <em>[TODO: Şirketin saklama ve imha politikasındaki süreler burada belirtilmelidir.]</em>
      </p>

      <h2>6. Veri Sahibi Olarak Haklarınız</h2>
      <p>KVKK m.11 uyarınca aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Silinmesini veya yok edilmesini isteme</li>
        <li>Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
        <li>
          Münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonuç ortaya
          çıkmasına itiraz etme
        </li>
        <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>

      <h2>7. Başvuru</h2>
      <p>
        Haklarınıza ilişkin taleplerinizi{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> adresine
        iletebilirsiniz. Başvurular en geç 30 gün içinde sonuçlandırılır.
      </p>

      <p>
        Ayrıca <Link href="/aydinlatma-metni">Aydınlatma Metni</Link>,{' '}
        <Link href="/cerez-politikasi">Çerez Politikası</Link> ve{' '}
        <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link> sayfalarımızı inceleyebilirsiniz.
      </p>
    </LegalPage>
  )
}
