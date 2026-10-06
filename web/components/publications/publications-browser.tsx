'use client'

import { useTranslations } from 'next-intl'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  CATEGORIES,
  SORT_KEYS,
  filterPublications,
  sortPublications,
  type Category,
  type Publication,
  type SortKey,
} from '@/lib/search/filter'
import { useSearchQuery, setQuery as setStoreQuery } from '@/lib/search/query-store'
import { PublicationCard } from './publication-card'

const STEP = 24
const FIELD =
  'w-full truncate rounded-pill border border-transparent bg-surface px-3 py-2.5 text-[0.8125rem] text-fg md:border-line md:bg-card md:px-4 md:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function readUrl() {
  const p = new URLSearchParams(window.location.search)
  const cat = p.get('cat') as Category | null
  const sort = p.get('sort') as SortKey | null
  const year = Number(p.get('year'))
  return {
    q: p.get('q') ?? '',
    cat: cat && CATEGORIES.includes(cat) ? cat : ('' as const),
    year: Number.isInteger(year) && year > 0 ? year : null,
    sort: sort && SORT_KEYS.includes(sort) ? sort : ('recent' as const),
  }
}

/**
 * Buscador + filtros + orden + "Cargar más". El estado inicial es "sin filtros,
 * más reciente, 24 visibles", así que el HTML del servidor trae las 197 tarjetas
 * (las que no se ven, con `hidden`). El estado vive en la URL (?q ?cat ?year ?sort).
 */
export function PublicationsBrowser({ items }: { items: Publication[] }) {
  const t = useTranslations('Publications')
  const [query, setQuery] = useSearchQuery()
  const [category, setCategory] = useState<Category | ''>('')
  const [year, setYear] = useState<number | null>(null)
  const [sort, setSort] = useState<SortKey>('recent')
  const [visible, setVisible] = useState(STEP)
  const ready = useRef(false)

  const deferredQuery = useDeferredValue(query)

  // El texto vive en un store compartido con la barra inferior mobile: se limpia al salir.
  useEffect(() => () => setStoreQuery(''), [])

  // Estado inicial desde la URL, leída una sola vez tras hidratar: el HTML del
  // servidor no puede conocerla (la página es estática), así que no hay otra forma.
  useEffect(() => {
    const u = readUrl()
    /* eslint-disable react-hooks/set-state-in-effect */
    setQuery(u.q)
    setCategory(u.cat)
    setYear(u.year)
    setSort(u.sort)
    /* eslint-enable react-hooks/set-state-in-effect */
    ready.current = true
  }, [setQuery])

  // Refleja el estado en la URL sin navegar.
  useEffect(() => {
    if (!ready.current) return
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (category) p.set('cat', category)
    if (year !== null) p.set('year', String(year))
    if (sort !== 'recent') p.set('sort', sort)
    const qs = p.toString()
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''))
  }, [query, category, year, sort])

  const years = useMemo(
    () => [...new Set(items.map((p) => p.year))].sort((a, b) => b - a),
    [items],
  )
  const categories = useMemo(
    () => CATEGORIES.filter((c) => items.some((p) => p.category === c)),
    [items],
  )

  const results = useMemo(
    () => sortPublications(filterPublications(items, { query: deferredQuery, category, year }), sort),
    [items, deferredQuery, category, year, sort],
  )

  // Etiquetas de tarjeta: una por categoría, estables entre renders.
  const chips = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, t(`chip.${c}`)])) as Record<Category, string>,
    [t],
  )
  const view = t('view')
  const noLink = t('noLink')
  const withLabel = (names: string) => t('with', { names })

  const filtered = query !== '' || category !== '' || year !== null
  const shown = Math.min(visible, results.length)

  function change<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v)
      setVisible(STEP)
    }
  }
  const onQuery = change(setQuery)
  const onCategory = change(setCategory)
  const onYear = change(setYear)
  const onSort = change(setSort)

  function clear() {
    setQuery('')
    setCategory('')
    setYear(null)
    setVisible(STEP)
  }

  return (
    <div>
      <div role="search" className="grid grid-cols-[1.1fr_0.7fr_1.2fr] gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* En mobile el buscador vive en la barra inferior (mobile-chrome). */}
        <div className="hidden md:col-span-3 md:block lg:col-span-1">
          <label htmlFor="pub-q" className="sr-only">
            {t('searchLabel')}
          </label>
          <input
            id="pub-q"
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t('placeholder')}
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="pub-cat" className="sr-only">
            {t('category')}
          </label>
          <select
            id="pub-cat"
            value={category}
            onChange={(e) => onCategory(e.target.value as Category | '')}
            className={FIELD}
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {chips[c]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pub-year" className="sr-only">
            {t('year')}
          </label>
          <select
            id="pub-year"
            value={year ?? ''}
            onChange={(e) => onYear(e.target.value ? Number(e.target.value) : null)}
            className={FIELD}
          >
            <option value="">{t('allYears')}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pub-sort" className="sr-only">
            {t('sort')}
          </label>
          <select
            id="pub-sort"
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className={FIELD}
          >
            <option value="recent">{t('sortRecent')}</option>
            <option value="oldest">{t('sortOldest')}</option>
            <option value="category">{t('sortCategory')}</option>
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-fg/70" aria-live="polite">
        {t('showing', { shown, total: results.length })}
        {filtered && (
          <>
            {' · '}
            <button type="button" onClick={clear} className="underline underline-offset-4 hover:no-underline">
              {t('clear')}
            </button>
          </>
        )}
      </p>

      {results.length === 0 && <p className="mt-10 text-lg">{t('empty')}</p>}

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map((p, i) => (
          <PublicationCard
            key={p.id}
            pub={p}
            hidden={i >= visible}
            deferred={i >= 8}
            labels={{
              chip: chips[p.category],
              view,
              noLink,
              collaborators: p.collaborators ? withLabel(p.collaborators) : '',
            }}
          />
        ))}
      </ul>

      {visible < results.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="rounded-pill bg-fg px-6 py-3 text-sm text-bg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('loadMore')}
          </button>
        </div>
      )}
    </div>
  )
}
