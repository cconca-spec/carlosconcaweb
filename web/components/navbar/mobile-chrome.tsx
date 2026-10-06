'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useId, useRef, useState } from 'react'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { cn } from '@/lib/cn'
import { useSearchQuery } from '@/lib/search/query-store'
import { useDark, useHydrated } from '@/lib/use-dark'
import { ThemeToggle } from '../theme-toggle'
import { MobileMenu } from './mobile-menu'
import { NAV_ITEMS } from './nav-items'
import { useNavTone } from './use-nav-tone'

/**
 * Navegación mobile (< md): logo flotante arriba y barra inferior flotante
 * [menú] [página actual · Publicaciones] [tema]. En /publicaciones la píldora
 * central es el buscador (comparte el texto con la página vía query-store).
 */
export function MobileChrome() {
  const t = useTranslations('Nav')
  const tp = useTranslations('Publications')
  const pathname = usePathname()
  const hydrated = useHydrated()
  const siteDark = useDark()
  const topTone = useNavTone('top')
  const bottomTone = useNavTone('bottom')
  const [query, setQuery] = useSearchQuery()

  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  const close = useCallback((restoreFocus?: boolean) => {
    setOpen(false)
    if (restoreFocus) button.current?.focus()
  }, [])

  const logoDark = siteDark || topTone === 'dark'
  const barDark = siteDark || bottomTone === 'dark'
  const onPublications = hydrated && pathname === '/publicaciones'
  // En el servidor la ruta actual no es fiable (páginas estáticas en /en): hasta hidratar
  // se renderiza el primer ítem y se oculta, para no provocar un desajuste de hidratación.
  const current = (hydrated && NAV_ITEMS.find((i) => i.href === pathname)) || NAV_ITEMS[0]

  const glass = barDark ? 'bg-glass-dark text-paper-50' : 'bg-glass-light text-ink-900'
  const circle = cn(
    'grid size-12 shrink-0 place-items-center rounded-full backdrop-blur-[var(--glass-blur)] transition-colors duration-300',
    glass,
  )

  return (
    <div className="md:hidden">
      <Link
        href="/"
        aria-label={t('logo')}
        className="fixed top-5 left-[var(--gutter)] z-50"
      >
        <Image
          src={logoDark ? '/logos/logo-carlos-conca-light.svg' : '/logos/logo-carlos-conca.svg'}
          alt=""
          width={40}
          height={40}
          priority
        />
      </Link>

      <div
        role="navigation"
        aria-label={t('mobileBar')}
        className="fixed inset-x-[var(--gutter)] bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-2"
      >
        <div ref={anchor} className="relative shrink-0">
          <button
            ref={button}
            type="button"
            aria-label={open ? t('closeMenu') : t('menu')}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className={circle}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M4 8h16M4 12h16M4 16h16" strokeLinecap="round" />
            </svg>
          </button>
          <MobileMenu id={menuId} open={open} onClose={close} anchor={anchor} />
        </div>

        <div
          className={cn(
            'flex h-12 min-w-0 flex-1 items-center rounded-full p-1 backdrop-blur-[var(--glass-blur)] transition-colors duration-300',
            glass,
          )}
        >
          {onPublications ? (
            <>
              <label htmlFor="pub-bar-q" className="sr-only">
                {tp('searchLabel')}
              </label>
              <input
                id="pub-bar-q"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tp('searchBar')}
                className="h-full min-w-0 flex-1 rounded-full bg-transparent px-4 text-base outline-none placeholder:text-current/60"
              />
            </>
          ) : (
            <>
              <span
                aria-current="page"
                className={cn(
                  'flex h-full flex-1 items-center justify-center truncate rounded-full bg-paper-50 px-3 text-base text-ink-900',
                  !hydrated && 'invisible',
                )}
              >
                {t(current.key)}
              </span>
              <Link
                href="/publicaciones"
                className="flex h-full flex-1 items-center justify-center truncate px-3 text-base"
              >
                {t('publications')}
              </Link>
            </>
          )}
        </div>

        <div className={circle}>
          <ThemeToggle className="size-full! bg-transparent! p-3! text-current!" />
        </div>
      </div>
    </div>
  )
}
