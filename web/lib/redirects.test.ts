import { describe, expect, it } from 'vitest'
import { LEGACY_REDIRECTS } from './redirects'

describe('LEGACY_REDIRECTS', () => {
  const sources = new Set<string>(LEGACY_REDIRECTS.map((r) => r.source))

  it('no tiene cadenas: ningún destino es a su vez un origen', () => {
    for (const r of LEGACY_REDIRECTS) expect(sources.has(r.destination)).toBe(false)
  })

  it('los orígenes no se repiten y las páginas terminan en barra', () => {
    expect(sources.size).toBe(LEGACY_REDIRECTS.length)
    for (const r of LEGACY_REDIRECTS) if (!r.source.endsWith('.pdf')) expect(r.source.endsWith('/')).toBe(true)
  })
})
