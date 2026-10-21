import type { Metadata } from 'next'
import { getPathname } from '@/lib/i18n/navigation'
import type { Locale } from '@/lib/i18n/routing'
import { SITE_URL } from './site'

export type Href = '/' | '/publicaciones' | '/investigacion' | '/docencia' | '/biografia' | '/contacto'

/** Las 6 páginas, en el orden del menú. */
export const PAGES: Href[] = ['/', '/publicaciones', '/investigacion', '/docencia', '/biografia', '/contacto']

/**
 * URL absoluta de una página en un idioma. El slug traducido viene de next-intl; la barra final se
 * agrega aquí porque `getPathname` no la pone y el sitio responde 308 a la versión sin barra
 * (`trailingSlash: true`): el canonical debe ser la URL final, no la que redirige.
 */
export const pageUrl = (locale: Locale, href: Href) => {
  const path = getPathname({ locale, href })
  return SITE_URL + (path.endsWith('/') ? path : `${path}/`)
}
const url = pageUrl

/** Título, descripción, canonical y hreflang (es, en, x-default) de una página. */
export function pageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale
  href: Href
  title: string
  description: string
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: 'Carlos Conca',
      locale: locale === 'es' ? 'es_CL' : 'en_US',
      title,
      description,
      url: url(locale, href),
    },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: url(locale, href),
      languages: { es: url('es', href), en: url('en', href), 'x-default': url('es', href) },
    },
  }
}
