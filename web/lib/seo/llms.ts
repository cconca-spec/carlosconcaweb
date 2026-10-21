import es from '@/messages/es.json'
import { type Href, PAGES, pageUrl } from './metadata'
import { SITE_URL } from './site'

type Block = { children?: Array<{ text?: string | null }> }
type Named = { name?: string | null; year?: string | null; position?: string | null; country?: string | null }

export type LlmsData = {
  home: { displayName?: string | null; affiliation?: string | null } | null
  biografia: { intro?: Block[]; awards?: Array<{ name?: string | null; description?: string | null; year?: string | null }> } | null
  investigacion: { intro?: Block[]; areas?: Array<{ title?: string | null; slug?: { current?: string | null }; summary?: string | null }> } | null
  docencia: {
    intro?: Block[]
    statement?: string | null
    doctoratesChile?: Named[]
    doctorates?: Named[]
  } | null
  publications: Array<{
    title?: string | null
    citation?: string | null
    year?: number | null
    category?: string | null
    collaborators?: string | null
    link?: string | null
  }>
}

const chip = es.Publications.chip as Record<string, string>
const nav = es.Nav as Record<string, string>

const NAV_KEY: Record<Href, string> = {
  '/': 'home',
  '/publicaciones': 'publications',
  '/investigacion': 'research',
  '/docencia': 'teaching',
  '/biografia': 'biography',
  '/contacto': 'contact',
}

const PAGE_NOTE: Record<Href, string> = {
  '/': 'Trayectoria, cifras de carrera, áreas de investigación y línea de tiempo.',
  '/publicaciones': 'Catálogo completo de publicaciones científicas, con búsqueda y filtros.',
  '/investigacion': 'Áreas de investigación, cada una con un resumen y un enlace directo.',
  '/docencia': 'Doctorados dirigidos, ingenieros, postdocs y programas.',
  '/biografia': 'Biografía, premios y distinciones.',
  '/contacto': 'Perfiles institucionales y académicos.',
}

const text = (blocks?: Block[]) =>
  (blocks ?? [])
    .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
    .filter(Boolean)
    .join('\n\n')

const clean = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

/** Índice breve en el formato de llmstxt.org. */
export function buildLlmsTxt(d: Pick<LlmsData, 'home'>): string {
  const name = d.home?.displayName ?? es.Meta.siteName
  const lines = [
    `# ${name}`,
    '',
    `> ${es.Meta.description}${d.home?.affiliation ? ` ${clean(d.home.affiliation)}.` : ''}`,
    '',
    'Sitio académico en español e inglés. Los títulos, revistas y autores de las publicaciones se conservan en su idioma original.',
    '',
    '## Español',
    ...PAGES.map((h) => `- [${nav[NAV_KEY[h]]}](${pageUrl('es', h)}): ${PAGE_NOTE[h]}`),
    '',
    '## English',
    ...PAGES.map((h) => `- [${nav[NAV_KEY[h]]}](${pageUrl('en', h)})`),
    '',
    '## Optional',
    `- [Contenido completo en texto plano](${SITE_URL}/llms-full.txt): biografía, áreas de investigación, docencia y las publicaciones completas.`,
    '',
  ]
  return lines.join('\n')
}

/** Contenido completo en texto plano, con el catálogo de publicaciones agrupado por año. */
export function buildLlmsFull(d: LlmsData): string {
  const name = d.home?.displayName ?? es.Meta.siteName
  const out: string[] = [`# ${name}`, '', `> ${es.Meta.description}`]
  if (d.home?.affiliation) out.push('', clean(d.home.affiliation))

  if (d.biografia) {
    out.push('', `## ${nav.biography}`, '', text(d.biografia.intro))
    for (const a of d.biografia.awards ?? []) {
      out.push('', `- ${[a.year, a.name].filter(Boolean).join(' · ')}${a.description ? `: ${clean(a.description)}` : ''}`)
    }
  }

  if (d.investigacion) {
    out.push('', `## ${nav.research}`)
    if (d.investigacion.intro?.length) out.push('', text(d.investigacion.intro))
    for (const a of d.investigacion.areas ?? []) {
      const slug = a.slug?.current
      out.push('', `### ${a.title}`, '')
      if (slug) out.push(`${pageUrl('es', '/investigacion')}#${slug}`, '')
      out.push(clean(a.summary))
    }
  }

  if (d.docencia) {
    out.push('', `## ${nav.teaching}`, '', text(d.docencia.intro))
    if (d.docencia.statement) out.push('', clean(d.docencia.statement))
    const people = (title: string, list?: Named[]) => {
      if (!list?.length) return
      out.push('', `### ${title} (${list.length})`, '')
      for (const p of list) {
        out.push(`- ${[p.name, p.year, p.position, p.country].filter(Boolean).join(', ')}`)
      }
    }
    people('Doctorados en Chile', d.docencia.doctoratesChile)
    people('Doctorados en el extranjero', d.docencia.doctorates)
  }

  const pubs = [...d.publications].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  out.push('', `## ${nav.publications} (${pubs.length})`)
  let year: number | null | undefined
  for (const p of pubs) {
    if (p.year !== year) {
      year = p.year
      out.push('', `### ${year}`, '')
    }
    const meta = [p.collaborators && `con ${clean(p.collaborators)}`, p.category && chip[p.category]].filter(Boolean)
    out.push(
      `- ${clean(p.title)}${p.citation ? `. ${clean(p.citation)}` : ''}${meta.length ? ` (${meta.join('; ')})` : ''}${p.link ? ` ${p.link}` : ''}`,
    )
  }
  out.push('')
  return out.join('\n')
}
