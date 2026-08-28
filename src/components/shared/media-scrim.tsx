import { cn } from '@/lib/utils'

type MediaScrimProps = {
  /**
   * caption : metin yalnızca ALTTA (kart, proje kapağı) → tek alt rampa
   * hero    : metin SOL SÜTUNDA + üstte saydam header → yatay yıkama
   */
  variant?: 'caption' | 'hero'
  /**
   * Caption varyantını hafifletir. Fotoğrafın kendisi öne çıksın istenen
   * yerlerde kullanılır: metin okunacak kadar taban alır ama görsel
   * belirgin biçimde kararmaz.
   */
  soft?: boolean
  className?: string
}

/**
 * GÖRSEL ÜZERİ OKUNABİLİRLİK KARARTMASI
 *
 * Neden ortak bileşen: karartma her yerde elle yazılıyordu ve hero'larda iki
 * ayrı TAM KAPLAMA gradyan (yatay + dikey) üst üste biniyordu. İkisi çarpınca
 * kadrajın büyük bölümünde efektif opaklık %90'ı aşıyordu; fotoğraf artık
 * görünmüyordu. Karartma dekorasyon değil, yalnızca metnin oturduğu yere
 * kontrast vermek için var — bu yüzden artık METİN NEREDEYSE ORASI kararır,
 * kadrajın geri kalanı açıkta kalır.
 *
 * Ortak kural: her rampa karşı uçta TAM ŞEFFAFA iner (`to-transparent`).
 * Eskiden `to-scrim/10` gibi bir taban bırakılıyordu; tek başına önemsiz
 * görünse de ikinci katmanla çarpılınca görselin en parlak yerini bile
 * soluklaştırıyordu.
 */
export function MediaScrim({ variant = 'caption', soft, className }: MediaScrimProps) {
  if (variant === 'hero') {
    return (
      <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
        {/*
          MOBİL — dikey rampa.
          Dar ekranda metin sütunu kadrajın tamamını kaplar (breadcrumb en
          üstte, CTA en altta, satırlar sağ kenara kadar uzanır); yatay bir
          yıkama satır sonlarını korumasız bırakır. Bu yüzden mobilde fotoğraf
          bilinçli olarak atmosferik bir zemine iner: üstte bile %45 taban var,
          ama eski kurulumun %90+ bileşkesinin çok altında.
        */}
        <div className="from-scrim/92 via-scrim/72 to-scrim/45 absolute inset-0 bg-gradient-to-t from-0% via-45% md:hidden" />

        {/*
          md+ — ana katman YATAY.
          Geniş ekranda metin (breadcrumb → başlık → açıklama → meta → CTA) tek
          bir sol sütunda kalır; dikey rampa onu koruyamaz çünkü sütun kadrajın
          üstünden altına uzanır. Yıkama metnin bittiği ~%75'e kadar taşır, sağ
          çeyrek fotoğrafa bırakılır.
        */}
        <div className="from-scrim/85 via-scrim/55 absolute inset-0 hidden bg-gradient-to-r from-0% via-38% to-transparent to-75% md:block" />
        {/* Alt taban: tam genişlikteki meta/CTA satırını ve alt kenarı oturtur. */}
        <div className="from-scrim/70 via-scrim/25 absolute inset-0 hidden bg-gradient-to-t from-0% via-30% to-transparent to-60% md:block" />
        {/* Üst bant: header hero üzerinde saydam ve beyaz metinlidir. */}
        <div className="from-scrim/70 via-scrim/40 absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b via-45% to-transparent md:block" />
      </div>
    )
  }

  /*
   * KART ALTYAZISI — kartın tamamına değil, METİN BLOĞUNA sabitlenir.
   *
   * Önce kadraja oranlı bir rampaydı ("alt %35'i karart"). Dar kartlarda
   * başlık üç, açıklama beş satıra sarınca metin kartın neredeyse tamamını
   * kaplıyor; oranlı rampa başlığın üst satırlarına hiç yetişmiyor ve yazı
   * parlak fotoğrafın (gökyüzü, güneş paneli, beyaz cephe) içinde kayboluyordu.
   * Rampayı büyütmek de çözüm değil — o zaman görsel yine tümüyle kararıyor.
   *
   * Bu yüzden karartma artık metnin GERÇEK yüksekliğini takip eder: bloğun
   * arkası taban, hemen üstünde 5rem'lik geçiş bandı. Metin ne kadar uzarsa
   * karartma da o kadar uzar, bir piksel fazlası değil; üstteki fotoğraf her
   * durumda dokunulmadan kalır.
   *
   * Kullanım: `relative` bir sarmalayıcının İÇİNE, metin bloğunun kardeşi
   * olarak konur (bkz. service-card.tsx, case-studies.tsx).
   */
  return (
    <>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-t',
          soft ? 'from-scrim/70 to-scrim/45' : 'from-scrim/95 to-scrim/80',
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-full bg-gradient-to-t to-transparent',
          soft ? 'from-scrim/45 h-14' : 'from-scrim/80 h-20',
        )}
      />
    </>
  )
}
