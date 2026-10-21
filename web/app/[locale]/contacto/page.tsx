import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContactCard } from '@/components/contact-card'
import { PageHero } from '@/components/page-hero'
import type { Locale } from '@/lib/i18n/routing'
import { getContactoPage, getSiteSettings } from '@/lib/sanity/fetch'
import { pageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/contacto'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const [page, t] = await Promise.all([getContactoPage(locale), getTranslations({ locale, namespace: 'Meta' })])
  return pageMetadata({
    locale,
    href: '/contacto',
    title: page?.seo?.metaTitle ?? `${page?.heading ?? ''} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
  })
}

export default async function Page({ params }: PageProps<'/[locale]/contacto'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const [page, settings, t] = await Promise.all([
    getContactoPage(locale),
    getSiteSettings(locale),
    getTranslations({ locale, namespace: 'Contact' }),
  ])
  if (!page) return null

  const items = (settings?.footerInfo ?? []).filter((i) => i.label && i.url)

  return (
    <main>
      <PageHero title={page.heading ?? ''} />
      {items.length > 0 && (
        <section data-nav-tone="light" className="px-[var(--gutter)] py-[clamp(2rem,6vw,5.5rem)]">
          <ul
            aria-label={t('nav')}
            className="grid grid-cols-1 gap-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-4"
          >
            {items.map((item, i) => (
              <ContactCard key={item._key} label={item.label!} url={item.url!} external={t('external')} delay={i * 0.08} />
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
