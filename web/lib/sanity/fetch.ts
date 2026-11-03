import { cacheLife, cacheTag } from 'next/cache'
import { client } from './client'
import {
  BIOGRAFIA_PAGE_QUERY,
  CONTENT_DATES_QUERY,
  CONTACTO_PAGE_QUERY,
  DOCENCIA_PAGE_QUERY,
  HOME_PAGE_QUERY,
  INVESTIGACION_PAGE_QUERY,
  PRIVACIDAD_PAGE_QUERY,
  PUBLICACIONES_PAGE_QUERY,
  PUBLICATIONS_QUERY,
  SITE_SETTINGS_QUERY,
  TERMINOS_PAGE_QUERY,
} from './queries'
import type { Locale } from '@/lib/i18n/routing'
import { PAGE_TYPES } from './tags'

// Todas las lecturas de Sanity siguen este patrón: 'use cache' + cacheLife('max')
// + cacheTag(<_type>). El webhook invalida por `_type` (ver app/api/revalidate).

export async function getPublications() {
  'use cache'
  cacheLife('max')
  cacheTag('publication')
  return client.fetch(PUBLICATIONS_QUERY)
}

export async function getSiteSettings(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('siteSettings')
  return client.fetch(SITE_SETTINGS_QUERY, { id: `siteSettings-${locale}` })
}

export async function getHomePage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('homePage')
  return client.fetch(HOME_PAGE_QUERY, { id: `homePage-${locale}` })
}

export async function getBiografiaPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('biografiaPage')
  return client.fetch(BIOGRAFIA_PAGE_QUERY, { id: `biografiaPage-${locale}` })
}

export async function getInvestigacionPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('investigacionPage')
  return client.fetch(INVESTIGACION_PAGE_QUERY, { id: `investigacionPage-${locale}` })
}

export async function getDocenciaPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('docenciaPage')
  return client.fetch(DOCENCIA_PAGE_QUERY, { id: `docenciaPage-${locale}` })
}

export async function getPublicacionesPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('publicacionesPage')
  return client.fetch(PUBLICACIONES_PAGE_QUERY, { id: `publicacionesPage-${locale}` })
}

export async function getContactoPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('contactoPage')
  return client.fetch(CONTACTO_PAGE_QUERY, { id: `contactoPage-${locale}` })
}

export async function getPrivacidadPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('privacidadPage')
  return client.fetch(PRIVACIDAD_PAGE_QUERY, { id: `privacidadPage-${locale}` })
}

export async function getTerminosPage(locale: Locale) {
  'use cache'
  cacheLife('max')
  cacheTag('terminosPage')
  return client.fetch(TERMINOS_PAGE_QUERY, { id: `terminosPage-${locale}` })
}

export async function getContentDates() {
  'use cache'
  cacheLife('max')
  cacheTag('publication', ...PAGE_TYPES)
  return client.fetch(CONTENT_DATES_QUERY, { pageTypes: [...PAGE_TYPES] })
}
