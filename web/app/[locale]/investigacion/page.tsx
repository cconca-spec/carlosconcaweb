import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AreasAccordion } from '@/components/investigacion/areas-accordion'
import { PageHero } from '@/components/page-hero'
import { Paragraphs, type RichBlock } from '@/components/portable-text'
import type { Locale } from '@/lib/i18n/routing'
import { getInvestigacionPage } from '@/lib/sanity/fetch'
import { pageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/investigacion'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const [page, t] = await Promise.all([getInvestigacionPage(locale), getTranslations({ locale, namespace: 'Meta' })])
  return pageMetadata({
    locale,
    href: '/investigacion',
    title: page?.seo?.metaTitle ?? `${page?.heading ?? ''} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
  })
}

export default async function Page({ params }: PageProps<'/[locale]/investigacion'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const [page, t] = await Promise.all([
    getInvestigacionPage(locale),
    getTranslations({ locale, namespace: 'Investigacion' }),
  ])
  if (!page) return null

  const areas = (page.areas ?? []).flatMap((a) =>
    a.title && a.slug?.current
      ? [
          {
            key: a._key,
            slug: a.slug.current,
            title: a.title,
            blocks: (a.body ?? []) as RichBlock[],
            applications: a.applications ?? [],
            applicationsLabel: t('applications'),
            keyPublicationsLabel: t('keyPublications'),
          },
        ]
      : [],
  )

  return (
    <main>
      <PageHero title={page.heading ?? ''} />

      <section className="px-[var(--gutter)] py-[clamp(2rem,6vw,5.5rem)] md:grid md:grid-cols-[1fr_2fr] md:gap-x-[clamp(1.5rem,4vw,5rem)]">
        <div className="flex max-w-[44rem] flex-col gap-6 md:col-start-2">
          <Paragraphs blocks={page.intro} className="text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug" />
        </div>
      </section>

      {areas.length > 0 && (
        <section className="px-[var(--gutter)] pb-[clamp(2rem,6vw,5.5rem)] md:grid md:grid-cols-[1fr_2fr] md:gap-x-[clamp(1.5rem,4vw,5rem)]">
          <h2 className="mb-6 text-[clamp(2rem,3.6vw,3.5rem)] leading-tight tracking-tight md:mb-0">{t('areasTitle')}</h2>
          <AreasAccordion areas={areas} />
        </section>
      )}
    </main>
  )
}
