import type { Metadata } from 'next'
import { getPathname } from '@/lib/i18n/navigation'
import type { Locale } from '@/lib/i18n/routing'
import { SITE_URL } from './site'

export type Href = '/' | '/publicaciones' | '/investigacion' | '/docencia' | '/biografia' | '/contacto'

/** Las 6 páginas, en el orden del menú. */
export const PAGES: Href[] = ['/', '/publicaciones', '/investigacion', '/docencia', '/biografia', '/contacto']

/** URL absoluta de una página en un idioma (slug traducido y trailing slash vienen de next-intl). */
export const pageUrl = (locale: Locale, href: Href) => SITE_URL + getPathname({ locale, href })
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
    alternates: {
      canonical: url(locale, href),
      languages: { es: url('es', href), en: url('en', href), 'x-default': url('es', href) },
    },
  }
}
