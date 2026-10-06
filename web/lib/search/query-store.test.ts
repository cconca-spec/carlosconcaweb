import { afterEach, describe, expect, it } from 'vitest'
import { getQuery, setQuery } from './query-store'

afterEach(() => setQuery(''))

describe('query-store', () => {
  it('guarda el valor', () => {
    setQuery('bloch')
    expect(getQuery()).toBe('bloch')
  })
})
