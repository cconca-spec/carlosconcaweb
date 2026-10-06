import { useSyncExternalStore } from 'react'

/**
 * Texto de búsqueda de publicaciones compartido entre la página y la barra
 * inferior mobile (que vive en el layout, fuera del árbol de la página).
 */
let query = ''
const listeners = new Set<() => void>()

export const getQuery = () => query

export function setQuery(next: string) {
  if (next === query) return
  query = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useSearchQuery() {
  const q = useSyncExternalStore(subscribe, getQuery, () => '')
  return [q, setQuery] as const
}
