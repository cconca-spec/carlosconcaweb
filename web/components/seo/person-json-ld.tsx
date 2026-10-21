import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/routing'
import { getHomePage, getSiteSettings } from '@/lib/sanity/fetch'
import { pageUrl } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'
import { JsonLd } from './json-ld'

const isUrl = (u: string | null | undefined): u is string => !!u && /^https?:\/\//.test(u)

/** Entidad `Person` del profesor. El mismo `@id` en ES y EN: Google lo trata como una sola persona. */
export async function PersonJsonLd({ locale }: { locale: Locale }) {
  const [home, settings, t] = await Promise.all([
    getHomePage(locale),
    getSiteSettings(locale),
    getTranslations({ locale, namespace: 'Person' }),
  ])

  const topics = (home?.researchAreas ?? []).map((a) => a.title).filter(Boolean)

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: home?.displayName ?? 'Carlos Conca',
        url: pageUrl(locale, '/'),
        jobTitle: t('jobTitle'),
        description: home?.affiliation ?? t('description'),
        nationality: { '@type': 'Country', name: t('nationality') },
        award: t('award'),
        affiliation: { '@type': 'CollegeOrUniversity', name: t('university'), url: 'https://uchile.cl' },
        ...(topics.length > 0 && { knowsAbout: topics }),
        sameAs: (settings?.sameAs ?? []).filter(isUrl),
      }}
    />
  )
}
