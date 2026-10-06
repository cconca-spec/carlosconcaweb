import { describe, expect, it } from 'vitest'
import { buildHaystack, filterPublications, sortPublications, type Publication } from './filter'
import { normalize } from './normalize'

function pub(id: string, over: Partial<Publication> = {}): Publication {
  const base = { title: 'T', citation: '', collaborators: '', ...over }
  return {
    id,
    year: 2000,
    category: 'articulo-wos',
    link: null,
    ...base,
    haystack: buildHaystack(base),
  } as Publication
}

const none = { query: '', category: '' as const, year: null }

describe('normalize', () => {
  it('quita acentos y baja a minúsculas', () => {
    expect(normalize('Matemática Aplicación')).toBe('matematica aplicacion')
  })
})

describe('filterPublications', () => {
  const items = [
    pub('a', { title: 'Homogeneización matemática', year: 1990 }),
    pub('b', { title: 'Fluids', citation: 'Journal of Math', collaborators: 'J. San Martín', year: 2010, category: 'libro' }),
  ]
  it('encuentra "matematica" en "matemática"', () => {
    expect(filterPublications(items, { ...none, query: 'matematica' }).map((p) => p.id)).toEqual(['a'])
  })
  it('busca en cita y colaboradores sin importar acentos', () => {
    expect(filterPublications(items, { ...none, query: 'san martin' }).map((p) => p.id)).toEqual(['b'])
    expect(filterPublications(items, { ...none, query: 'journal' }).map((p) => p.id)).toEqual(['b'])
  })
  it('combina categoría, año y texto', () => {
    expect(filterPublications(items, { query: '', category: 'libro', year: 2010 })).toHaveLength(1)
    expect(filterPublications(items, { query: 'fluids', category: 'libro', year: 1990 })).toHaveLength(0)
  })
  it('sin filtros devuelve la misma lista', () => {
    expect(filterPublications(items, none)).toBe(items)
  })
})

describe('sortPublications', () => {
  const items = [
    pub('a', { year: 2000, category: 'libro', title: 'B' }),
    pub('b', { year: 2020, category: 'articulo-wos', title: 'A' }),
    pub('c', { year: 2000, category: 'articulo-wos', title: 'C' }),
  ]
  it('más reciente primero', () => {
    expect(sortPublications(items, 'recent').map((p) => p.id)).toEqual(['b', 'a', 'c'])
  })
  it('menos reciente primero', () => {
    expect(sortPublications(items, 'oldest').map((p) => p.id)).toEqual(['a', 'c', 'b'])
  })
  it('por categoría y luego año descendente', () => {
    expect(sortPublications(items, 'category').map((p) => p.id)).toEqual(['b', 'c', 'a'])
  })
  it('no muta la entrada', () => {
    const before = items.map((p) => p.id)
    sortPublications(items, 'oldest')
    expect(items.map((p) => p.id)).toEqual(before)
  })
})
