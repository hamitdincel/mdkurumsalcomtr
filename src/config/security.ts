/**
 * YEDİTEPE ÖZEL GÜVENLİK — HİZMET İÇERİKLERİ
 * ---------------------------------------------------------------------------
 * Kaynak: "YEDİTEPE GÜVENLİK TANITIM.pdf" (14 sayfa) ve "MD GROUP KATALOG.pdf"
 * (25 sayfa). Her madde bu iki dokümanda yazılı olana dayanır.
 *
 * KURAL: personel sayısı, lokasyon adedi, deneyim yılı, SLA taahhüdü veya
 * sertifika iddiası YAZILMAZ. Dokümanlarda geçse dahi doğrulanamayan
 * ("sektörün lider ismi", "7 gün 24 saat") ifadeler dışarıda bırakılmıştır.
 * Süresi dolmuş bir revizyona atıf yapan ISO 9001:2000 ibaresi de aynı
 * gerekçeyle alınmamıştır.
 *
 * Her hizmetin kendi detay sayfası vardır:
 *   /hizmetler/yeditepe-guvenlik/<slug>
 */

import { securityImages } from './images'

export type SecuritySection = {
  title: string
  description?: string
  items?: string[]
}

export type SecurityService = {
  slug: string
  title: string
  icon: string
  image: string
  /** Kart ve hero açıklaması */
  shortDescription: string
  /** Detay sayfasının açılış paragrafı */
  intro: string
  sections: SecuritySection[]
  metaDescription: string
}

export const securityServices: SecurityService[] = [
  {
    slug: 'ozel-guvenlik',
    title: 'Özel Güvenlik Hizmetleri',
    icon: 'ShieldCheck',
    image: securityImages.hospital,
    shortDescription:
      '5188 sayılı kanunun öngördüğü koşullarda, güvenlik eğitimini almış ve özel güvenlik kimlik kartına sahip personelle sabit noktalı koruma hizmeti.',
    intro:
      'Kişilerin, kurum ve kuruluşların özel mülkiyet alanlarındaki korunması, genel kolluk kuvvetlerinin görev alanını tamamlayan bir hizmettir. 5188 sayılı kanunun öngördüğü koşullarda; etkili güvenlik, koruma ve yakın koruma hizmetleri sabit noktalı görevlendirmeyle verilir. Görev yerinin yapısına uygun seçilmiş, yasal mesleki eğitimlerden geçmiş, soruşturmaları ve sağlık kontrolleri tamamlanmış personel görevlendirilir.',
    metaDescription:
      'AVM, hastane, plaza, okul, fabrika, otel ve kamu binalarında 5188 sayılı kanun kapsamında sabit noktalı özel güvenlik hizmeti.',
    sections: [
      {
        title: 'Alışveriş merkezleri',
        description:
          'Otopark girişlerinden başlayarak idari ofisler, sosyal mekânlar ve ortak alanlarda genel güvenliğin sağlanmasını kapsar.',
        items: [
          'Bagaj kontrolü ve araç altı aynası ile araç kontrolü',
          'Kapalı otoparka LPG’li araç girişinin önlenmesi',
          'Yükseklik sınırını aşan araçların ayrılmış alanlara yönlendirilmesi',
          'Kapısı veya camı açık kalmış araçların plakayla anons edilmesi',
          'X-Ray operatörlüğü sertifikasına sahip görevlilerle kapı kontrolü',
          'Mal veren araçların kayıtlı ve belirlenen saatlerde giriş-çıkışı',
          'Kat araları, merdiven, asansör ve otoparklarda devriye',
          'Şüpheli paket kontrolü ve acil durumda bina tahliyesi',
        ],
      },
      {
        title: 'Hastaneler ve sağlık tesisleri',
        description:
          'Hastaların, hasta yakınlarının, refakatçilerin ve çalışanların huzur ve güvenliğinin sağlanmasıdır.',
        items: [
          'Giriş-çıkışların ve acil servis ziyaret hareketlerinin yönlendirilmesi',
          'Risk analiziyle belirlenen riskli bölgelerin kamerayla izlenmesi',
          'Koridor ve acil servis gibi yoğun sirkülasyon alanlarının gözetimi',
          'Hastane bahçesinde park ve trafik düzeni',
          'Demirbaş ve sarf malzemelerinin korunması',
          'Genel huzuru bozan hareketlerin engellenmesi',
        ],
      },
      {
        title: 'Kamu kurum ve kuruluşları',
        description:
          'Kurum kültürüne kısa sürede uyum sağlayan, faaliyet alanına göre eğitilen personelle çalışılır.',
        items: [
          'Kurumun ihtiyacına göre malzeme ve teçhizatla donatılan personel',
          'Güvenlik, koruma, kollama, gözetim ve denetim',
          'Belediyeler ve bağlı kuruluşların güvenliği',
        ],
      },
      {
        title: 'Fabrika ve şantiyeler',
        description:
          'Ortaklaşa yapılan keşif çalışması sonrasında, tesisin yapısına göre planlanır.',
        items: [
          'Giriş-çıkış ve çalışan personel kontrolü',
          'Kötü niyetli kişilere karşı çevre güvenliği',
          'Yangında alınması gereken tedbirler',
          'Malzeme ve ekipman güvenliği',
          'Hırsızlık, sabotaj ve zarar verme eylemlerine karşı önlem',
          'Toplu konut, gökdelen, köprü, yol ve okul şantiyeleri',
        ],
      },
      {
        title: 'Okullar ve eğitim kurumları',
        items: [
          'Öğrenci hareketlerinin izlenmesi',
          'Dışarıdan gelecek tehlikelere karşı koruma',
          'İlköğretim, lise, yüksekokul, kolej ve üniversite yerleşkeleri',
          'Zararlı alışkanlıklara ve ideolojik amaçlı eylemlere karşı önlem',
        ],
      },
      {
        title: 'Oteller, konutlar ve siteler',
        items: [
          'Otellerde giriş-çıkış kontrolleri',
          'Özel konutlarda ziyaretçi kontrolü',
          'Akıllı bina, site ve plazalarda kontrollü giriş-çıkış',
        ],
      },
      {
        title: 'Toplu ulaşım noktaları',
        description:
          'Duraklarda ve aktarma noktalarında giriş-çıkışların kontrol altında tutulmasıdır.',
        items: [
          'Seyyar satıcı ve pazarlamacı girişinin engellenmesi',
          'Hırsızlık, yangın, su baskını ve elektrik kaçağına karşı tedbir',
          'Bomba ve terör eylemleri ile soygun girişimlerine karşı önlem',
          'Baskın ve sabotajlara karşı duyarlılık',
        ],
      },
    ],
  },

  {
    slug: 'organizasyon-koruma',
    title: 'Organizasyon ve Özel Koruma',
    icon: 'Users',
    image: securityImages.vip,
    shortDescription:
      'Kısa süreli organizasyonlar ve kişiye özel koruma ihtiyaçları için, güvenlik risk değerlendirmesi sonrasında kurulan geçici güvenlik organizasyonu.',
    intro:
      'Konser, fuar, seminer, toplantı ve spor faaliyetleri gibi kısa süreli organizasyonlarda; güvenlik risk değerlendirmesi, koruma ve gözetim, devriye, arama, yönlendirme ve yakın koruma faaliyetleriyle destek verilir. Personel saat ya da vardiya bazında görev yapabilir. Alınacak tedbirler, etkinlik öncesinde yapılan risk değerlendirmesi sonucunda belirlenir.',
    metaDescription:
      'Konser, fuar, stadyum ve toplantı güvenliği; VIP ve yakın koruma; K9 patlayıcı arama ekipleri ve kısa süreli (part-time) güvenlik hizmetleri.',
    sections: [
      {
        title: 'Güvenlik risk değerlendirmesinde belirlenenler',
        description:
          'Doğru nitelikte personel ve doğru teçhizatın kullanılması için, etkinlik öncesinde aşağıdaki başlıklar karara bağlanır.',
        items: [
          'Mekânın fiziksel olarak detaylı incelenmesi',
          'Güvenlik noktaları ve devriye güzergâhlarının belirlenmesi',
          'Giriş ve/veya çıkış yapılacak kapıların belirlenmesi',
          'Yönlendirme bantları ve bariyerlerin yerleştirilmesi',
          'Araçların yönlendirilmesi',
          'Metal dedektörü kullanılacak girişlerin belirlenmesi',
          'Katılımcıların ve bölge halkının profilinin incelenmesi',
        ],
      },
      {
        title: 'Kullanılan ekipman',
        description:
          'Organizasyonun ihtiyacına göre, fiziki güvenliği tamamlayan tedbirler alınır.',
        items: [
          'El tipi metal dedektör',
          'Kapı tipi metal dedektör',
          'X-Ray kontrol cihazı',
          'Yönlendirme bantları',
          'Eskort araçları',
          'Telsiz',
        ],
      },
      {
        title: 'Organizasyon güvenliği',
        description:
          'Özel toplantı, açılış, fuar, seminer, toplu gezi, konser ve spor faaliyetlerinde genel asayişin sağlanmasıdır.',
        items: [
          'Davetiye ile giriş kontrolü ve konuk yönlendirme',
          'Kalabalık kontrolü',
          'Sergilenen ürün ve eserlerin korunması',
          'K9 ekipleriyle patlayıcı madde araştırması',
          'Dinlemeyi önleme ve bilgiyi koruma (özel toplantılar)',
          'İç ve dış kapı metal ve silah tespit dedektörü kontrolleri',
        ],
      },
      {
        title: 'VIP ve yakın koruma',
        description:
          'VIP korumanın kapsamı çeşitlilik gösterdiğinden kişiye özel çözüm gerekir. Görev alacak elemanların nitelikleri ile kullanılacak malzeme ve ekipman karşılıklı görüşmelerle belirlenir.',
        items: [
          'Yakın koruma ve VIP koruma',
          'Silahlı koruma',
          'Düşük profilli koruma',
          'Özel karşılama ve uğurlamalar',
        ],
      },
      {
        title: 'K9 arama ekipleri',
        description:
          'Bomba ve tanıtılan maddeye duyarlı, Kanada ve Amerika K-9 programlarına göre eğitilmiş köpekler ve ilgili branşlarda görev yapmış uzman kadro ile çalışılır.',
        items: [
          'Kişiye özel',
          'Tesis içi veya dışı',
          'Çeşitli etkinlik ve organizasyonlar',
          'Özel karşılama ve uğurlamalar',
          'Mevcut projeler',
        ],
      },
      {
        title: 'Stadyum ve spor tesisleri',
        description:
          'Ekstra bilgi birikimi ve tecrübe isteyen bir alandır; özel eğitimli kadroyla yürütülür.',
        items: [
          'Stadyum giriş-çıkış kontrolleri',
          'Müsabaka esnasında gelişebilecek olaylara müdahale',
        ],
      },
      {
        title: 'Medya ve basın kuruluşları',
        items: [
          'Kurum kültürüne uyumlu, ihtisas sahibi personel',
          'Koruma, kollama, gözetleme ve denetim',
        ],
      },
    ],
  },

  {
    slug: 'elektronik-guvenlik',
    title: 'Elektronik Güvenlik Sistemleri',
    icon: 'Cpu',
    image: securityImages.mall,
    shortDescription:
      'Tesisin ihtiyacı olan donanım, gerekli analizler yapıldıktan sonra kurulur ve işletilir.',
    intro:
      'İşletmelerin elektronik sistemlerle güvenliği; kartlı geçiş sistemleri, CCTV sistemleri ve hırsız algılama sistemleriyle sağlanır. Tesisin ihtiyacı olan her türlü elektronik güvenlik donanımı, gerekli analizler yapıldıktan sonra kurulur ve işletilir. Sistemlerin tasarlanması, montajı ve işletiminin yanında mevcut sistemlerin denetimi de yapılır.',
    metaDescription:
      'CCTV gözetim merkezi, kartlı geçiş, turnike, X-Ray, metal dedektör ve yangın ihbar sistemlerinin kurulumu ve işletimi.',
    sections: [
      {
        title: 'Sistemler',
        items: [
          'CCTV kumanda ve gözetim merkezleri',
          'CCTV kamera sistemleri',
          'Yangın, soygun ve gaz ihbarı alarm sistemleri',
          'Elektronik turnike ve bariyerler',
          'X-Ray cihazları',
          'Kapı ve el tipi metal dedektörleri',
          'Kartlı geçiş (access) sistemleri',
          'Bekçi tur kontrol sistemi',
        ],
      },
      {
        title: 'Havaalanları',
        description:
          'Hizmet verilen havaalanlarında çevre emniyetinden bagaj taramasına kadar bütünleşik bir kontrol zinciri yürütülür.',
        items: [
          'Çevre ve tel örgü emniyeti',
          'Haberleşme, santral ve elektrik santrali emniyeti',
          'Seyrüsefer sistemi ve yakıt ikmal depolarının emniyeti',
          'Araç park yerleri ve idari büro katlarının emniyeti',
          'Apron giriş ve çıkış kontrol noktaları',
          'Kişilerin X-Ray ile kapı ve el tipi dedektörlere yönlendirilmesi',
          'X-Ray görüntüleme sistemleriyle bagaj arama',
          'Arındırılmış salona giriş kontrolü',
          'Yolcu ve bagaj kontrolü, şüpheli bagajların taranması',
        ],
      },
      {
        title: 'Yangın algılama ve söndürme',
        items: [
          'Yangın algılama sisteminin kurulması',
          'Yangın ihbar sisteminin kurulması',
          'Söndürme sisteminin kurulması',
        ],
      },
    ],
  },

  {
    slug: 'bina-tesis',
    title: 'Bina ve Tesis Güvenliği',
    icon: 'Workflow',
    image: securityImages.facility,
    shortDescription:
      'Proje kapsamındaki alanlarda gözetim ve denetim; etkin devriye sistemiyle kurulan sistemli bir güvenlik ağı.',
    intro:
      'Proje kapsamı içerisindeki alanların gözetim ve denetimini yapmak, olası yasa dışı saldırılara karşı korumak ve acil durumlarda müdahale etmek esastır. Tesis içinde etkin devriye sistemiyle giriş-çıkış kontrolleri ve güvenlik sistemleri operatörlüğü prosedürler dâhilinde yürütülür; böylece bina içinde sistemli bir güvenlik ağı kurulur.',
    metaDescription:
      'Bina ve tesislerde devriye sistemi, giriş-çıkış kontrolü, güvenlik sistemleri operatörlüğü, proje dosyası ve denetim düzeni.',
    sections: [
      {
        title: 'Görev kapsamı',
        items: [
          'Giriş ve çıkış kontrolleri',
          'Tesis içinde etkin devriye sistemi',
          'Güvenlik sistemleri operatörlüğü (X-Ray, el dedektörü vb.)',
          'Olası yasa dışı saldırılara karşı koruma',
          'Acil durumlarda müdahale',
          'Site ve konutlarda kontrollü giriş-çıkış',
        ],
      },
      {
        title: 'Proje dosyası',
        description:
          'Hizmete başlamadan önce oluşturulan görev talimatları, kayıt defterleri ve formlar tek dosyada toplanır.',
        items: [
          'Görev yeri tanımı; doğalgaz, elektrik ve su sistemleri',
          'Genel ve müşteriye özel güvenlik talimatları',
          'Vardiya çizelgesi',
          'Devriye güzergâhı ve riskli noktalar',
          'Ziyaretçi kayıtları',
          'Elektronik güvenlik sistemleri işletimi',
          'Anahtar kullanım sistemleri',
        ],
      },
      {
        title: 'Acil durum prosedürleri',
        description:
          'Proje dosyasında yazılı olarak yer alır ve göreve başlamadan önce belirlenir.',
        items: [
          'Yaralanmalarda yapılacak ilk yardımlar',
          'Yangında yapılacak işlemler',
          'Depremde yapılacak işlemler',
          'Bomba ihbarında yapılacak işlemler',
          'Şüpheli paket görüldüğünde yapılacak işlemler',
          'İzinsiz girişlerde yapılacak işlemler',
        ],
      },
      {
        title: 'Denetim',
        description:
          'Proje, denetim sorumluları tarafından 24 saat esasına göre denetlenir ve sonuçlar kontrol formuyla raporlanır.',
        items: [
          'Gündüz denetimi proje sorumlusu tarafından sürekli yapılır',
          'Şirket merkezinden gelen gündüz denetimleri habersizdir',
          'Gece denetimleri merkezden ayda dört kez, plansız yapılır',
          'Görev yerinin düzeni ve personelin görünüşü izlenir',
          'Formların ve kayıtların doğru kullanıldığı kontrol edilir',
          'Olağanüstü durumlar önem derecesine göre müşteriye raporlanır',
        ],
      },
    ],
  },
]

export function findSecurityService(slug: string): SecurityService | undefined {
  return securityServices.find((service) => service.slug === slug)
}
