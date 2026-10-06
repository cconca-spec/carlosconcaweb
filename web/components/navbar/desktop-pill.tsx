'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { cn } from '@/lib/cn'
import { useDark, useHydrated } from '@/lib/use-dark'
import { NAV_ITEMS } from './nav-items'
import { useNavTone } from './use-nav-tone'

/**
 * Píldora flotante fija abajo al centro (desktop): página actual + acceso
 * directo a Publicaciones. Estando en Publicaciones, el acceso es a Inicio.
 */
export function DesktopPill() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const hydrated = useHydrated()
  const siteDark = useDark()
  const tone = useNavTone('bottom')

  const dark = siteDark || tone === 'dark'
  // La ruta actual no es fiable en el servidor (páginas estáticas en /en): ver mobile-chrome.
  const current = (hydrated && NAV_ITEMS.find((i) => i.href === pathname)) || NAV_ITEMS[0]
  const other = current.href === '/publicaciones' ? NAV_ITEMS[0] : NAV_ITEMS[1]

  return (
    <nav
      aria-label={t('quickSwitch')}
      className={cn(
        'fixed bottom-6 left-1/2 z-50 hidden h-12 w-[20rem] -translate-x-1/2 items-center rounded-full p-1 backdrop-blur-[var(--glass-blur)] transition-colors duration-300 md:flex',
        dark ? 'bg-glass-dark text-paper-50' : 'bg-glass-light text-ink-900',
      )}
    >
      <span
        aria-current="page"
        className={cn(
          'flex h-full flex-1 items-center justify-center truncate rounded-full bg-paper-50 px-3 text-base text-ink-900 shadow-[0_1px_4px_rgb(0_0_0/0.12)]',
          !hydrated && 'invisible',
        )}
      >
        {t(current.key)}
      </span>
      <Link
        href={other.href}
        className="flex h-full flex-1 items-center justify-center truncate rounded-full px-3 text-base transition-opacity hover:opacity-70"
      >
        {t(other.key)}
      </Link>
    </nav>
  )
}
