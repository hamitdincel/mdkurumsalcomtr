'use client'

import Script from 'next/script'
import { useConsent } from './consent-provider'

type AnalyticsIds = {
  gaMeasurementId: string
  gtmId: string
  metaPixelId: string
}

/**
 * Üçüncü taraf scriptleri.
 *
 * KURAL: Script'ler yalnızca kullanıcı ilgili kategoriye onay verdiyse DOM'a
 * eklenir. Onay yoksa hiçbir istek yapılmaz — "consent mode default denied"
 * yaklaşımının ötesinde, script hiç yüklenmez.
 *
 * strategy="afterInteractive" ile LCP'yi etkilemeyecek şekilde yüklenir.
 */
export function AnalyticsScripts({ ids }: { ids: AnalyticsIds }) {
  const { consent } = useConsent()

  const analyticsAllowed = consent?.analytics === true
  const marketingAllowed = consent?.marketing === true

  return (
    <>
      {analyticsAllowed && ids.gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${ids.gtmId}');`}
        </Script>
      )}

      {analyticsAllowed && ids.gaMeasurementId && !ids.gtmId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ids.gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${ids.gaMeasurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {marketingAllowed && ids.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${ids.metaPixelId}');fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  )
}

/**
 * Consent Mode v2 varsayılanı.
 * Script'lerden ÖNCE çalışır ve tüm sinyalleri "denied" olarak başlatır.
 */
export function ConsentModeDefaults() {
  return (
    // App Router'da beforeInteractive root layout içinde desteklenir; kural
    // pages/_document dönemine aittir.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="consent-defaults" strategy="beforeInteractive">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});`}
    </Script>
  )
}
