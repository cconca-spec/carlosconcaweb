import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames: {
    '/': { es: '/', en: '/' },
    '/publicaciones': { es: '/publicaciones', en: '/publications' },
    '/investigacion': { es: '/investigacion', en: '/research' },
    '/docencia': { es: '/docencia', en: '/teaching' },
    '/biografia': { es: '/biografia', en: '/biography' },
    '/contacto': { es: '/contacto', en: '/contact' },
    '/privacidad': { es: '/privacidad', en: '/privacy' },
    '/terminos': { es: '/terminos', en: '/terms' },
  },
})

export type Locale = (typeof routing.locales)[number]
