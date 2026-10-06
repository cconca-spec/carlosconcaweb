import type { Metadata } from 'next'
import { getPathname } from '@/lib/i18n/navigation'
import type { Locale } from '@/lib/i18n/routing'
import { SITE_URL } from './site'

type Href = '/' | '/publicaciones' | '/investigacion' | '/docencia' | '/biografia' | '/contacto'

const url = (locale: Locale, href: Href) => SITE_URL + getPathname({ locale, href })

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
