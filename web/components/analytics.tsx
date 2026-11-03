import Script from 'next/script'
import { GA_HOSTS, GA_MEASUREMENT_ID } from '@/lib/analytics'

/**
 * GA4 sin cookies de publicidad: Google Signals y la personalización de anuncios van desactivados.
 * `afterInteractive` para no competir con el LCP; los cambios de ruta los registra la medición
 * mejorada de GA4 (evento de historial del navegador).
 */
export function Analytics() {
  const init = `(function(){
if(${JSON.stringify(GA_HOSTS)}.indexOf(location.hostname)<0)return;
var s=document.createElement('script');s.async=true;
s.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
document.head.appendChild(s);
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','${GA_MEASUREMENT_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});
})();`
  return <Script id="ga4" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: init }} />
}
