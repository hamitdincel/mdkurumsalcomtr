/**
 * STATİK İÇERİK / FALLBACK KATMANI
 * ---------------------------------------------------------------------------
 * Veritabanı henüz doldurulmadığında public sayfaların anlamlı içerikle
 * çalışabilmesi için kullanılan nötr, doğrulanabilir metinler.
 *
 * KURAL: Burada hiçbir sayısal başarı iddiası, sahte referans, sahte yorum,
 * sertifika veya teknik kapasite iddiası bulunmaz. Sayısal/kanıt gerektiren
 * her şey yalnızca admin panelinden gerçek veri girildiğinde gösterilir.
 */

import { securityImages } from './images'

export type StaticService = {
  slug: string
  title: string
  shortDescription: string
  icon: string
  intro: string
  problems: string[]
  advantages: { title: string; description: string }[]
  surfaces: string[]
  process: { title: string; description: string }[]
  seoTitle: string
  metaDescription: string
}

export const staticServices: StaticService[] = [
  {
    slug: 'drone-ile-dis-cephe-temizligi',
    title: 'Drone ile Dış Cephe Temizliği',
    shortDescription:
      'Yüksek katlı yapıların dış cephelerinde, personeli yükseklik riskine maruz bırakmadan yürütülen kontrollü temizlik uygulaması.',
    icon: 'Building2',
    intro:
      'Drone ile dış cephe temizliği; su ve uygun temizlik çözeltisinin, uzaktan kumandalı bir hava aracı üzerinden kontrollü biçimde yüzeye uygulanmasıdır. Operasyon, yer ekibi ve pilot koordinasyonuyla yürütülür. Amaç, personelin yüksekte çalışma süresini azaltırken cephe yüzeyine uygun bir temizlik yöntemi uygulamaktır.',
    problems: [
      'İskele veya vinç kurulumunun mimari ya da çevresel nedenlerle zor olduğu cepheler',
      'Bina kullanımını uzun süre aksatmadan yapılması gereken periyodik cephe bakımı',
      'Personelin yüksekte çalışma süresinin azaltılmak istendiği operasyonlar',
      'Erişimi zor kotlarda biriken toz, is, kuş pisliği ve atmosferik kirlilik',
    ],
    advantages: [
      {
        title: 'Yüksekte çalışma süresini azaltır',
        description:
          'Uygulamanın büyük bölümü yerden yönetildiği için personelin yükseklikte geçirdiği süre azalır.',
      },
      {
        title: 'Hızlı kurulum',
        description:
          'İskele kurulumuna kıyasla saha hazırlığı daha kısa sürede tamamlanabilir; ekipman aynı gün konumlandırılabilir.',
      },
      {
        title: 'Erişimi zor noktalara ulaşım',
        description:
          'Çıkma, saçak, kemer ve mimari detay bölgelerine platform kurmadan yaklaşılabilir.',
      },
      {
        title: 'Bina kullanımını daha az etkiler',
        description:
          'Zemin ve giriş alanlarında kalıcı iskele yapısı kurulmadığı için sirkülasyon daha az kısıtlanır.',
      },
    ],
    surfaces: ['Cam cephe', 'Kompozit panel', 'Alüminyum', 'Beton ve sıva', 'Seramik / granit kaplama'],
    process: [
      { title: 'Cephe değerlendirmesi', description: 'Yüzey türü, kirlilik seviyesi ve çevresel koşullar yerinde incelenir.' },
      { title: 'Operasyon planı', description: 'Uçuş güzergâhı, güvenlik alanı ve su/çözelti planı hazırlanır.' },
      { title: 'Uygulama', description: 'Pilot ve yer ekibi koordinasyonuyla temizlik kontrollü şekilde yapılır.' },
      { title: 'Kontrol ve teslim', description: 'Sonuç birlikte incelenir, gerekli noktalarda düzeltme uygulanır.' },
    ],
    seoTitle: 'Drone ile Dış Cephe Temizliği | Yüksek Yapılar için Kontrollü Uygulama',
    metaDescription:
      'Drone ile dış cephe temizliği nasıl yapılır, hangi yüzeylerde uygulanır ve süreç nasıl planlanır? Keşif, operasyon planı ve kontrollü uygulama adımlarıyla ücretsiz keşif talep edin.',
  },
  {
    slug: 'cam-cephe-temizligi',
    title: 'Cam Cephe Temizliği',
    shortDescription:
      'Giydirme cam cephelerde, yüzeye uygun çözelti ve saf su ile leke bırakmayı azaltmayı hedefleyen uygulama.',
    icon: 'PanelsTopLeft',
    intro:
      'Giydirme cam cepheler; toz, atmosferik kirlilik ve yağmur sonrası kireç izlerinden hızla etkilenir. Cam yüzey temizliğinde kullanılan suyun mineral içeriği, kuruma sonrası iz bırakma davranışını doğrudan etkiler. Bu nedenle uygulamada saf su sistemleri ve yüzeye uygun çözelti seçimi önem taşır.',
    problems: [
      'Kuruma sonrası cam üzerinde kalan mineral/kireç izleri',
      'Yüksek kotlardaki panellere erişim zorluğu',
      'Cephe silikon ve conta detaylarının etrafında biriken kir',
      'Ofis kullanımını aksatmadan yapılması gereken periyodik temizlik',
    ],
    advantages: [
      { title: 'Yüzeye uygun çözelti', description: 'Cam ve conta detaylarına uygun, yüzeyi aşındırmayan ürün seçimi yapılır.' },
      { title: 'Saf su yaklaşımı', description: 'Mineral içeriği düşürülmüş su kullanımı, kuruma izlerinin azaltılmasını hedefler.' },
      { title: 'Panel bazlı planlama', description: 'Cephe, panel ve kot bazında bölümlenerek sistematik ilerlenir.' },
      { title: 'Kontrollü su kullanımı', description: 'Uygulama debisi yüzeye ve hava koşuluna göre ayarlanır.' },
    ],
    surfaces: ['Giydirme cam cephe', 'Isıcam üniteler', 'Kaplamalı (low-e) camlar', 'Alüminyum çerçeve detayları'],
    process: [
      { title: 'Cam ve conta kontrolü', description: 'Yüzeydeki hasar, çizik ve conta durumu uygulama öncesi kayıt altına alınır.' },
      { title: 'Test uygulaması', description: 'Küçük bir alanda test yapılarak çözelti ve debi doğrulanır.' },
      { title: 'Bölüm bölüm uygulama', description: 'Cephe kot ve akslara bölünerek sırayla temizlenir.' },
      { title: 'Son kontrol', description: 'Kuruma sonrası yüzey incelenir, gerekli noktalar tekrar edilir.' },
    ],
    seoTitle: 'Cam Cephe Temizliği | Giydirme Cephe için Profesyonel Uygulama',
    metaDescription:
      'Giydirme cam cephe temizliğinde saf su yaklaşımı, yüzeye uygun çözelti seçimi ve panel bazlı planlama. Binanız için ücretsiz keşif talebi oluşturun.',
  },
  {
    slug: 'gunes-paneli-temizligi',
    title: 'Güneş Paneli Temizliği',
    shortDescription:
      'GES sahaları ve çatı üstü kurulumlarda panel yüzeyindeki toz ve kir birikiminin kontrollü biçimde temizlenmesi.',
    icon: 'Sun',
    intro:
      'Fotovoltaik panellerde yüzeyde biriken toz, polen, kuş pisliği ve endüstriyel partiküller ışık geçirgenliğini azaltır. Panel temizliğinde kritik nokta; yüzeyi çizmeyen ekipman, uygun su kalitesi ve panel üreticisinin bakım talimatlarına uyumdur.',
    problems: [
      'Toz ve partikül birikimi nedeniyle azalan yüzey geçirgenliği',
      'Kuş pisliği kaynaklı bölgesel gölgelenme',
      'Geniş saha alanlarında manuel temizliğin uzun sürmesi',
      'Çatı üstü kurulumlarda erişim ve güvenlik zorlukları',
    ],
    advantages: [
      { title: 'Panel yüzeyine uygun uygulama', description: 'Aşındırıcı olmayan yöntemlerle cam yüzey korunarak temizlik yapılır.' },
      { title: 'Geniş sahalarda erişim', description: 'Sıra aralarına ve erişimi zor bölgelere yaklaşım kolaylaşır.' },
      { title: 'Su kalitesi kontrolü', description: 'İz bırakmayı azaltmak için filtrelenmiş/saf su kullanımı planlanır.' },
      { title: 'Üretici talimatına uyum', description: 'Panel üreticisinin bakım dokümanına uygun yöntem seçilir.' },
    ],
    surfaces: ['Monokristal paneller', 'Polikristal paneller', 'Çatı üstü kurulumlar', 'Arazi tipi GES sahaları'],
    process: [
      { title: 'Saha ve panel envanteri', description: 'Panel tipi, dizilim ve erişim koşulları belirlenir.' },
      { title: 'Bakım talimatı kontrolü', description: 'Üretici bakım gereklilikleri gözden geçirilir.' },
      { title: 'Kontrollü temizlik', description: 'Uygun su ve yöntemle panel yüzeyleri temizlenir.' },
      { title: 'Görsel kontrol', description: 'Temizlik sonrası yüzey ve bağlantı noktaları görsel olarak incelenir.' },
    ],
    seoTitle: 'Güneş Paneli Temizliği | GES ve Çatı Üstü Sistemler',
    metaDescription:
      'Güneş paneli temizliği nasıl yapılır? Panel yüzeyine uygun yöntem, su kalitesi ve üretici bakım talimatlarına uyum. GES sahanız için keşif talep edin.',
  },
  {
    slug: 'cati-temizligi',
    title: 'Çatı Temizliği',
    shortDescription:
      'Çatı yüzeylerinde biriken yosun, yaprak ve kirin, çatıya yük bindirmeden temizlenmesi.',
    icon: 'Home',
    intro:
      'Çatı yüzeyleri; yaprak, yosun, is ve kuş atıkları nedeniyle zamanla kirlenir. Bu birikim su tahliyesini olumsuz etkileyebilir. Çatıya personel çıkmadan yapılan uygulamalar, hem yüzey üzerindeki yükü hem de yüksekte çalışma süresini azaltmayı hedefler.',
    problems: [
      'Yosun ve yeşillenme kaynaklı yüzey kirliliği',
      'Dere ve tahliye kanallarında yaprak birikimi',
      'Eğimli veya kırılgan çatılarda üzerinde yürüme riski',
      'Geniş çatı alanlarında uzun süren manuel temizlik',
    ],
    advantages: [
      { title: 'Yüzeye yük bindirmeden', description: 'Kırılgan çatı kaplamalarında üzerinde yürüme ihtiyacı azalır.' },
      { title: 'Geniş alanda hızlı ilerleme', description: 'Büyük çatı alanlarında sistematik ve sürekli ilerleme sağlanır.' },
      { title: 'Tahliye noktalarına dikkat', description: 'Dere ve süzgeç bölgeleri uygulama planında ayrıca ele alınır.' },
      { title: 'Çevre kontrolü', description: 'Uygulama sırasında çevredeki alanlar için koruma planlanır.' },
    ],
    surfaces: ['Kiremit', 'Membran', 'Sandviç panel', 'Trapez sac', 'Beton çatı'],
    process: [
      { title: 'Çatı incelemesi', description: 'Kaplama türü, eğim ve hasarlı bölgeler tespit edilir.' },
      { title: 'Risk ve çevre planı', description: 'Alt kotlarda güvenlik alanı ve su yönetimi planlanır.' },
      { title: 'Uygulama', description: 'Kirlilik türüne uygun yöntemle temizlik yapılır.' },
      { title: 'Tahliye kontrolü', description: 'Dere ve süzgeçlerin akışı kontrol edilir.' },
    ],
    seoTitle: 'Çatı Temizliği | Yosun ve Kir Birikimine Karşı Uygulama',
    metaDescription:
      'Çatı temizliği; yosun, yaprak ve kir birikiminin çatıya yük bindirmeden temizlenmesi. Kaplama türüne uygun yöntem seçimi ve keşif süreci.',
  },
  {
    slug: 'endustriyel-cephe-temizligi',
    title: 'Endüstriyel Cephe ve Fabrika Temizliği',
    shortDescription:
      'Üretim tesislerinde, depolarda ve lojistik merkezlerinde geniş yüzey alanlarının planlı temizliği.',
    icon: 'Factory',
    intro:
      'Endüstriyel yapılarda cephe kirliliği genellikle is, yağ, toz ve proses kaynaklı partiküllerden oluşur. Bu yapılarda temizlik planı; üretim akışını durdurmadan, güvenlik prosedürlerine uygun biçimde kurgulanmalıdır.',
    problems: [
      'Proses kaynaklı is ve partikül birikimi',
      'Geniş cephe alanlarında uzun süren temizlik operasyonları',
      'Üretimin durdurulmasının maliyetli olması',
      'Tesis içi güvenlik prosedürlerine uyum gerekliliği',
    ],
    advantages: [
      { title: 'Üretimi daha az aksatan planlama', description: 'Vardiya ve duruş planına uygun zaman aralıkları belirlenir.' },
      { title: 'Geniş yüzeylerde verimli ilerleme', description: 'Yüksek ve uzun cephelerde sistematik bölümleme yapılır.' },
      { title: 'Tesis güvenlik uyumu', description: 'Saha giriş, İSG ve izin prosedürleri sürecin parçasıdır.' },
      { title: 'Yüzeye özel çözelti', description: 'Sac, panel ve beton yüzeylere uygun ürün seçimi yapılır.' },
    ],
    surfaces: ['Trapez sac cephe', 'Sandviç panel', 'Brüt beton', 'Metal konstrüksiyon', 'Silo ve tank yüzeyleri'],
    process: [
      { title: 'Tesis keşfi', description: 'Cephe alanı, kirlilik türü ve erişim koşulları belirlenir.' },
      { title: 'İSG ve izin süreci', description: 'Tesis prosedürlerine uygun çalışma izinleri tamamlanır.' },
      { title: 'Planlı uygulama', description: 'Belirlenen zaman aralıklarında bölüm bölüm çalışılır.' },
      { title: 'Raporlama', description: 'Uygulama öncesi/sonrası kayıtlar tesis yönetimine iletilir.' },
    ],
    seoTitle: 'Endüstriyel Cephe ve Fabrika Temizliği | Planlı Uygulama',
    metaDescription:
      'Fabrika ve depo cephelerinde is, toz ve partikül birikimine karşı planlı temizlik. Üretimi aksatmayan zamanlama ve İSG uyumlu süreç.',
  },
  {
    slug: 'kompozit-metal-beton-yuzey-temizligi',
    title: 'Kompozit, Metal ve Beton Yüzey Temizliği',
    shortDescription:
      'Farklı malzeme türlerine sahip cephelerde, yüzeye uygun yöntemle yapılan temizlik uygulaması.',
    icon: 'Layers',
    intro:
      'Kompozit panel, metal kaplama ve beton yüzeyler farklı gözeneklilik ve kimyasal dayanım özelliklerine sahiptir. Yanlış ürün veya basınç seçimi yüzeyde kalıcı iz bırakabilir. Bu nedenle uygulama öncesi malzeme tespiti ve test alanı çalışması yapılır.',
    problems: [
      'Yanlış kimyasal seçimi kaynaklı yüzey matlaşması riski',
      'Beton ve taş yüzeylerde gözeneklere işlemiş kirlilik',
      'Metal yüzeylerde oksitlenme ve leke izleri',
      'Farklı malzemelerin bir arada bulunduğu karma cepheler',
    ],
    advantages: [
      { title: 'Malzeme bazlı yöntem', description: 'Her yüzey için ayrı ürün ve uygulama parametresi belirlenir.' },
      { title: 'Test alanı uygulaması', description: 'Görünürlüğü düşük bir bölgede test yapılarak sonuç doğrulanır.' },
      { title: 'Kontrollü basınç', description: 'Yüzey dayanımına göre uygulama şiddeti ayarlanır.' },
      { title: 'Karma cephe planı', description: 'Farklı malzemelerin sınır bölgeleri ayrıca planlanır.' },
    ],
    surfaces: ['Kompozit panel', 'Alüminyum', 'Paslanmaz çelik', 'Brüt beton', 'Doğal taş'],
    process: [
      { title: 'Malzeme tespiti', description: 'Cephedeki malzemeler ve yüzey durumu belirlenir.' },
      { title: 'Test ve doğrulama', description: 'Küçük alanda uygulama testi yapılır.' },
      { title: 'Uygulama', description: 'Onaylanan yöntemle cephe temizlenir.' },
      { title: 'Kontrol', description: 'Yüzeyde iz veya renk farkı olup olmadığı incelenir.' },
    ],
    seoTitle: 'Kompozit, Metal ve Beton Yüzey Temizliği | Malzemeye Uygun Yöntem',
    metaDescription:
      'Kompozit panel, metal ve beton cephelerde malzemeye uygun temizlik yöntemi, test alanı uygulaması ve kontrollü basınç yaklaşımı.',
  },
  {
    slug: 'hali-saha-branda-temizligi',
    title: 'Halı Saha Branda Temizliği',
    shortDescription:
      'Halı saha üstü branda, tente ve kapalı alan örtülerinde biriken yosun, toz ve atmosferik kirliliğin yüzeye uygun yöntemle temizlenmesi.',
    icon: 'Layers',
    intro:
      'Halı sahaların üzerini örten branda ve tente yüzeyleri, sürekli açık havada kaldığı için yosun, kir ve atmosferik birikime maruz kalır. Bu birikim yalnızca görünümü değil, ışık geçirgenliğini ve malzemenin ömrünü de etkiler. Temizlik, örtü malzemesinin türüne uygun basınç ve çözelti seçilerek yapılır; yüksek kotlardaki geniş yüzeylerde drone destekli uygulama kullanılabilir.',
    problems: [
      'Branda yüzeyinde biriken yosun ve küf lekeleri',
      'Işık geçirgenliğinin azalması nedeniyle sahanın gündüz de aydınlatma gerektirmesi',
      'Taşıyıcı profil ve kafes bölgelerinde toz ve kir birikimi',
      'Yüksek ve geniş örtü yüzeylerinde iskele kurmadan erişim ihtiyacı',
    ],
    advantages: [
      {
        title: 'Malzemeye uygun basınç',
        description:
          'Branda türüne göre basınç ve çözelti ayarlanır; aşırı basınç örtüde yıpranma ve dikiş açılmasına yol açabilir.',
      },
      {
        title: 'Işık geçirgenliğinin korunması',
        description:
          'Yüzeydeki birikimin alınması, örtünün ışık geçirme özelliğinin korunmasına katkı sağlar.',
      },
      {
        title: 'İskele kurmadan erişim',
        description:
          'Geniş ve yüksek örtü yüzeylerine sahayı uzun süre kapatmadan yaklaşılabilir.',
      },
      {
        title: 'Saha kullanımını daha az aksatır',
        description:
          'Uygulama planı, sahanın rezervasyon programı dikkate alınarak çıkarılır.',
      },
    ],
    surfaces: ['PVC branda', 'Polietilen örtü', 'Tente kumaşı', 'Kafes ve taşıyıcı profiller'],
    process: [
      {
        title: 'Örtü değerlendirmesi',
        description:
          'Malzeme türü, dikiş ve bağlantı noktalarının durumu ile kirlilik seviyesi yerinde incelenir.',
      },
      {
        title: 'Yöntem ve basınç seçimi',
        description:
          'Malzemeye uygun çözelti ve basınç belirlenir; gerekiyorsa görünmeyen bir bölgede test uygulaması yapılır.',
      },
      {
        title: 'Uygulama',
        description:
          'Temizlik, saha kullanım programına göre planlanan zaman aralığında yürütülür.',
      },
      {
        title: 'Durulama ve kontrol',
        description: 'Yüzey durulanır, sonuç birlikte incelenir ve gerekli noktalarda tekrar edilir.',
      },
    ],
    seoTitle: 'Halı Saha Branda Temizliği | Tente ve Örtü Yüzey Temizliği',
    metaDescription:
      'Halı saha brandası, tente ve kapalı alan örtülerinde yosun ve kir temizliği. Malzemeye uygun basınç ve çözelti seçimiyle kontrollü uygulama.',
  },
]

export type StaticSector = {
  slug: string
  title: string
  shortDescription: string
  icon: string
  intro: string
  needs: string[]
  approach: string[]
  seoTitle: string
  metaDescription: string
}

export const staticSectors: StaticSector[] = [
  {
    slug: 'plazalar-ve-ofis-binalari',
    title: 'Plazalar ve Ofis Binaları',
    shortDescription: 'Kurumsal imajın parçası olan cam cephelerde periyodik bakım planlaması.',
    icon: 'Building',
    intro:
      'Plaza ve ofis binalarında cephe görünümü, kiracı memnuniyeti ve kurumsal imaj açısından belirleyicidir. Temizlik planlaması genellikle mesai saatleri ve otopark/giriş sirkülasyonu dikkate alınarak yapılır.',
    needs: ['Periyodik cephe bakım takvimi', 'Mesaiyi aksatmayan zamanlama', 'Giriş ve otopark güvenliği', 'Yönetime raporlama'],
    approach: ['Bina yönetimiyle takvim planlama', 'Kot bazlı bölümleme', 'Çalışma alanı güvenlik şeridi', 'Öncesi/sonrası kayıt'],
    seoTitle: 'Plaza ve Ofis Binası Cephe Temizliği',
    metaDescription: 'Plaza ve ofis binalarında periyodik cephe temizliği planlaması, mesaiyi aksatmayan zamanlama ve yönetime raporlama.',
  },
  {
    slug: 'gokdelenler-ve-rezidanslar',
    title: 'Gökdelenler ve Rezidanslar',
    shortDescription: 'Yüksek kotlarda erişim ve güvenlik gereksinimi yüksek yapılar.',
    icon: 'Building2',
    intro:
      'Yüksek yapılarda cephe temizliği; rüzgâr koşulları, yüksek kot erişimi ve sakin/kullanıcı güvenliği açısından ayrı bir planlama gerektirir. Operasyon öncesi meteorolojik değerlendirme sürecin parçasıdır.',
    needs: ['Yüksek kotlara erişim', 'Rüzgâr ve hava koşulu takibi', 'Sakinleri bilgilendirme', 'Balkon ve teras detayları'],
    approach: ['Hava durumu penceresine göre planlama', 'Site yönetimi bilgilendirmesi', 'Kot kot ilerleme', 'Güvenlik alanı tanımı'],
    seoTitle: 'Gökdelen ve Rezidans Cephe Temizliği',
    metaDescription: 'Gökdelen ve rezidanslarda yüksek kot cephe temizliği; hava koşulu planlaması, sakin bilgilendirmesi ve güvenlik alanı yönetimi.',
  },
  {
    slug: 'avm-ve-perakende',
    title: 'AVM ve Perakende',
    shortDescription: 'Ziyaretçi sirkülasyonunun yoğun olduğu yapılarda planlı temizlik.',
    icon: 'ShoppingBag',
    intro:
      'AVM ve perakende yapılarında temizlik operasyonu, ziyaretçi trafiğinin düşük olduğu saatlerde planlanır. Giriş bölgeleri, cam yüzeyler ve tabela çevresi öncelikli alanlardır.',
    needs: ['Ziyaretçi trafiğine uyum', 'Giriş ve vitrin bölgeleri', 'Tabela ve logo çevresi', 'Otopark üstü alanlar'],
    approach: ['Düşük trafik saatlerinde çalışma', 'Bölge bölge kapatma planı', 'Yönlendirme ve uyarı ekipmanı', 'Hızlı kuruma takibi'],
    seoTitle: 'AVM ve Perakende Cephe Temizliği',
    metaDescription: 'AVM ve perakende yapılarında ziyaretçi trafiğine uygun cephe ve cam temizliği planlaması.',
  },
  {
    slug: 'oteller-ve-turizm',
    title: 'Oteller ve Turizm Tesisleri',
    shortDescription: 'Misafir deneyimini etkilemeyen, sezon dışına planlanabilen bakım.',
    icon: 'Hotel',
    intro:
      'Otellerde cephe görünümü doğrudan misafir algısını etkiler. Temizlik planı genellikle sezon yoğunluğu ve doluluk oranına göre yapılır; gürültü ve su akışı yönetimi önem taşır.',
    needs: ['Sezon dışı planlama', 'Misafir konforu', 'Havuz ve teras çevresi', 'Deniz/tuz kaynaklı kirlilik'],
    approach: ['Doluluk takvimine göre planlama', 'Blok bazlı ilerleme', 'Gürültü ve su yönetimi', 'Öncesi/sonrası kayıt'],
    seoTitle: 'Otel ve Turizm Tesisi Cephe Temizliği',
    metaDescription: 'Otellerde sezon planına uygun cephe temizliği; misafir konforunu gözeten zamanlama ve blok bazlı uygulama.',
  },
  {
    slug: 'hastaneler-ve-saglik',
    title: 'Hastaneler ve Sağlık Tesisleri',
    shortDescription: 'Kesintisiz hizmet veren tesislerde düşük etkili uygulama planı.',
    icon: 'HeartPulse',
    intro:
      'Sağlık tesislerinde operasyon 7/24 sürer. Bu nedenle temizlik planı; acil giriş, ambulans yolu ve hasta odalarının bulunduğu bölgeler dikkate alınarak hazırlanır.',
    needs: ['Kesintisiz hizmet uyumu', 'Acil giriş ve ambulans yolu', 'Gürültü kontrolü', 'Hijyen prosedürlerine uyum'],
    approach: ['Tesis yönetimiyle bölge planı', 'Kritik girişlerin korunması', 'Düşük yoğunluk saatleri', 'Bilgilendirme ve yönlendirme'],
    seoTitle: 'Hastane ve Sağlık Tesisi Cephe Temizliği',
    metaDescription: 'Hastanelerde kesintisiz hizmeti aksatmayan cephe temizliği planlaması; kritik giriş ve bölge yönetimi.',
  },
  {
    slug: 'okullar-ve-kampusler',
    title: 'Okullar ve Kampüsler',
    shortDescription: 'Eğitim takvimine göre planlanan geniş alan temizliği.',
    icon: 'GraduationCap',
    intro:
      'Okul ve kampüs yapılarında temizlik genellikle tatil dönemlerine veya ders dışı saatlere planlanır. Geniş yerleşkelerde birden fazla bloğun sıralı biçimde ele alınması gerekir.',
    needs: ['Eğitim takvimine uyum', 'Çok bloklu yerleşke planı', 'Öğrenci güvenliği', 'Spor salonu ve yüksek tavanlı yapılar'],
    approach: ['Tatil dönemi planlaması', 'Blok sıralaması', 'Alan güvenliği', 'Yerleşke yönetimine raporlama'],
    seoTitle: 'Okul ve Kampüs Cephe Temizliği',
    metaDescription: 'Okul ve kampüslerde eğitim takvimine uygun cephe temizliği; çok bloklu yerleşkelerde sıralı planlama.',
  },
  {
    slug: 'fabrikalar-ve-sanayi',
    title: 'Fabrikalar ve Sanayi Tesisleri',
    shortDescription: 'Üretim akışını durdurmadan yürütülen geniş yüzey uygulamaları.',
    icon: 'Factory',
    intro:
      'Sanayi tesislerinde cephe temizliği; İSG prosedürleri, çalışma izinleri ve üretim planı ile birlikte kurgulanır. Proses kaynaklı kirlilik türü, ürün seçimini doğrudan etkiler.',
    needs: ['Üretim planına uyum', 'İSG ve çalışma izinleri', 'Proses kaynaklı kirlilik', 'Yüksek ve uzun cepheler'],
    approach: ['Duruş planına göre zamanlama', 'İzin süreçlerinin yönetimi', 'Kirlilik türüne uygun ürün', 'Bölüm bazlı ilerleme'],
    seoTitle: 'Fabrika ve Sanayi Tesisi Cephe Temizliği',
    metaDescription: 'Fabrikalarda üretimi aksatmayan cephe temizliği; İSG uyumu, izin süreçleri ve proses kirliliğine uygun yöntem.',
  },
  {
    slug: 'enerji-santralleri',
    title: 'Enerji Santralleri ve GES Sahaları',
    shortDescription: 'Geniş panel sahalarında sistematik temizlik operasyonu.',
    icon: 'Zap',
    intro:
      'Güneş enerjisi santrallerinde panel yüzeyindeki kirlilik, ışık geçirgenliğini etkiler. Geniş sahalarda temizlik; dizi (string) bazlı planlama ve saha erişim koşullarına göre yürütülür.',
    needs: ['Geniş saha planlaması', 'Panel üreticisi bakım talimatı', 'Su kalitesi yönetimi', 'Saha erişim koşulları'],
    approach: ['Dizi bazlı bölümleme', 'Talimata uygun yöntem', 'Filtrelenmiş su kullanımı', 'Uygulama kayıtları'],
    seoTitle: 'GES ve Enerji Santrali Panel Temizliği',
    metaDescription: 'Güneş enerjisi santrallerinde dizi bazlı panel temizliği planlaması, su kalitesi yönetimi ve üretici talimatına uyum.',
  },
  {
    slug: 'lojistik-ve-depolar',
    title: 'Lojistik Merkezleri ve Depolar',
    shortDescription: 'Yüksek tavanlı, geniş cepheli yapılarda hızlı ilerleme.',
    icon: 'Warehouse',
    intro:
      'Depo ve lojistik yapıları genellikle uzun ve yüksek cephelere sahiptir. Sevkiyat trafiği devam ederken çalışılabilmesi için rampa ve manevra alanlarının planlamaya dahil edilmesi gerekir.',
    needs: ['Sevkiyat trafiğiyle uyum', 'Rampa ve manevra alanları', 'Uzun cephe planlaması', 'Trapez sac yüzeyler'],
    approach: ['Sevkiyat saatlerine göre planlama', 'Cephe aks bölümleme', 'Alan güvenliği', 'Sac yüzeye uygun ürün'],
    seoTitle: 'Lojistik Merkezi ve Depo Cephe Temizliği',
    metaDescription: 'Depo ve lojistik merkezlerinde sevkiyatı aksatmayan cephe temizliği; uzun cephelerde aks bazlı planlama.',
  },
  {
    slug: 'kamu-ve-belediye',
    title: 'Kamu Binaları ve Belediyeler',
    shortDescription: 'Kamuya açık yapılarda planlı ve şeffaf süreç yönetimi.',
    icon: 'Landmark',
    intro:
      'Kamu yapılarında temizlik operasyonu; vatandaş sirkülasyonu, tarihi/korunması gereken cephe detayları ve idari onay süreçleri dikkate alınarak planlanır.',
    needs: ['Vatandaş sirkülasyonu', 'Hassas cephe detayları', 'İdari onay süreçleri', 'Şeffaf raporlama'],
    approach: ['Yoğunluk dışı saat planı', 'Hassas yüzeylerde test uygulaması', 'Süreç dokümantasyonu', 'Öncesi/sonrası kayıt'],
    seoTitle: 'Kamu Binası ve Belediye Cephe Temizliği',
    metaDescription: 'Kamu binalarında planlı cephe temizliği; hassas yüzeylerde test uygulaması ve şeffaf raporlama.',
  },
]

/** Ana sayfa "Nasıl Çalışır" adımları. */
export const processSteps = [
  {
    number: '01',
    title: 'İhtiyaç Analizi',
    description:
      'Yapı türü, cephe alanı, yüzey malzemesi ve kirlilik durumu hakkında ilk bilgileri alıyoruz. Bu aşamada beklentiler ve zaman kısıtları netleşir.',
  },
  {
    number: '02',
    title: 'Keşif ve Yüzey Değerlendirmesi',
    description:
      'Sahada cepheyi inceliyor, yüzey malzemesini ve çevresel koşulları değerlendiriyoruz. Uygulanabilirlik bu aşamada teyit edilir.',
  },
  {
    number: '03',
    title: 'Operasyon Planlama',
    description:
      'Uçuş güzergâhı, güvenlik alanı, su ve çözelti planı ile çalışma takvimi hazırlanır. Bina yönetimiyle zamanlama üzerinde mutabık kalınır.',
  },
  {
    number: '04',
    title: 'Uygulama',
    description:
      'Pilot ve yer ekibi koordinasyonuyla temizlik, planlanan bölümleme sırasına göre kontrollü biçimde yürütülür.',
  },
  {
    number: '05',
    title: 'Kontrol ve Teslim',
    description:
      'Uygulama sonrası yüzey birlikte incelenir, gerekli noktalarda düzeltme yapılır ve iş teslim edilir.',
  },
] as const

/** Teknoloji bölümü hotspot'ları. Gerçek donanım bilgisi admin panelinden girilir. */
export const techHotspots = [
  {
    id: 'spray',
    title: 'Püskürtme Sistemi',
    description:
      'Temizlik çözeltisinin yüzeye kontrollü biçimde uygulanmasını sağlayan nozul ve dağıtım düzeneği.',
    position: { x: 30, y: 62 },
  },
  {
    id: 'pressure',
    title: 'Basınç Kontrolü',
    description: 'Uygulama basıncı, yüzey türüne ve kirlilik seviyesine göre ayarlanır.',
    position: { x: 52, y: 78 },
  },
  {
    id: 'safety',
    title: 'Güvenlik Bağlantıları',
    description: 'Operasyon sırasında ekipman ve hortum yönetimi için kullanılan bağlantı düzeni.',
    position: { x: 68, y: 46 },
  },
  {
    id: 'camera',
    title: 'Operasyon Kamerası',
    description: 'Pilotun yüzeyi ve uygulama sonucunu gerçek zamanlı takip etmesini sağlar.',
    position: { x: 46, y: 34 },
  },
  {
    id: 'flight',
    title: 'Uçuş Sistemi',
    description: 'Konum ve yükseklik kontrolünü sağlayan uçuş kontrol bileşenleri.',
    position: { x: 50, y: 18 },
  },
  {
    id: 'ground',
    title: 'Yerdeki Su ve Filtre Ünitesi',
    description:
      'Su hazırlığı, filtreleme ve besleme işlemlerinin yürütüldüğü yer ünitesi. Su kalitesi, kuruma izlerini doğrudan etkiler.',
    position: { x: 22, y: 88 },
  },
] as const

/** Ana sayfa problem/çözüm bölümü avantajları. */
export const solutionAdvantages = [
  { title: 'Daha düşük yüksekte çalışma riski', description: 'Personelin yükseklikte geçirdiği süre azalır.', icon: 'ShieldCheck' },
  { title: 'Hızlı kurulum', description: 'Saha hazırlığı iskele kurulumuna göre daha kısa sürede tamamlanabilir.', icon: 'Timer' },
  { title: 'Ulaşılması zor alanlara erişim', description: 'Mimari detay ve çıkma bölgelerine platform kurmadan yaklaşılır.', icon: 'Move3d' },
  { title: 'İş akışını daha az aksatma', description: 'Zeminde kalıcı yapı kurulmadığı için sirkülasyon daha az kısıtlanır.', icon: 'Workflow' },
  { title: 'Kontrollü uygulama', description: 'Basınç, debi ve çözelti yüzeye göre ayarlanır.', icon: 'SlidersHorizontal' },
  { title: 'Farklı yüzeylere uygun süreç', description: 'Cam, kompozit, metal ve beton için ayrı uygulama planı hazırlanır.', icon: 'Layers' },
] as const

/**
 * Hero altındaki operasyon rayı.
 * Yalnızca yöntemin doğası gereği doğru olan, şirketin arkasında durabileceği
 * ifadeler kullanılır. Sayısal iddia veya üstünlük iddiası içermez.
 */
export const operationRail = [
  'İskele Kurulumu Olmadan',
  'Yüksek Kotlara Erişim',
  'Kontrollü Uygulama',
  'İş Güvenliği Odaklı',
] as const

/** Hero altı güven göstergeleri (ikonlu varyant — iç sayfalarda kullanılır). */
export const trustIndicators = [
  { label: 'İş Güvenliği Odaklı', icon: 'ShieldCheck' },
  { label: 'Profesyonel Operasyon', icon: 'Users' },
  { label: 'Modern Drone Teknolojisi', icon: 'Cpu' },
  { label: 'Kurumsal Çözüm', icon: 'Building2' },
] as const

/** "Neden Biz" maddeleri. */
export const whyUsItems = [
  {
    title: 'Keşif ve projelendirme',
    description: 'Her yapı için ayrı değerlendirme yapılır; standart bir paket dayatılmaz.',
    icon: 'ClipboardCheck',
  },
  {
    title: 'Eğitimli operasyon ekibi',
    description: 'Uygulama, pilot ve yer ekibinin koordineli çalışmasıyla yürütülür.',
    icon: 'Users',
  },
  {
    title: 'İş güvenliği prosedürleri',
    description: 'Çalışma alanı güvenliği, uyarı ve yönlendirme planı operasyonun parçasıdır.',
    icon: 'HardHat',
  },
  {
    title: 'Yüzeye göre uygulama planı',
    description: 'Malzeme türüne uygun ürün ve parametre seçilir; gerektiğinde test alanı uygulanır.',
    icon: 'Layers',
  },
  {
    title: 'Şeffaf teklif süreci',
    description: 'Kapsam, süre ve dahil olan işler teklifte açıkça belirtilir.',
    icon: 'FileText',
  },
  {
    title: 'Operasyon sonrası kontrol',
    description: 'İş teslim edilmeden önce sonuç birlikte incelenir.',
    icon: 'CheckCircle2',
  },
] as const

/**
 * ÇALIŞMA PRENSİPLERİ (Hakkımızda sayfası)
 * ---------------------------------------------------------------------------
 * Kaynak: "MD GROUP KATALOG.pdf" § Kalite hedefleri (5 madde) ve § Denetleme.
 * Şirketin kendi taahhütleridir; sayısal başarı iddiası içermez.
 */
export const workPrinciples = [
  {
    title: 'Kalite hedefleri işe başlamadan belirlenir',
    description:
      'İhtiyaç, beklenti ve hedefler işe başlamadan önce müşteriyle birlikte tanımlanır; uygun çözüm alternatifleri onaya sunulur.',
  },
  {
    title: 'Personel profili müşteriyle birlikte seçilir',
    description:
      'Görev yerinin ve kurumun yapısına uygunluk profili müşteriyle beraber belirlenir; işe alım süreci bu plan üzerinden ilerler.',
  },
  {
    title: 'Müşteri ilişkileri düzenli toplantılarla yürütülür',
    description:
      'Değişen ihtiyaçlar, operasyonel gelişmeler ve eğitim ihtiyaçları önceden belirlenmiş tarihlerde birlikte değerlendirilir.',
  },
  {
    title: 'Fiyat politikası bütçeyle birlikte kurulur',
    description:
      'Hizmet, müşterinin rekabet gücüne katkı sağladığı sürece sürdürülebilir. Birim fiyat tablosu şeffaf biçimde onaya sunulur.',
  },
  {
    title: 'Hizmet sürekli denetlenip iyileştirilir',
    description:
      'Değişen risk ve koşullar karşısında ekipler düzenli eğitimle geliştirilir; uygunsuzluklar düzeltici faaliyet kaydına bağlanır.',
  },
] as const

/**
 * DENETİM RİTMİ
 * Kaynak: "MD GROUP KATALOG.pdf" § Denetleme. Yalnızca dokümanda açıkça
 * belirtilen periyotlar yazılır.
 */
export const auditRhythm = [
  {
    label: 'Gündüz denetimi',
    detail: 'Proje sorumlusu tarafından sürekli, sahada yürütülür.',
  },
  {
    label: 'Habersiz denetim',
    detail: 'Şirket merkezinden, önceden planlama yapılmadan gerçekleştirilir.',
  },
  {
    label: 'Gece denetimi',
    detail: 'Ayda 4 kez, haftanın değişen gün ve saatlerinde yapılır.',
  },
  {
    label: 'Aylık rapor',
    detail: 'Denetim sonuçları rapor hâline getirilip işverene sunulur.',
  },
] as const

/**
 * REFERANSLAR — hizmet verilen kurumlar
 * ---------------------------------------------------------------------------
 * Kaynak: "MD REFERANSLARIMIZ.xlsx" (7 sektör sayfası).
 *
 * KVKK / VERİ MİNİMİZASYONU: Kaynak dosyada kurum adlarının yanında müşteri
 * temsilcilerinin AD-SOYAD ve CEP TELEFONU bilgileri de bulunuyordu. Bunlar
 * üçüncü kişilerin kişisel verisidir ve buraya BİLİNÇLİ OLARAK ALINMAMIŞTIR.
 * Yalnızca kurum/işletme adı yayınlanır. Aynı sebeple, kaynak listede kişi adı
 * olarak geçen kayıtlar da dışarıda bırakılmıştır.
 *
 * Bu liste bir referans beyanıdır; sayısal başarı iddiası içermez.
 */
export type ReferenceGroup = {
  title: string
  institutions: string[]
}

export const referenceGroups: ReferenceGroup[] = [
  {
    title: 'Kamu Kurum ve Kuruluşları',
    institutions: [
      'DSİ 14. Bölge Müdürlüğü',
      'DSİ 14. Bölge Sosyal Tesisleri',
      'DSİ Orhantepe Sosyal Tesisleri',
      'TRT Genel Müdürlüğü',
      'TRT İç Yapımlar Daire Başkanlığı',
      'Türkiye Su Enstitüsü',
      'Bolu Belediyesi',
      'Esenler Belediyesi Kültür Müdürlüğü',
      'Küçükçekmece Sosyal Yardımlaşma Vakfı',
      'İstanbul Proje Koordinasyon Birimi',
      'İstanbul Varlık Yönetimi',
      'Sermaye Piyasası Lisanslama Sicil ve Eğitim Kuruluşu',
    ],
  },
  {
    title: 'Sağlık ve Sosyal Hizmet',
    institutions: [
      'Türk Kızılayı Lojistik A.Ş.',
      'Türk Kızılay Tuzla AFAD',
      'Türk Kızılayı Heybeliada Kamp İşletmesi',
      'Bağcılar Avrupa Bölge Kızılay Kan Merkezi',
      'Kartal Kızılay Marmara Bölgesi Kan Merkezi',
      'Çekmeköy Kızılay Kan Merkezi',
      'Şanlıurfa Kızılay Aşevi',
      'Erzincan Kızılay İçecek A.Ş.',
      'İstanbul Huzur Hastanesi ve Dinlenme Evleri Vakfı',
      'Biruni Diş Hastanesi',
      'Dentbul Diş Hastanesi',
    ],
  },
  {
    title: 'Eğitim Kurumları',
    institutions: [
      'İstanbul Aydın Üniversitesi (Esenyurt, Bahçelievler, Kadıköy, Florya)',
      'İstanbul Bilgi Üniversitesi santralistanbul',
      'Koç Üniversitesi Rektörlüğü',
      'İstanbul Üniversitesi',
      'Mimar Sinan Güzel Sanatlar Üniversitesi',
      'İbn Haldun Üniversitesi',
      '29 Mayıs Üniversitesi',
      'Nişantaşı Üniversitesi',
      'Biruni Üniversitesi',
      'FMV Işık Üniversitesi (Maslak, Şile)',
      'Işık Okulları (Ayazağa, Erenköy, Ispartakule, Nişantaşı)',
      'Biltes Koleji (Sadabat, Kemerburgaz)',
      'Fenerbahçe Koleji',
      'Irmak Okulları',
      'Özel NDS Okulları',
      'Şefkat Okulları',
      'Cervantes Enstitüsü',
    ],
  },
  {
    title: 'Plaza ve İş Merkezleri',
    institutions: [
      'Maslak No Bir',
      'Giz 2000 Plaza',
      'Koza Plaza Tekstilkent',
      'Ayazağa Ticaret Merkezi',
      'Arkon Residence',
      'TEM Plaza',
      'Hamamcıoğlu Müesseseleri',
      'Karaca Züccaciye Genel Müdürlüğü',
      'Birollar Mercedes',
      'Carglass (Oto Cam Tic.)',
      'Eramita',
      'Türkiye Futbol Federasyonu Riva',
    ],
  },
  {
    title: 'Konut ve Toplu Yapı',
    institutions: [
      'Avrupa Konutları Çamlı Vadi Toplu Yapı',
      'TOKİ Esenler 1. Etap 1. Kısım Site Yönetimi',
      'TOKİ Esenler 1. Etap 2. Kısım Site Yönetimi',
      'Sürgü Gayrimenkul Yatırım A.Ş.',
    ],
  },
  {
    title: 'AVM ve Perakende',
    institutions: [
      'Oasis Cadde AVM',
      'E Çarşı',
      'Mustafa Kemal Kültür ve Alışveriş Merkezi (DAT Market)',
      'Mimsan Mobilyacılar Çarşısı',
    ],
  },
  {
    title: 'Sanayi ve Üretim',
    institutions: [
      'Atlas Uluslararası A.Ş.',
      'Asbant Bant',
      'Kan-Er Tekstil',
      'Karahancı Çay',
      'Rella Gıda',
      'İz Baskı',
      'Ongun Emgin Gıda',
      'Pusula Call Center',
    ],
  },
  {
    title: 'Konsolosluklar',
    institutions: ['İspanya İstanbul Başkonsolosluğu', 'Polonya Başkonsolosluğu'],
  },
]

/**
 * DİĞER HİZMETLERİMİZ — grup çatısı altındaki tamamlayıcı hizmetler
 * ---------------------------------------------------------------------------
 * Kaynak: "MD GROUP KATALOG.pdf" ve "YEDİTEPE GÜVENLİK TANITIM.pdf".
 * Yalnızca bu dokümanlarda AÇIKÇA sayılan hizmet başlıkları listelenir.
 *
 * KURAL: Sitenin ana odağı drone destekli yüzey temizliğidir. Bu liste
 * tamamlayıcı bir blok olarak, tek bir bölümde ve kompakt biçimde gösterilir;
 * drone içeriğiyle yarışacak şekilde öne çıkarılmaz.
 *
 * Buraya sayısal iddia, sertifika veya kapasite bilgisi YAZILMAZ — dokümanlarda
 * geçse dahi doğrulanabilir olana kadar dışarıda bırakılır.
 */
export type OtherServiceGroup = {
  /** Detay sayfasındaki bölüm çapası — kartlar buraya derin bağlantı verir. */
  id: string
  title: string
  icon: string
  description: string
  /** Kart kapak görseli (bkz. securityImages). */
  image: string
  items: string[]
}

export const otherServiceGroups: OtherServiceGroup[] = [
  {
    id: 'ozel-guvenlik',
    title: 'Özel Güvenlik Hizmetleri',
    icon: 'ShieldCheck',
    image: securityImages.hospital,
    description:
      '5188 sayılı kanunun öngördüğü koşullarda, güvenlik eğitimini almış ve özel güvenlik kimlik kartına sahip personelle sabit noktalı koruma hizmeti.',
    items: [
      'Alışveriş merkezleri',
      'Akıllı bina, site ve plazalar',
      'Hastaneler ve sağlık tesisleri',
      'Okullar ve eğitim kurumları',
      'Oteller',
      'Özel konutlar',
      'Kamu kurum ve kuruluşları',
      'Belediyeler ve bağlı kuruluşlar',
      'Fabrika ve şantiyeler',
      'Toplu ulaşım noktaları',
    ],
  },
  {
    id: 'organizasyon-koruma',
    title: 'Organizasyon ve Özel Koruma',
    icon: 'Users',
    image: securityImages.vip,
    description:
      'Kısa süreli organizasyonlar ve kişiye özel koruma ihtiyaçları için, güvenlik risk değerlendirmesi sonrasında kurulan geçici güvenlik organizasyonu.',
    items: [
      'Fuar, konser ve seminer güvenliği',
      'Stadyum ve spor tesisi güvenliği',
      'Havaalanı güvenliği',
      'VIP ve yakın koruma',
      'Kısa süreli (part-time) güvenlik',
      'K9 patlayıcı arama ekipleri',
      'Medya ve basın kuruluşları',
      'Özel karşılama ve uğurlamalar',
    ],
  },
  {
    id: 'elektronik-guvenlik',
    title: 'Elektronik Güvenlik Sistemleri',
    icon: 'Cpu',
    image: securityImages.mall,
    description:
      'Tesisin ihtiyacı olan donanım, gerekli analizler yapıldıktan sonra kurulur ve işletilir.',
    items: [
      'CCTV kumanda ve gözetim merkezleri',
      'CCTV kamera sistemleri',
      'Yangın, soygun ve gaz ihbar alarm sistemleri',
      'Elektronik turnike ve bariyerler',
      'X-Ray cihazları',
      'Kapı ve el tipi metal dedektörleri',
      'Kartlı geçiş (access) sistemleri',
      'Bekçi tur kontrol sistemi',
    ],
  },
  {
    /*
     * Diğer üç başlık "ne verildiğini", bu başlık "nasıl işletildiğini"
     * anlatır (tanıtım dokümanındaki "Bina ve Tesis Güvenliği" bölümü).
     * Mekân türleri birinci başlıkta listelendiği için burada tekrarlanmaz.
     */
    id: 'bina-tesis',
    title: 'Bina ve Tesis Güvenliği',
    icon: 'Workflow',
    image: securityImages.facility,
    description:
      'Proje kapsamındaki alanlarda gözetim ve denetim; etkin devriye sistemiyle kurulan sistemli bir güvenlik ağı.',
    items: [
      'Giriş ve çıkış kontrolleri',
      'Devriye sistemi ve tur kontrolü',
      'Güvenlik sistemleri operatörlüğü',
      'Ziyaretçi kayıt ve yönlendirme',
      'Acil durumlarda müdahale',
      'Site ve konut güvenliği',
    ],
  },
]

/**
 * YEDİTEPE ÖZEL GÜVENLİK — /hizmetler/yeditepe-guvenlik sayfası içeriği.
 *
 * Hizmet KALEMLERİ ayrıca tanımlanmaz; yukarıdaki `otherServiceGroups` tek
 * kaynak olarak kullanılır. Aynı liste iki yerde tutulsaydı biri güncellenip
 * diğeri unutulurdu.
 *
 * Buradaki metinler yalnızca SÜREÇ ve MEVZUAT anlatımıdır. Personel sayısı,
 * lokasyon adedi, deneyim yılı, SLA taahhüdü veya sertifika gibi hiçbir
 * doğrulanmamış iddia yer ALMAZ — rakip sitelerde standart olan bu ifadeler
 * bilinçli olarak dışarıda bırakılmıştır. Belgelenebilir bilgiler
 * siteConfig.company altında toplanır ve boş oldukları sürece gösterilmez.
 */
export const yeditepeSecurity = {
  /**
   * Süreç. Her adım tanıtım dokümanlarında yazılı olana dayanır; süre veya
   * adet taahhüdü eklenmemiştir. Tek istisna gece denetim sayısıdır ve o da
   * MD GROUP kataloğunda açıkça "ayda 4 kez" olarak geçer.
   */
  process: [
    {
      title: 'Keşif ve risk değerlendirmesi',
      description:
        'Mekân fiziksel olarak detaylı incelenir; güvenlik noktaları, devriye güzergâhları ve giriş-çıkış kapıları belirlenir.',
    },
    {
      title: 'Proje dosyası',
      description:
        'Görev talimatları, vardiya çizelgesi, riskli noktalar, ziyaretçi kaydı ve acil durum prosedürleri tek dosyada toplanır.',
    },
    {
      title: 'Personel temini',
      description:
        'Başvuru, mesleki yeterlilik gözlemi ve sağlık taramasından geçen personel, müşteriyle mutabık kalınan plan üzerinden göreve başlar.',
    },
    {
      title: 'Denetim ve raporlama',
      description:
        'Gündüz denetimleri habersiz yapılır; gece denetimleri şirket merkezinden ayda dört kez, plansız olarak gerçekleştirilir.',
    },
  ],

  /**
   * Hizmeti satın alanın yükümlülük tarafı. Tamamı MD GROUP kataloğunun
   * "AVANTAJLARINIZ", "YILLIK İZİN VE HASTALIK BOŞLUKLARI" ve "ÜNİFORMA"
   * başlıklarından alınmıştır — pazarlama cümlesi değil, sözleşme konusu.
   */
  advantages: [
    {
      title: 'Personel yükümlülükleri şirkete ait',
      description:
        'İstihdam edilen personelin ücret, ihbar ve kıdem tazminatı, SGK ve yan ödemeleri ile mevzuattan doğan diğer borç ve yükümlülükleri hizmeti veren şirkete aittir.',
    },
    {
      title: 'Mali sorumluluk sigortası',
      description:
        'Görevlendirilen personel için Özel Güvenlik Mali Sorumluluk Sigortası yaptırılır.',
    },
    {
      title: 'İzin ve hastalık boşlukları doldurulur',
      description:
        'Yıllık izin veya beklenmeyen hastalık nedeniyle oluşan boşluklar, görev aksamadan doldurulur; geçici personel en az asli personelle aynı yeterlilikte olur.',
    },
    {
      title: 'Bakanlık onaylı üniforma',
      description:
        'Görevlendirilen personel, İçişleri Bakanlığı tarafından onaylanan üniformayı giyer.',
    },
  ],

  /** K9 hizmetinin uygulanabildiği alanlar (Yeditepe tanıtımı, K9 sayfası). */
  k9Areas: [
    'Kişiye özel',
    'Tesis içi veya dışı',
    'Çeşitli etkinlik ve organizasyonlar',
    'Özel karşılama ve uğurlamalar',
    'Mevcut projeler',
  ],

  /** Organizasyonlarda fiziki güvenliği tamamlayan ekipman (part-time hizmetler). */
  eventEquipment: [
    'El tipi metal dedektör',
    'Kapı tipi metal dedektör',
    'X-Ray kontrol cihazı',
    'Yönlendirme bantları',
    'Eskort araçları',
    'Telsiz',
  ],

  /** Cevapların tamamı mevzuattan, grup yapısından veya tanıtım dokümanından. */
  faqs: [
    {
      question: 'Güvenlik hizmetini MD Kurumsal mı veriyor?',
      answer:
        'Hayır. Özel güvenlik ve elektronik güvenlik hizmetleri, grup bünyesindeki Yeditepe Koruma ve Güvenlik Hizmetleri Ltd. Şti. tarafından verilir. Yüzey temizliği ve güvenlik ayrı ekiplerle yürütülür; talebinizi tek noktadan iletebilir, ilgili şirkete yönlendirilmesini isteyebilirsiniz.',
    },
    {
      question: 'Özel güvenlik hizmeti hangi mevzuata tabi?',
      answer:
        '5188 sayılı Özel Güvenlik Hizmetlerine Dair Kanun ve bu kanunun uygulanmasına ilişkin yönetmelik. Hizmet, bu kapsamda faaliyet izni bulunan şirket ve kimlik kartlı personel ile verilir.',
    },
    {
      question: 'Personelin SGK, kıdem ve ihbar yükümlülüğü kime ait?',
      answer:
        'Hizmeti veren şirkete aittir. İstihdam edilen personelin ücret, ihbar ve kıdem tazminatı, Özel Güvenlik Mali Sorumluluk Sigortası, SGK primleri ve yan ödemeleri ile mevzuattan doğan diğer yükümlülükleri şirket tarafından karşılanır; bu konularda işverene rücu edilmez.',
    },
    {
      question: 'Personel izne çıktığında veya hastalandığında görev aksar mı?',
      answer:
        'Yıllık izin ve beklenmeyen hastalık nedeniyle oluşan boşluklar, görevin aksamasına fırsat verilmeden doldurulur. Geçici olarak görevlendirilen personelin en az asli personelle aynı yeterlilik ve performans seviyesinde olması sağlanır.',
    },
    {
      question: 'Hizmet nasıl denetleniyor?',
      answer:
        'Gündüz çalışan personelin denetimi proje sorumlusu tarafından sürekli yapılır ve şirket merkezinden gelen gündüz denetimleri habersizdir. Gece denetimleri ise merkez tarafından ayda dört kez, haftanın değişik gün ve saatlerinde plansız olarak gerçekleştirilir. Denetimler kontrol formuna göre yapılır ve raporlanır.',
    },
    {
      question: 'Fiziki güvenlik ile elektronik sistemler birlikte alınabilir mi?',
      answer:
        'Evet. CCTV kumanda ve gözetim merkezleri, kartlı geçiş, turnike ve bariyerler, X-Ray cihazları, metal dedektörleri ve yangın ihbar sistemleri, sabit noktalı personel hizmetiyle birlikte planlanabilir.',
    },
    {
      question: 'Kısa süreli veya etkinlik güvenliği veriliyor mu?',
      answer:
        'Evet. Konser, fuar, seminer ve spor faaliyetleri gibi kısa süreli organizasyonlarda saat ya da vardiya bazında güvenlik hizmeti verilir. Alınacak tedbirler, etkinlik öncesinde yapılan güvenlik risk değerlendirmesi sonucunda belirlenir.',
    },
    {
      question: 'Güvenlik personeli eğitimi de veriliyor mu?',
      answer:
        '5188 sayılı kanunun yürürlüğe girmesiyle birlikte açılan eğitim kurumlarında, İstanbul ve İzmir\'de özel güvenlik eğitimi verilmektedir. Eğitim, hem bünyede istihdam edilecek personeli hem de diğer kurum ve kuruluşları kapsar.',
    },
  ],
} as const

/** Ana sayfa kullanım alanları kartları. */
export const useCases = [
  { title: 'Plazalar', slug: 'plazalar-ve-ofis-binalari', icon: 'Building' },
  { title: 'Gökdelenler', slug: 'gokdelenler-ve-rezidanslar', icon: 'Building2' },
  { title: "AVM'ler", slug: 'avm-ve-perakende', icon: 'ShoppingBag' },
  { title: 'Oteller', slug: 'oteller-ve-turizm', icon: 'Hotel' },
  { title: 'Hastaneler', slug: 'hastaneler-ve-saglik', icon: 'HeartPulse' },
  { title: 'Okullar / Kampüsler', slug: 'okullar-ve-kampusler', icon: 'GraduationCap' },
  { title: 'Fabrikalar', slug: 'fabrikalar-ve-sanayi', icon: 'Factory' },
  { title: 'Rezidanslar', slug: 'gokdelenler-ve-rezidanslar', icon: 'Home' },
  { title: 'Güneş Enerjisi Santralleri', slug: 'enerji-santralleri', icon: 'Sun' },
  { title: 'Depolar / Lojistik', slug: 'lojistik-ve-depolar', icon: 'Warehouse' },
] as const

/** Varsayılan SSS içerikleri (admin panelinden düzenlenebilir/eklenebilir). */
export const staticFaqs = [
  {
    question: 'Drone ile dış cephe temizliği nasıl yapılır?',
    answer:
      'Uygulama, temizlik çözeltisinin ve suyun uzaktan kumandalı bir hava aracı üzerinden yüzeye kontrollü biçimde iletilmesiyle yapılır. Yerde su hazırlığı ve besleme ünitesi bulunur; pilot ve yer ekibi koordineli çalışır. Öncesinde cephe değerlendirmesi ve operasyon planı hazırlanır.',
  },
  {
    question: 'Her bina için uygun mudur?',
    answer:
      'Hayır. Uygunluk; cephe malzemesi, bina yüksekliği, çevredeki yapılaşma, rüzgâr koşulları ve uçuşa ilişkin yasal kısıtlar dikkate alınarak keşif sonrasında belirlenir. Uygun olmayan durumlarda alternatif yöntem önerilir.',
  },
  {
    question: 'Hangi yüzeylerde kullanılabilir?',
    answer:
      'Cam cephe, kompozit panel, alüminyum, metal kaplama, beton ve benzeri yüzeylerde uygulanabilir. Her malzeme için ürün ve uygulama parametresi ayrı belirlenir; hassas yüzeylerde önce test alanı çalışması yapılır.',
  },
  {
    question: 'Temizlik ne kadar sürer?',
    answer:
      'Süre; cephe alanı, kirlilik seviyesi, yüzey türü ve hava koşullarına göre değişir. Net süre keşif sonrasında, teklif ile birlikte paylaşılır.',
  },
  {
    question: 'Hava koşulları operasyonu etkiler mi?',
    answer:
      'Evet. Rüzgâr hızı, yağış ve görüş koşulları operasyonun yapılabilirliğini doğrudan etkiler. Uygun olmayan koşullarda çalışma, güvenlik gerekçesiyle ertelenir.',
  },
  {
    question: 'Keşif gerekiyor mu?',
    answer:
      'Evet. Doğru yöntem ve gerçekçi bir teklif için cephenin yerinde değerlendirilmesi gerekir. Keşif talebi web sitesi üzerinden oluşturulabilir.',
  },
  {
    question: 'Drone kullanımı bina çevresini etkiler mi?',
    answer:
      'Uygulama sırasında çalışma alanı sınırlandırılır, yönlendirme yapılır ve su akışı yönetilir. Otopark, giriş ve yaya alanları için önceden koruma planı hazırlanır.',
  },
  {
    question: 'Çalışma sırasında bina kullanımına devam edilebilir mi?',
    answer:
      'Genellikle evet. Çalışma bölümlere ayrılır ve yalnızca aktif çalışılan bölgede geçici kısıtlama uygulanır. Plan, bina yönetimiyle birlikte belirlenir.',
  },
  {
    question: 'Teklif nasıl hesaplanır?',
    answer:
      'Teklif; cephe alanı, yüzey türü, kirlilik seviyesi, bina yüksekliği, erişim koşulları ve çalışma takvimi dikkate alınarak hazırlanır. Web sitesi üzerinden otomatik kesin fiyat verilmez; talebiniz keşif sonrasında fiyatlandırılır.',
  },
  {
    question: 'Hangi şehirlerde hizmet veriyorsunuz?',
    answer:
      'Hizmet verilen lokasyonlar iletişim sayfasında güncel olarak paylaşılır. Listede olmayan bir lokasyon için talebinizi iletebilirsiniz; uygunluk değerlendirilerek dönüş yapılır.',
  },
] as const

/** Teklif formu seçenek listeleri. */
export const buildingTypes = [
  'Plaza / Ofis Binası',
  'Rezidans',
  'Gökdelen',
  'AVM',
  'Otel',
  'Hastane',
  'Okul / Kampüs',
  'Fabrika / Üretim Tesisi',
  'Depo / Lojistik Merkezi',
  'GES / Enerji Santrali',
  'Kamu Binası',
  'Diğer',
] as const

export const surfaceTypes = [
  'Cam cephe',
  'Kompozit panel',
  'Alüminyum',
  'Metal / Trapez sac',
  'Beton',
  'Doğal taş / Granit',
  'Sıva / Boya',
  'Güneş paneli',
  'Karma / Emin değilim',
] as const

export const dirtLevels = [
  { value: 'LIGHT', label: 'Hafif — genel toz' },
  { value: 'MEDIUM', label: 'Orta — görünür kirlilik, su izleri' },
  { value: 'HEAVY', label: 'Yoğun — is, yağ, yosun veya kuş atığı' },
  { value: 'UNKNOWN', label: 'Emin değilim' },
] as const

export const timeframes = [
  { value: 'URGENT', label: 'En kısa sürede' },
  { value: 'WITHIN_MONTH', label: '1 ay içinde' },
  { value: 'WITHIN_QUARTER', label: '1-3 ay içinde' },
  { value: 'PLANNING', label: 'Sadece planlama aşamasındayım' },
] as const
