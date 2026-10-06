import { memo } from 'react'
import { cn } from '@/lib/cn'
import type { Category, Publication } from '@/lib/search/filter'

const CHIP: Record<Category, string> = {
  'articulo-wos': 'bg-cat-wos/15 text-cat-wos',
  'articulo-indexado': 'bg-cat-indexado/15 text-cat-indexado',
  'actas-capitulos': 'bg-cat-actas/15 text-cat-actas',
  'revista-nacional': 'bg-cat-nacional/15 text-cat-nacional',
  otras: 'bg-cat-otras/15 text-cat-otras',
  libro: 'bg-cat-libro/15 text-cat-libro',
}

export type CardLabels = {
  chip: string
  view: string
  noLink: string
  collaborators: string
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Tarjeta de publicación. Memoizada: solo se vuelve a renderizar si cambia
 * su propia publicación, sus textos o si pasa a estar oculta ("Cargar más").
 * `deferred` activa content-visibility para las que quedan bajo el pliegue.
 */
export const PublicationCard = memo(function PublicationCard({
  pub,
  labels,
  hidden,
  deferred,
}: {
  pub: Publication
  labels: CardLabels
  hidden: boolean
  deferred: boolean
}) {
  return (
    <li
      hidden={hidden}
      className={cn(deferred && '[contain-intrinsic-size:auto_17rem] [content-visibility:auto]')}
    >
      <article className="flex h-full flex-col gap-2 rounded-card bg-card p-3 sm:gap-3 sm:p-5">
        <header className="flex items-start justify-between gap-2">
          <span
            className={cn(
              'rounded-pill px-2 py-0.5 text-[0.6875rem] leading-tight font-medium sm:px-2.5 sm:py-1 sm:text-xs',
              CHIP[pub.category],
            )}
          >
            {labels.chip}
          </span>
          <span className="text-[0.6875rem] text-fg/60 tabular-nums sm:text-xs">{pub.year}</span>
        </header>

        <h3 className="line-clamp-4 text-[0.9375rem] leading-snug font-medium sm:line-clamp-3 sm:text-xl">
          {pub.title}
        </h3>

        <div className="flex flex-col gap-0.5 text-[0.6875rem] leading-snug text-fg/60 sm:text-xs">
          {pub.citation && <p className="line-clamp-2 sm:line-clamp-3">{pub.citation}</p>}
          {pub.collaborators && (
            <p className="line-clamp-2 italic">{labels.collaborators}</p>
          )}
        </div>

        <div className="mt-auto pt-2">
          {pub.link ? (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-8 items-center justify-center gap-2 rounded-pill bg-fg text-bg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-auto sm:px-4 sm:py-2 sm:text-xs"
            >
              <Arrow />
              <span className="sr-only sm:not-sr-only">{labels.view}</span>
            </a>
          ) : (
            <span className="hidden rounded-pill border border-line px-3 py-1.5 text-xs text-fg/50 sm:inline-block">
              {labels.noLink}
            </span>
          )}
        </div>
      </article>
    </li>
  )
})
