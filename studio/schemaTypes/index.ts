import { linkType } from './objects/link'
import { seoType } from './objects/seo'
import { publicationType } from './documents/publication'
import {
  biografiaPage,
  contactoPage,
  docenciaPage,
  homePage,
  investigacionPage,
  privacidadPage,
  publicacionesPage,
  terminosPage,
} from './documents/pages'
import { siteSettings } from './documents/siteSettings'

export { LOCALES } from './shared'

export const schemaTypes = [
  // objects
  seoType,
  linkType,
  // documents
  publicationType,
  homePage,
  biografiaPage,
  investigacionPage,
  docenciaPage,
  publicacionesPage,
  contactoPage,
  privacidadPage,
  terminosPage,
  siteSettings,
]

/** Tipos que reciben localización a nivel documento. */
export const LOCALIZED_TYPES = [
  'homePage',
  'biografiaPage',
  'investigacionPage',
  'docenciaPage',
  'publicacionesPage',
  'contactoPage',
  'privacidadPage',
  'terminosPage',
  'siteSettings',
] as const
