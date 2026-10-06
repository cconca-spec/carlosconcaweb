import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PublicationsBrowser } from '@/components/publications/publications-browser'
import { getPathname } from '@/lib/i18n/navigation'
import type { Locale } from '@/lib/i18n/routing'
import { getPublicacionesPage, getPublications } from '@/lib/sanity/fetch'
import { buildHaystack, CATEGORIES, type Publication } from '@/lib/search/filter'
import { doiFromLink, SITE_URL } from '@/lib/seo/site'

const url = (locale: Locale) => SITE_URL + getPathname({ locale, href: '/publicaciones' })

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/publicaciones'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const page = await getPublicacionesPage(locale)
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return {
    title: page?.seo?.metaTitle ?? `${page?.heading ?? 'Publicaciones'} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
    alternates: {
      canonical: url(locale),
      languages: { es: url('es'), en: url('en'), 'x-default': url('es') },
    },
  }
}

export default async function Page({ params }: PageProps<'/[locale]/publicaciones'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const [page, rows, t] = await Promise.all([
    getPublicacionesPage(locale),
    getPublications(),
    getTranslations({ locale, namespace: 'Nav' }),
  ])

  const items: Publication[] = rows.flatMap((r) => {
    if (!r.title || !r.year || !r.category || !CATEGORIES.includes(r.category)) return []
    const base = { title: r.title, citation: r.citation ?? '', collaborators: r.collaborators ?? '' }
    return [{ id: r._id, year: r.year, category: r.category, link: r.link ?? null, ...base, haystack: buildHaystack(base) }]
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page?.heading ?? t('publications'),
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => {
      const doi = doiFromLink(p.link)
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'ScholarlyArticle',
          name: p.title,
          datePublished: String(p.year),
          ...(p.citation && { isPartOf: { '@type': 'Periodical', name: p.citation } }),
          ...(p.collaborators && { author: p.collaborators }),
          ...(p.link && { url: p.link }),
          ...(doi && { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: doi } }),
        },
      }
    }),
  }

  return (
    <main>
      <section
        data-nav-tone="dark"
        className="bg-tl-bg px-[var(--gutter)] pt-[calc(var(--nav-h)+clamp(2rem,5vw,4.5rem))] pb-[clamp(2rem,5vw,4.5rem)] text-paper-50"
      >
        <h1 className="text-[clamp(2.25rem,4.4vw,4.25rem)] leading-tight font-normal tracking-tight">
          {page?.heading ?? t('publications')}
        </h1>
      </section>

      <section className="px-[var(--gutter)] py-[clamp(2rem,5vw,4.5rem)]">
        <PublicationsBrowser items={items} />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </main>
  )
}
