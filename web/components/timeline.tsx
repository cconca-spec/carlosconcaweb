import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Reveal } from './reveal'

type Block = { _key: string; children?: { text?: string }[] }
type Decade = {
  _key: string
  decade?: string | null
  caption?: string | null
  body?: Block[] | null
}

const blockText = (b: Block) => (b.children ?? []).map((c) => c.text ?? '').join('')

/**
 * Una fila de grid por década. La celda del año es `sticky` y vive dentro de su
 * fila: queda fija (centrada en desktop, en un riel angosto en mobile) mientras
 * pasan las cards de esa década, y la siguiente fila la reemplaza. Sin JS.
 */
export async function Timeline({ timeline }: { timeline: Decade[] }) {
  const t = await getTranslations('Home')
  if (timeline.length === 0) return null
  const total = timeline.length

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

      <ol className="mt-[clamp(1.5rem,4vw,4rem)]">
        {timeline.map((d, i) => (
          <li
            key={d._key}
            className="grid grid-cols-[3.25rem_1fr] gap-x-4 lg:grid-cols-[1fr_1.35fr] lg:gap-x-[clamp(2rem,6vw,6rem)]"
          >
            <div className="relative">
              <div className="sticky top-[calc(var(--nav-h)+1rem)] flex flex-col gap-1 lg:top-1/2 lg:-translate-y-1/2 lg:gap-4">
                <p className="text-sm tracking-wide tabular-nums lg:text-base">
                  {i + 1} / {total}
                </p>
                <h3 className="text-[1.5rem] leading-none tracking-tight [writing-mode:vertical-rl] lg:text-[clamp(4.5rem,9vw,9rem)] lg:[writing-mode:horizontal-tb]">
                  {d.decade}
                </h3>
                <p className="hidden text-[clamp(0.9375rem,1.2vw,1.125rem)] lg:block">
                  {d.caption}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(1rem,18dvh,10rem)]">
              <p className="text-sm lg:hidden">{d.caption}</p>
              {(d.body ?? []).map((b) => (
                <p
                  key={b._key}
                  className="rounded-card bg-tl-card px-[clamp(1.25rem,8vw,7.5rem)] py-[clamp(1.75rem,5vw,5rem)] text-[clamp(1.0625rem,1.6vw,1.625rem)] leading-[1.15]"
                >
                  {blockText(b)}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
