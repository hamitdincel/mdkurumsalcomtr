/**
 * FLASH ÖNLEYİCİ TEMA SCRIPT'İ
 * ---------------------------------------------------------------------------
 * React hydration'dan önce, ilk boyadan da önce senkron çalışır. Kullanıcının
 * daha önce seçtiği tema localStorage'dan okunup <html> üzerine yazılır.
 *
 * Neden inline ve bloklayan?
 *   Tema tercihi kullanıcıya özeldir. Sunucuda cookie okuyarak çözmek, kök
 *   layout'u dinamik hale getirir ve ana sayfanın ISR (revalidate = 900)
 *   davranışını bozardı. Bloklayan minik bir script bu bedeli ödemeden
 *   "yanlış temayla bir kare çizme" (FOUC) sorununu tamamen ortadan kaldırır.
 *
 * İKİ BAĞIMSIZ TEMA
 *   Public site ve yönetim paneli AYRI anahtarlar kullanır. Panelde koyu tema
 *   seçmek siteyi etkilemez; ikisi de aynı <html> üzerinde çalıştığı için
 *   ayrım, hangi anahtarın okunacağının URL'den belirlenmesiyle sağlanır.
 *
 * Seçim yoksa hiçbir öznitelik yazılmaz; globals.css içindeki
 * `prefers-color-scheme` kuralı devreye girer.
 */

export const SITE_THEME_KEY = 'md-theme'
export const ADMIN_THEME_KEY = 'md-theme-admin'

/** URL'ye göre hangi tema anahtarının geçerli olduğunu döndürür. */
export function themeKeyForPath(pathname: string): string {
  return pathname.startsWith('/admin') ? ADMIN_THEME_KEY : SITE_THEME_KEY
}

const script = `(function(){try{
var k=location.pathname.indexOf('/admin')===0?'${ADMIN_THEME_KEY}':'${SITE_THEME_KEY}';
var t=localStorage.getItem(k);
var e=document.documentElement;
if(t==='light'||t==='dark'){e.setAttribute('data-theme',t)}else{e.removeAttribute('data-theme')}
}catch(e){}})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
