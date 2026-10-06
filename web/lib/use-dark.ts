'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  const mq = matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => {
    observer.disconnect()
    mq.removeEventListener('change', onChange)
  }
}

export function isDarkNow() {
  const cl = document.documentElement.classList
  if (cl.contains('dark')) return true
  if (cl.contains('light')) return false
  return matchMedia(QUERY).matches
}

/** Modo oscuro efectivo: clase forzada (.dark/.light) o preferencia del sistema. */
export function useDark() {
  return useSyncExternalStore(subscribe, isDarkNow, () => false)
}

const noop = () => () => {}

/**
 * false en el servidor y en el primer render de hidratación, true después.
 * Sirve para lo que depende del cliente (p. ej. la ruta actual en páginas
 * estáticas) sin provocar un desajuste de hidratación.
 */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false)
}
