import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/page-hero'
import { RichText, type RichBlock } from '@/components/portable-text'
import type { Locale } from '@/lib/i18n/routing'

type LegalBlock = RichBlock & {
  style?: string
  listItem?: 'bullet' | 'number'
}

type Group = { key: string; list?: 'bullet' | 'number'; blocks: LegalBlock[] }

/** Agrupa los ítems de lista consecutivos: Portable Text los guarda como bloques sueltos. */
function group(blocks: LegalBlock[]): Group[] {
  const out: Group[] = []
  for (const b of blocks) {
    const last = out.at(-1)
    if (b.listItem && last?.list === b.listItem) last.blocks.push(b)
    else out.push({ key: b._key, list: b.listItem, blocks: [b] })
  }
  return out
}

const BODY = 'text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed'

export async function LegalPage({
  locale,
  page,
}: {
  locale: Locale
  page: { heading?: string | null; updated?: string | null; body?: LegalBlock[] | null }
}) {
  const t = await getTranslations({ locale, namespace: 'Legal' })
  const updated = page.updated
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(page.updated))
    : null

  return (
    <main>
      <PageHero title={page.heading ?? ''} />
      <section data-nav-tone="light" className="px-[var(--gutter)] py-[clamp(2rem,6vw,5.5rem)]">
        <article className="mx-auto flex max-w-3xl flex-col gap-5">
          {updated && (
            <p className="text-sm opacity-70">
              {t('updated')}: <time dateTime={page.updated!}>{updated}</time>
            </p>
          )}
          {group(page.body ?? []).map((g) => {
            if (g.list) {
              const List = g.list === 'number' ? 'ol' : 'ul'
              return (
                <List
                  key={g.key}
                  className={`${BODY} flex flex-col gap-2 pl-6 ${g.list === 'number' ? 'list-decimal' : 'list-disc'}`}
                >
                  {g.blocks.map((b) => (
                    <li key={b._key}>
                      <RichText block={b} />
                    </li>
                  ))}
                </List>
              )
            }
            const b = g.blocks[0]
            if (b.style === 'h2')
              return (
                <h2 key={g.key} className="mt-6 text-[clamp(1.375rem,2vw,1.75rem)] leading-tight font-medium tracking-tight">
                  <RichText block={b} />
                </h2>
              )
            if (b.style === 'h3')
              return (
                <h3 key={g.key} className="mt-2 text-[clamp(1.125rem,1.5vw,1.25rem)] font-medium">
                  <RichText block={b} />
                </h3>
              )
            return (
              <p key={g.key} className={BODY}>
                <RichText block={b} />
              </p>
            )
          })}
        </article>
      </section>
    </main>
  )
}
