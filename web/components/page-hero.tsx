import type { ReactNode } from 'react'

/** Hero de las páginas internas: banda oscura compacta con el título (y un extra opcional a la derecha en mobile). */
export function PageHero({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <section
      data-nav-tone="dark"
      className="flex min-h-[34svh] items-end justify-between gap-4 bg-tl-bg px-[var(--gutter)] pt-[calc(var(--nav-h)+clamp(2rem,5vw,4.5rem))] pb-[clamp(1.5rem,5vw,4.5rem)] text-paper-50 md:block md:min-h-0"
    >
      <h1 className="text-[clamp(2.25rem,4.4vw,4.25rem)] leading-tight font-normal tracking-tight">
        {title}
      </h1>
      {aside}
    </section>
  )
}
