import { describe, expect, it } from 'vitest'
import { routing } from './routing'

describe('routing', () => {
  it('define las 8 rutas con slug traducido', () => {
    expect(Object.keys(routing.pathnames)).toHaveLength(8)
    expect(routing.pathnames['/publicaciones']).toEqual({
      es: '/publicaciones',
      en: '/publications',
    })
  })
})
