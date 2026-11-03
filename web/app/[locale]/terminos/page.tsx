import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalPage } from '@/components/legal-page'
import type { Locale } from '@/lib/i18n/routing'
import { getTerminosPage } from '@/lib/sanity/fetch'
import { pageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/terminos'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const [page, t] = await Promise.all([getTerminosPage(locale), getTranslations({ locale, namespace: 'Meta' })])
  return pageMetadata({
    locale,
    href: '/terminos',
    title: page?.seo?.metaTitle ?? `${page?.heading ?? ''} – ${t('siteName')}`,
    description: page?.seo?.metaDescription ?? t('description'),
  })
}

export default async function Page({ params }: PageProps<'/[locale]/terminos'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const page = await getTerminosPage(locale)
  if (!page) return null
  return <LegalPage locale={locale} page={page} />
}
