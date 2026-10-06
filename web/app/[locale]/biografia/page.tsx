import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Disclosure, ReadMore } from '@/components/disclosure'
import { PageHero } from '@/components/page-hero'
import { Paragraphs } from '@/components/portable-text'
import type { Locale } from '@/lib/i18n/routing'
import { getBiografiaPage } from '@/lib/sanity/fetch'
import { pageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/biografia'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const [page, t] = await Promise.all([getBiografiaPage(locale), getTranslations({ locale, namespace: 'Meta' })])
  return pageMetadata({
    locale,
    href: '/biografia',
    title: page?.seo?.metaTitle ?? `${page?.heading ?? ''} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
  })
}

const bodyClass = 'text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug'

export default async function Page({ params }: PageProps<'/[locale]/biografia'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const [page, t, tc] = await Promise.all([
    getBiografiaPage(locale),
    getTranslations({ locale, namespace: 'Biografia' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  if (!page) return null

  const [first, ...rest] = page.intro ?? []
  const awards = page.awards ?? []

  return (
    <main>
      <PageHero title={page.heading ?? ''} />

      <section className="px-[var(--gutter)] py-[clamp(2rem,6vw,5.5rem)] md:grid md:grid-cols-[1fr_2fr] md:gap-x-[clamp(1.5rem,4vw,5rem)]">
        <div className="max-w-[44rem] md:col-start-2">
          {first && <Paragraphs blocks={[first]} className={bodyClass} />}
          {rest.length > 0 && (
            <ReadMore more={tc('readMore')} less={tc('readLess')}>
              <div className="flex flex-col gap-6 pt-6">
                <Paragraphs blocks={rest} className={bodyClass} />
              </div>
            </ReadMore>
          )}
        </div>
      </section>

      {awards.length > 0 && (
        <section className="px-[var(--gutter)] pb-[clamp(2rem,6vw,5.5rem)]">
          <h2 className="text-[clamp(2.25rem,4.4vw,4.25rem)] leading-tight font-normal tracking-tight">
            {t('awards')}
          </h2>
          <div className="mt-[clamp(1.5rem,4vw,3.5rem)] flex flex-col gap-3 md:gap-0 md:border-t md:border-line">
            {awards.map((a) => (
              <Disclosure
                key={a._key}
                variant="row"
                title={a.name}
                meta={a.year}
                titleClassName="text-lg leading-snug md:text-[clamp(1.25rem,1.8vw,1.75rem)]"
              >
                <p className="text-sm leading-snug md:max-w-[40rem]">{a.description}</p>
              </Disclosure>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
