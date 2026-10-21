import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CareerStats } from '@/components/career-stats'
import { Hero } from '@/components/hero'
import { ResearchAreas } from '@/components/research-areas'
import { Timeline } from '@/components/timeline'
import type { Locale } from '@/lib/i18n/routing'
import { getHomePage } from '@/lib/sanity/fetch'
import { pageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const [home, t] = await Promise.all([getHomePage(locale), getTranslations({ locale, namespace: 'Meta' })])
  return pageMetadata({
    locale,
    href: '/',
    title: home?.seo?.metaTitle ?? t('siteName'),
    description: home?.seo?.metaDescription ?? t('description'),
  })
}

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const [home, meta] = await Promise.all([
    getHomePage(locale as Locale),
    getTranslations('Meta'),
  ])

  return (
    <main>
      <Hero
        name={home?.displayName ?? meta('siteName')}
        affiliation={home?.affiliation ?? ''}
      />
      <CareerStats stats={home?.stats ?? []} />
      <ResearchAreas
        intro={home?.areasIntro ?? ''}
        areas={home?.researchAreas ?? []}
      />
      <Timeline timeline={home?.timeline ?? []} />
    </main>
  )
}
