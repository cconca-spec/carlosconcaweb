'use client'

import { useEffect, useRef, useState } from 'react'

type Item = {
  key: string
  decade: string
  caption: string
  cards: { key: string; text: string }[]
}

/**
 * Columna izquierda fija (año + "n / 6") que cambia según la década que cruza el
 * centro de la pantalla; las cards de cada década pasan a la derecha. Todas las
 * etiquetas están en el DOM (apiladas); solo cambia cuál es visible.
 */
export function TimelineScroller({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0)
  const groups = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute('data-i')))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    groups.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [items.length])

  return (
    <div className="grid grid-cols-[3.75rem_1fr] gap-x-4 lg:grid-cols-[1fr_1.35fr] lg:gap-x-[clamp(2rem,6vw,6rem)]">
      <div aria-hidden className="relative">
        <div className="sticky top-0 flex h-dvh items-start pt-[calc(var(--nav-h)+1rem)] lg:items-center lg:pt-0">
          <div className="relative w-full">
            {items.map((d, i) => (
              <div
                key={d.key}
                className={`transition-all duration-300 motion-reduce:transition-none ${
                  i === 0 ? 'relative' : 'absolute inset-x-0 top-0'
                } ${i === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
              >
                <p className="text-xs tracking-wide tabular-nums lg:text-base">
                  {i + 1} / {items.length}
                </p>
                <p className="mt-1 text-[0.9375rem] leading-none tracking-tight lg:mt-3 lg:text-[clamp(3.5rem,6.5vw,6.5rem)]">
                  {d.decade}
                </p>
                <p className="mt-4 hidden text-[clamp(0.9375rem,1.2vw,1.125rem)] lg:block">
                  {d.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-[clamp(3rem,12dvh,8rem)] py-[10dvh] lg:py-[25dvh]">
        {items.map((d, i) => (
          <li
            key={d.key}
            data-i={i}
            ref={(el) => {
              groups.current[i] = el
            }}
            className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.5rem)]"
          >
            <h3 className="sr-only">
              {d.decade} · {d.caption}
            </h3>
            <p aria-hidden className="text-sm lg:hidden">
              {d.caption}
            </p>
            {d.cards.map((c) => (
              <p
                key={c.key}
                className="rounded-card bg-tl-card px-[clamp(1.25rem,8vw,7.5rem)] py-[clamp(1.75rem,5vw,5rem)] text-[clamp(1.0625rem,1.6vw,1.625rem)] leading-[1.15]"
              >
                {c.text}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  )
}
