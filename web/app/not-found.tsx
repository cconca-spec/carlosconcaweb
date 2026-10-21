import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/page-hero'

/** 404 global (URLs fuera de los idiomas, p. ej. contenido demo del WordPress anterior): en español, sin navbar. */
export default async function NotFound() {
  const t = await getTranslations({ locale: 'es', namespace: 'NotFound' })
  return (
    <html lang="es">
      <body>
        <main>
          <PageHero title={t('title')} />
          <section className="px-[var(--gutter)] py-[clamp(2rem,6vw,5.5rem)]">
            <p className="text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug">{t('text')}</p>
            <p className="mt-6">
              {/* "/" no tiene segmento traducido: aquí next/link es seguro (el 404 global no tiene contexto de idioma) */}
              <Link href="/" className="underline underline-offset-4 hover:no-underline">
                {t('home')}
              </Link>
            </p>
          </section>
        </main>
      </body>
    </html>
  )
}
