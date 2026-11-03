import { describe, expect, it } from 'vitest'
import { buildLlmsFull, buildLlmsTxt, type LlmsData } from './llms'

const data: LlmsData = {
  home: { displayName: 'Carlos Conca', affiliation: 'Universidad de Chile' },
  biografia: { intro: [{ children: [{ text: 'Bio.' }] }], awards: [{ year: '2003', name: 'Premio Nacional' }] },
  investigacion: { areas: [{ title: 'Bloch', slug: { current: 'bloch' }, summary: 'Resumen de Bloch.' }] },
  docencia: { statement: 'Frase.', doctoratesChile: [{ name: 'Ana', year: '2001' }] },
  publications: [
    { title: 'Viejo', year: 1990, category: 'libro' },
    { title: 'Nuevo', citation: 'J. Math.', year: 2020, category: 'articulo-wos', collaborators: 'X', link: 'https://doi.org/10.1/x' },
  ],
}

describe('llms', () => {
  it('llms.txt enlaza las 16 URLs con slug traducido y barra final', () => {
    const t = buildLlmsTxt(data)
    expect(t.startsWith('# Carlos Conca')).toBe(true)
    expect(t).toContain('https://carlosconca.cl/publicaciones/')
    expect(t).toContain('https://carlosconca.cl/en/publications/')
    expect(t).toContain('https://carlosconca.cl/en/contact/')
    expect(t.match(/\]\(https:\/\/carlosconca\.cl[^)]*[^/]\)/g)).toEqual(['](https://carlosconca.cl/llms-full.txt)'])
    expect(t.match(/\]\(https:\/\/carlosconca\.cl\/[^)]*\)/g)?.length).toBe(17) // 16 páginas + llms-full
  })

  it('llms-full.txt incluye áreas con ancla y publicaciones por año descendente', () => {
    const t = buildLlmsFull(data)
    expect(t).toContain('https://carlosconca.cl/investigacion/#bloch')
    expect(t).toContain('Publicaciones (2)')
    expect(t.indexOf('### 2020')).toBeLessThan(t.indexOf('### 1990'))
    expect(t).toContain('Nuevo. J. Math. (con X; WoS-ISI) https://doi.org/10.1/x')
    expect(t).not.toMatch(/undefined|null/)
  })
})
