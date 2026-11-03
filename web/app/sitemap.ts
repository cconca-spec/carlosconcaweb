import type { MetadataRoute } from 'next'
import { routing } from '@/lib/i18n/routing'
import { getContentDates } from '@/lib/sanity/fetch'
import type { PageType } from '@/lib/sanity/tags'
import { type Href, PAGES, pageUrl } from '@/lib/seo/metadata'

const TYPE_OF: Record<Href, PageType> = {
  '/': 'homePage',
  '/publicaciones': 'publicacionesPage',
  '/investigacion': 'investigacionPage',
  '/docencia': 'docenciaPage',
  '/biografia': 'biografiaPage',
  '/contacto': 'contactoPage',
  '/privacidad': 'privacidadPage',
  '/terminos': 'terminosPage',
}

/** Una URL por página e idioma (16), cada una con sus alternativas hreflang. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dates = await getContentDates()
  const updated = (href: Href, locale: string) => {
    const page = dates.pages.find((p) => p._type === TYPE_OF[href] && p.language === locale)?._updatedAt
    // Las publicaciones viven en /publicaciones: su fecha cuenta también para esa página.
    const latest = href === '/publicaciones' ? [page, dates.publications] : [page]
    return latest.filter((d): d is string => !!d).sort().at(-1)
  }

  return PAGES.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: pageUrl(locale, href),
      lastModified: updated(href, locale),
      alternates: {
        languages: {
          es: pageUrl('es', href),
          en: pageUrl('en', href),
          'x-default': pageUrl('es', href),
        },
      },
    })),
  )
}
