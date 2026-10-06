'use client'

import { useId, useState, useSyncExternalStore, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const QUERY = '(min-width: 768px)'
const subscribe = (cb: () => void) => {
  const mq = matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
/** true en desktop (md+). En el servidor se asume mobile; el HTML es el mismo en ambos casos. */
function useDesktop() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false)
}

function Icon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-line">
      <svg viewBox="0 0 16 16" className={cn('size-3.5 transition-transform duration-300', open && 'rotate-45')} fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/**
 * Acordeón solo en mobile: en `md+` el contenido queda siempre abierto y el
 * título deja de ser un botón. El contenido está siempre en el HTML (SEO).
 * `stack`: título arriba; `split`: título a la izquierda y contenido a la derecha;
 * `row`: título | contenido | `meta` (p. ej. año) en una fila.
 */
export function Disclosure({
  title,
  meta,
  summary,
  children,
  variant = 'stack',
  className,
  titleClassName,
}: {
  title: ReactNode
  meta?: ReactNode
  summary?: ReactNode
  children: ReactNode
  variant?: 'stack' | 'split' | 'row'
  className?: string
  titleClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const desktop = useDesktop()
  const id = useId()
  const expanded = open || desktop

  const root = {
    stack: '',
    split: 'md:grid md:grid-cols-[1fr_2fr] md:gap-x-[clamp(1.5rem,4vw,5rem)]',
    row: 'md:grid md:grid-cols-[1.2fr_2fr_0.4fr] md:items-start md:gap-x-[clamp(1.5rem,3vw,3rem)] md:border-b md:border-line md:py-6',
  }[variant]

  const heading = (
    <>
      <span className={cn('min-w-0', titleClassName)}>{title}</span>
      {meta && <span className="shrink-0 tabular-nums md:hidden">{meta}</span>}
    </>
  )

  return (
    <div className={cn('rounded-card bg-card md:rounded-none md:bg-transparent', root, className)}>
      <h3 className={cn(variant === 'split' && 'md:row-span-2')}>
        {desktop ? (
          <div className="flex items-start gap-4">{heading}</div>
        ) : (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {heading}
            <Icon open={open} />
          </button>
        )}
      </h3>

      {summary && <div className={cn('px-4 pb-3 md:p-0', variant === 'split' && 'md:col-start-2')}>{summary}</div>}

      <div
        id={id}
        role="region"
        inert={!expanded}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none md:grid-rows-[1fr]',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          variant === 'split' && 'md:col-start-2',
        )}
      >
        <div className="overflow-hidden md:overflow-visible">
          <div className="px-4 pb-4 md:p-0">{children}</div>
        </div>
      </div>

      {meta && variant === 'row' && (
        <p className="hidden text-[clamp(1.125rem,1.6vw,1.5rem)] tabular-nums md:order-last md:block">{meta}</p>
      )}
    </div>
  )
}

/** "Leer más" solo en mobile; en desktop el texto adicional siempre se ve. */
export function ReadMore({
  children,
  more,
  less,
}: {
  children: ReactNode
  more: string
  less: string
}) {
  const [open, setOpen] = useState(false)
  const desktop = useDesktop()
  const id = useId()
  const expanded = open || desktop
  return (
    <>
      <div
        id={id}
        inert={!expanded}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none md:grid-rows-[1fr]',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden md:overflow-visible">{children}</div>
      </div>
      {!desktop && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="mt-2 underline underline-offset-4"
        >
          {open ? less : more}
        </button>
      )}
    </>
  )
}
