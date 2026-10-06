import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHero } from '@/components/page-hero'
import { PublicationsBrowser } from '@/components/publications/publications-browser'
import type { Locale } from '@/lib/i18n/routing'
import { getPublicacionesPage, getPublications } from '@/lib/sanity/fetch'
import { buildHaystack, CATEGORIES, type Publication } from '@/lib/search/filter'
import { pageMetadata } from '@/lib/seo/metadata'
import { doiFromLink } from '@/lib/seo/site'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/publicaciones'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const page = await getPublicacionesPage(locale)
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return pageMetadata({
    locale,
    href: '/publicaciones',
    title: page?.seo?.metaTitle ?? `${page?.heading ?? 'Publicaciones'} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
  })
}

export default async function Page({ params }: PageProps<'/[locale]/publicaciones'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const tp = await getTranslations({ locale, namespace: 'Publications' })
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
      <PageHero
        title={page?.heading ?? t('publications')}
        aside={
          <p
            aria-label={tp('countLabel', { count: items.length })}
            className="text-[clamp(1.25rem,5vw,1.75rem)] tabular-nums md:hidden"
          >
            {items.length}
          </p>
        }
      />

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
