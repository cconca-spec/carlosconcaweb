import { describe, expect, it } from 'vitest'
import { PAGES, pageUrl } from './metadata'

describe('pageUrl', () => {
  it('termina siempre en barra (trailingSlash) y usa el slug traducido', () => {
    expect(pageUrl('es', '/')).toBe('https://carlosconca.cl/')
    expect(pageUrl('en', '/')).toBe('https://carlosconca.cl/en/')
    expect(pageUrl('es', '/publicaciones')).toBe('https://carlosconca.cl/publicaciones/')
    expect(pageUrl('en', '/publicaciones')).toBe('https://carlosconca.cl/en/publications/')
    for (const h of PAGES) for (const l of ['es', 'en'] as const) expect(pageUrl(l, h).endsWith('/')).toBe(true)
  })
})
