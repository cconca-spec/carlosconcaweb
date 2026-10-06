import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { InlinePeople, PeopleList } from '@/components/docencia/people-list'
import { Disclosure } from '@/components/disclosure'
import { PageHero } from '@/components/page-hero'
import { blockText, Paragraphs } from '@/components/portable-text'
import type { Locale } from '@/lib/i18n/routing'
import { getDocenciaPage } from '@/lib/sanity/fetch'
import { pageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/docencia'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const [page, t] = await Promise.all([getDocenciaPage(locale), getTranslations({ locale, namespace: 'Meta' })])
  return pageMetadata({
    locale,
    href: '/docencia',
    title: page?.seo?.metaTitle ?? `${page?.heading ?? ''} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
  })
}

const sectionClass = 'px-[var(--gutter)] py-[clamp(2rem,6vw,5.5rem)]'
const labelClass = 'text-xs tracking-wide uppercase md:text-sm'
const bodyClass = 'text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug'
const listTitle = 'text-base font-semibold md:text-sm'

export default async function Page({ params }: PageProps<'/[locale]/docencia'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const [page, t] = await Promise.all([getDocenciaPage(locale), getTranslations({ locale, namespace: 'Docencia' })])
  if (!page) return null

  const chile = page.doctoratesChile ?? []
  const intl = page.doctorates ?? []
  const engineers = page.engineers ?? []
  const [postdocLead, ...postdocRest] = page.postdocs ?? []

  return (
    <main>
      <PageHero title={page.heading ?? ''} />

      <section className={`${sectionClass} grid gap-6 md:grid-cols-[1fr_2fr] md:gap-x-[clamp(1.5rem,4vw,5rem)]`}>
        {page.eyebrow && <p className={labelClass}>{page.eyebrow}</p>}
        <div className="flex max-w-[44rem] flex-col gap-6">
          {/* El WordPress repetía la frase destacada como tercer párrafo de la intro. */}
          <Paragraphs blocks={(page.intro ?? []).filter((b) => blockText(b) !== page.statement)} className={bodyClass} />
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-[clamp(2rem,6vw,5.5rem)]">
        {page.statement && (
          <p className="max-w-[60rem] text-[clamp(1.5rem,3.4vw,3.25rem)] leading-[1.15] tracking-tight">
            {page.statement}
          </p>
        )}

        <div className="mt-[clamp(1.5rem,4vw,3.5rem)] flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-x-[clamp(1.5rem,3vw,3rem)]">
          <Disclosure title={t('chile')} meta={chile.length} titleClassName={listTitle}>
            <PeopleList people={chile} />
          </Disclosure>
          <Disclosure title={t('international')} meta={intl.length} titleClassName={listTitle}>
            <PeopleList people={intl} />
          </Disclosure>
          <Disclosure title={t('engineers')} meta={engineers.length} titleClassName={listTitle}>
            <InlinePeople people={engineers} />
          </Disclosure>
        </div>

        {page.genealogy?.url && (
          <p className="mt-6">
            <a href={page.genealogy.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">
              {page.genealogy.label}
            </a>
          </p>
        )}
      </section>

      {postdocLead && (
        <section className={sectionClass}>
          <Disclosure
            variant="split"
            title={t('postdocs')}
            titleClassName="text-base font-medium md:text-xs md:font-normal md:tracking-wide md:uppercase"
            summary={<Paragraphs blocks={[postdocLead]} className={bodyClass} />}
          >
            <div className="flex flex-col gap-6 md:mt-6">
              <Paragraphs blocks={postdocRest} className={bodyClass} />
            </div>
          </Disclosure>
        </section>
      )}

      {(page.programs ?? []).length > 0 && (
        <section className={`${sectionClass} md:grid md:grid-cols-[1fr_2fr] md:gap-x-[clamp(1.5rem,4vw,5rem)]`}>
          <h2 className={`${labelClass} mb-4 md:mb-0`}>{t('programs')}</h2>
          <div className="flex max-w-[44rem] flex-col gap-3 md:gap-8">
            {(page.programs ?? []).map((p) => (
              <Disclosure
                key={p._key}
                title={<span className="font-semibold">{p.name}</span>}
                meta={p.period}
                titleClassName="text-base md:text-[clamp(1.0625rem,1.6vw,1.5rem)] md:leading-snug"
              >
                <p className={bodyClass}>{p.description}</p>
              </Disclosure>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
