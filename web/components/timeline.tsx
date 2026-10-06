import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Reveal } from './reveal'
import { TimelineScroller } from './timeline-scroller'

type Block = { _key: string; children?: { text?: string }[] }
type Decade = {
  _key: string
  decade?: string | null
  caption?: string | null
  body?: Block[] | null
}

const blockText = (b: Block) => (b.children ?? []).map((c) => c.text ?? '').join('')

/** Encabezado y datos; el comportamiento (año fijo que cambia) vive en TimelineScroller. */
export async function Timeline({ timeline }: { timeline: Decade[] }) {
  const t = await getTranslations('Home')
  if (timeline.length === 0) return null

  return (
    <section
      data-nav-tone="dark"
      className="bg-tl-bg px-[var(--gutter)] py-[clamp(3rem,8vw,7rem)] text-paper-50"
    >
      <div className="flex items-start justify-between gap-6">
        <Reveal>
          <h2 className="text-[clamp(2.25rem,4.4vw,4.25rem)] leading-tight font-normal tracking-tight">
            {t('timelineTitle')}
          </h2>
        </Reveal>
        <Link
          href="/biografia"
          className="mt-[clamp(0.5rem,1.2vw,1.25rem)] shrink-0 underline underline-offset-4 hover:no-underline"
        >
          {t('viewBiography')}
        </Link>
      </div>

      <div className="mt-[clamp(1.5rem,4vw,4rem)]">
        <TimelineScroller
          items={timeline.map((d) => ({
            key: d._key,
            decade: d.decade ?? '',
            caption: d.caption ?? '',
            cards: (d.body ?? []).map((b) => ({ key: b._key, text: blockText(b) })),
          }))}
        />
      </div>
    </section>
  )
}
