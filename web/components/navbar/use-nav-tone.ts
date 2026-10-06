'use client'

import { useEffect, useState } from 'react'

export type NavTone = 'light' | 'dark'

/**
 * Tono de la sección que queda bajo la navbar (`edge: 'top'`, también el logo
 * mobile) o bajo la barra inferior mobile (`edge: 'bottom'`). Cada sección declara
 * `data-nav-tone="light|dark"`; si ninguna cubre la navbar, devuelve null
 * y la navbar usa el tema activo.
 */
export function useNavTone(edge: 'top' | 'bottom' = 'top'): NavTone | null {
  const [tone, setTone] = useState<NavTone | null>(null)

  useEffect(() => {
    let frame = 0

    function measure() {
      frame = 0
      // En mobile el <header> está oculto (alto 0): el logo flota a ~40 px del borde.
      const navH = document.querySelector('header')?.getBoundingClientRect().height || 80
      const probe = edge === 'bottom' ? window.innerHeight - 40 : navH / 2
      let found: NavTone | null = null
      for (const el of document.querySelectorAll<HTMLElement>('[data-nav-tone]')) {
        const r = el.getBoundingClientRect()
        if (r.top <= probe && r.bottom > probe) {
          found = el.dataset.navTone === 'dark' ? 'dark' : 'light'
        }
      }
      setTone(found)
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [edge])

  return tone
}
