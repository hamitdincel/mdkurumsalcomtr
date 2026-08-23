import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalPage } from '@/components/shared/legal-page'
import { siteConfig } from '@/config/site'

const crumbs = [{ label: 'Aydınlatma Metni', href: '/aydinlatma-metni' }]

export const metadata: Metadata = buildMetadata({
  title: 'KVKK Aydınlatma Metni',
  description:
    'Teklif ve iletişim formları aracılığıyla toplanan kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
  path: '/aydinlatma-metni',
})

export default function DisclosurePage() {
  return (
    <LegalPage title="KVKK Aydınlatma Metni" updatedAt="—" crumbs={crumbs}>
      <p>
        Bu aydınlatma metni, <strong>{siteConfig.legalName}</strong> tarafından 6698 sayılı Kişisel
        Verilerin Korunması Kanunu&apos;nun 10. maddesi kapsamında, web sitesi üzerindeki teklif ve
        iletişim formlarını dolduran ziyaretçileri bilgilendirmek amacıyla hazırlanmıştır.
      </p>

      <h2>Hangi verileri topluyoruz?</h2>
      <p>
        Teklif formu aracılığıyla ad soyad, telefon numarası ve şehir bilgisi zorunlu olarak; firma
        adı, e-posta adresi, yapı ve yüzey bilgileri ile eklemek istediğiniz görseller ise
        opsiyonel olarak toplanır.
      </p>

      <h2>Neden topluyoruz?</h2>
      <p>
        Toplanan veriler yalnızca talebinizin değerlendirilmesi, gerekiyorsa keşif planlanması ve
        size teklif iletilmesi amacıyla kullanılır. Bu işleme, sözleşmenin kurulmasıyla doğrudan
        ilgili olması hukuki sebebine dayanır.
      </p>

      <h2>Pazarlama izni ayrıdır</h2>
      <p>
        Kampanya ve bilgilendirme iletileri almak isteyip istemediğiniz, teklif talebinizden{' '}
        <strong>bağımsız ve opsiyonel</strong> bir onaydır. Bu onayı vermemeniz teklif almanıza
        engel değildir ve verdiğiniz onayı dilediğiniz zaman geri çekebilirsiniz.
      </p>

      <h2>Verileriniz kimlerle paylaşılır?</h2>
      <p>
        Verileriniz, hizmet aldığımız barındırma, e-posta ve dosya depolama sağlayıcılarına
        yalnızca hizmetin gerektirdiği ölçüde aktarılır. Bunun dışında üçüncü kişilerle
        paylaşılmaz, satılmaz veya pazarlama amacıyla devredilmez.
      </p>
      <p>
        <em>[TODO: Kullanılan hizmet sağlayıcıların listesi ve konumları eklenmelidir.]</em>
      </p>

      <h2>Ne kadar süre saklanır?</h2>
      <p>
        Talebiniz sonuçlandıktan sonra veriler, ilgili mevzuattaki zamanaşımı süreleri boyunca
        saklanır ve süre sonunda imha edilir.
      </p>

      <h2>Haklarınız</h2>
      <p>
        KVKK m.11 kapsamındaki haklarınızın tamamı ve başvuru yöntemi{' '}
        <Link href="/kvkk">KVKK Politikamızda</Link> ayrıntılı olarak açıklanmıştır. Taleplerinizi{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> adresine
        iletebilirsiniz.
      </p>
    </LegalPage>
  )
}
