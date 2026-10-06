'use client'

import { useEffect, useId, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'
import { RichText, type RichBlock } from '../portable-text'

export type AreaItem = {
  key: string
  slug: string
  title: string
  blocks: RichBlock[]
  applications: string[]
  applicationsLabel: string
  /** Texto con que empieza el bloque "Publicaciones clave", para insertar las aplicaciones antes. */
  keyPublicationsLabel: string
}

const QUERY = '(min-width: 768px)'
const subscribe = (cb: () => void) => {
  const mq = matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const useDesktop = () =>
  useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false)

const blockPlain = (b: RichBlock) => (b.children ?? []).map((c) => c.text ?? '').join('')

/**
 * Acordeón de áreas de investigación (uno abierto a la vez). En desktop la primera
 * viene abierta; en mobile todas cerradas. Cada área se abre con su ancla (#slug).
 * El texto completo siempre está en el HTML, aunque esté cerrado.
 */
export function AreasAccordion({ areas }: { areas: AreaItem[] }) {
  // undefined = todavía no eligió nada (se aplica el valor por defecto según el ancho).
  const [chosen, setChosen] = useState<string | null | undefined>(undefined)
  const desktop = useDesktop()
  const openKey = chosen === undefined ? (desktop ? areas[0]?.key : null) : chosen
  const base = useId()

  // Enlace directo: /investigacion#slug abre esa área y se desplaza hasta ella
  // (al cargar y también si cambia el ancla sin recargar).
  useEffect(() => {
    function openFromHash() {
      const slug = decodeURIComponent(window.location.hash.slice(1))
      const hit = areas.find((a) => a.slug === slug)
      if (!hit) return
      setChosen(hit.key)
      requestAnimationFrame(() => document.getElementById(hit.slug)?.scrollIntoView({ block: 'start' }))
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [areas])

  return (
    <ul className="flex flex-col gap-2 rounded-card bg-panel p-2">
      {areas.map((a) => {
        const open = openKey === a.key
        const id = `${base}-${a.key}`
        const keyIdx = a.blocks.findIndex((b) => blockPlain(b).startsWith(a.keyPublicationsLabel))
        const at = a.applications.length ? (keyIdx === -1 ? a.blocks.length : keyIdx) : -1
        const apps = (
          <p key="apps">
            <strong className="font-semibold">{a.applicationsLabel}:</strong> {a.applications.join(', ')}.
          </p>
        )
        const content = a.blocks.flatMap((b, i) => [
          ...(i === at ? [apps] : []),
          <p key={b._key}>
            <RichText block={b} />
          </p>,
        ])
        if (at === a.blocks.length) content.push(apps)

        return (
          <li key={a.key} id={a.slug} className="scroll-mt-[calc(var(--nav-h)+1rem)] rounded-card bg-card">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setChosen(open ? null : a.key)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-[clamp(1.125rem,1.6vw,1.5rem)] leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span>{a.title}</span>
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-line">
                  <svg viewBox="0 0 16 16" className={cn('size-3.5 transition-transform duration-300', open && 'rotate-45')} fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={id}
              role="region"
              aria-label={a.title}
              inert={!open}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 px-5 pb-5 text-sm leading-relaxed">{content}</div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
