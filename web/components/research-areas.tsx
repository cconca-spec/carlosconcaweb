import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Reveal } from './reveal'
import { ResearchAreasGrid } from './research-areas-grid'

type Area = { _key: string; title?: string | null; body?: string | null }

/** Ilustraciones por orden de área (el WordPress las mantiene en este orden). */
const IMAGES = [
  'homogeneizacion',
  'fluidos',
  'estructura-solido-fluido',
  'diseno-optimo',
  'problemas-inversos',
  'investigacion-asociativa-en-otras-areas',
]

export async function ResearchAreas({
  intro,
  areas,
}: {
  intro: string
  areas: Area[]
}) {
  const t = await getTranslations('Home')
  if (areas.length === 0) return null

  const items = areas.slice(0, IMAGES.length).map((a, i) => ({
    key: a._key,
    title: a.title ?? '',
    body: a.body ?? '',
    image: `/images/areas/${IMAGES[i]}.png`,
  }))

  return (
    <section
      data-nav-tone="light"
      className="overflow-x-clip py-[clamp(3rem,8vw,7rem)]"
    >
      <div className="px-[var(--gutter)]">
        <Reveal>
          <h2 className="text-[clamp(2.25rem,4.4vw,4.25rem)] leading-tight font-normal tracking-tight">
            {t('areasTitle')}
          </h2>
        </Reveal>

        <div className="mt-[clamp(1rem,2vw,1.75rem)] flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <p className="max-w-[62ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-snug">
            {intro}
          </p>
          <Link
            href="/publicaciones"
            className="shrink-0 underline underline-offset-4 hover:no-underline"
          >
            {t('viewPublications')}
          </Link>
        </div>
      </div>

      <div className="mt-[clamp(2rem,4vw,4rem)]">
        <ResearchAreasGrid
          areas={items}
          closeLabel={t('closeArea')}
          listLabel={t('areasList')}
        />
      </div>
    </section>
  )
}
