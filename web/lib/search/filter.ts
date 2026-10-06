import { normalize } from './normalize'

export const CATEGORIES = [
  'articulo-wos',
  'articulo-indexado',
  'actas-capitulos',
  'revista-nacional',
  'otras',
  'libro',
] as const
export type Category = (typeof CATEGORIES)[number]

export type Publication = {
  id: string
  title: string
  citation: string
  collaborators: string
  year: number
  category: Category
  /** Texto normalizado (título + cita + colaboradores) para buscar sin recalcular. */
  haystack: string
  link: string | null
}

export type SortKey = 'recent' | 'oldest' | 'category'
export const SORT_KEYS: SortKey[] = ['recent', 'oldest', 'category']

export type Filters = {
  query: string
  category: Category | ''
  year: number | null
}

export function buildHaystack(p: Pick<Publication, 'title' | 'citation' | 'collaborators'>) {
  return normalize(`${p.title} ${p.citation} ${p.collaborators}`)
}

export function filterPublications(items: Publication[], f: Filters): Publication[] {
  const q = normalize(f.query.trim())
  if (!q && !f.category && f.year === null) return items
  return items.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (f.year === null || p.year === f.year) &&
      (!q || p.haystack.includes(q)),
  )
}

const byTitle = (a: Publication, b: Publication) => a.title.localeCompare(b.title)

/** No muta la entrada. El desempate por título hace el orden estable y predecible. */
export function sortPublications(items: Publication[], sort: SortKey): Publication[] {
  const copy = [...items]
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.year - b.year || byTitle(a, b))
    case 'category':
      return copy.sort(
        (a, b) =>
          CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) ||
          b.year - a.year ||
          byTitle(a, b),
      )
    default:
      return copy.sort((a, b) => b.year - a.year || byTitle(a, b))
  }
}
