'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Area = { key: string; title: string; body: string; image: string }

/**
 * Tarjetas de áreas (6 columnas en desktop, carrusel en pantallas menores) y
 * un <dialog> fullscreen por área. Los diálogos cerrados siguen en el HTML del
 * servidor, así que el texto completo es indexable sin pedir nada más.
 */
export function ResearchAreasGrid({
  areas,
  closeLabel,
  listLabel,
}: {
  areas: Area[]
  closeLabel: string
  listLabel: string
}) {
  const dialogs = useRef<(HTMLDialogElement | null)[]>([])
  const cursors = useRef<(HTMLSpanElement | null)[]>([])
  const [open, setOpen] = useState<number | null>(null)

  const moveCursor = useCallback((i: number, x: number, y: number) => {
    const el = cursors.current[i]
    if (el) el.style.opacity = '1'
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  }, [])

  // Bloquea el scroll del fondo mientras hay un área abierta.
  useEffect(() => {
    if (open === null) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [open])

  // El × sigue al puntero (solo en dispositivos con puntero preciso).
  useEffect(() => {
    if (open === null) return
    let frame = 0
    let x = 0
    let y = 0
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          moveCursor(open, x, y)
        })
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [open, moveCursor])

  function openArea(i: number, e: React.MouseEvent) {
    if (e.detail > 0) moveCursor(i, e.clientX, e.clientY)
    dialogs.current[i]?.showModal()
    dialogs.current[i]?.focus() // evita que el foco caiga en el botón × y lo muestre
    setOpen(i)
  }

  return (
    <>
      <ul
        aria-label={listLabel}
        className="flex snap-x snap-mandatory gap-[clamp(0.75rem,1.5vw,1.5rem)] overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-4 [scrollbar-width:none] lg:grid lg:snap-none lg:grid-cols-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {areas.map((a, i) => (
          <li
            key={a.key}
            className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-auto"
          >
            <button
              type="button"
              onClick={(e) => openArea(i, e)}
              className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="relative block aspect-[750/1080] overflow-hidden rounded-card bg-art">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, 68vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </span>
              <span className="mt-[clamp(0.75rem,1.4vw,1.5rem)] block text-[clamp(1.125rem,1.7vw,1.875rem)] leading-tight">
                {a.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {areas.map((a, i) => (
        <dialog
          key={a.key}
          ref={(el) => {
            dialogs.current[i] = el
          }}
          aria-labelledby={`area-title-${a.key}`}
          tabIndex={-1}
          onClick={() => dialogs.current[i]?.close()}
          onClose={() => setOpen((cur) => (cur === i ? null : cur))}
          className="m-0 hidden outline-none h-dvh max-h-none w-dvw max-w-none border-0 bg-bg p-0 text-fg opacity-100 transition-opacity duration-300 backdrop:bg-transparent open:grid open:grid-rows-[auto_1fr] starting:open:opacity-0 motion-reduce:transition-none lg:open:grid-cols-2 lg:open:grid-rows-1 pointer-fine:cursor-none"
        >
          <div className="relative order-2 flex min-h-0 overflow-y-auto lg:order-1">
            <div className="my-auto w-full max-w-[44rem] px-[clamp(1.5rem,7vw,12.5rem)] py-[clamp(2rem,6vw,5rem)] lg:mx-0">
              <h3
                id={`area-title-${a.key}`}
                className="text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] font-normal tracking-tight"
              >
                {a.title}
              </h3>
              <div className="mt-[clamp(1.25rem,2.5vw,2.25rem)] flex flex-col gap-4 text-[clamp(1rem,1.15vw,1.125rem)] leading-relaxed text-fg/80">
                {a.body.split(/\n{2,}/).map((p, n) => (
                  <p key={n}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative order-1 h-[34dvh] bg-art lg:order-2 lg:h-auto">
            <Image
              src={a.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>

          {/* Accesible por teclado y táctil; con ratón lo reemplaza el cursor ×. */}
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute top-4 right-4 z-10 grid size-12 place-items-center rounded-full border border-white bg-art/60 text-white backdrop-blur pointer-fine:opacity-0 pointer-fine:focus-visible:opacity-100"
          >
            <CloseIcon />
          </button>

          <span
            ref={(el) => {
              cursors.current[i] = el
            }}
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-20 opacity-0 hidden size-[clamp(3.25rem,4.5vw,4.5rem)] place-items-center rounded-full border-[1.5px] border-white text-white mix-blend-difference pointer-fine:grid"
          >
            <CloseIcon />
          </span>
        </dialog>
      ))}
    </>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-[30%]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M2 2l12 12M14 2L2 14" strokeLinecap="round" />
    </svg>
  )
}
