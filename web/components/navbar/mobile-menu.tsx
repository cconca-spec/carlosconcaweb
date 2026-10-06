'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, type RefObject } from 'react'
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation'
import { routing, type Locale } from '@/lib/i18n/routing'
import { cn } from '@/lib/cn'
import { NAV_ITEMS } from './nav-items'

/** Menú flotante de la barra inferior: páginas + conmutador de idioma. */
export function MobileMenu({
  id,
  open,
  onClose,
  anchor,
}: {
  id: string
  open: boolean
  onClose: (restoreFocus?: boolean) => void
  /** Contenedor del botón y del panel: los clics fuera de él cierran el menú. */
  anchor: RefObject<HTMLElement | null>
}) {
  const t = useTranslations('Nav')
  const active = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose(true)
    const onDown = (e: PointerEvent) => {
      if (!anchor.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, onClose, anchor])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="dialog"
          aria-label={t('mobileMenu')}
          initial={reduce ? false : { opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'bottom left' }}
          className="absolute bottom-full left-0 mb-2 w-[min(18rem,calc(100vw-2*var(--gutter)))] rounded-card bg-panel p-4 text-fg shadow-lg"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => onClose()}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={cn(
                    'block rounded-full px-3 py-2 text-lg',
                    pathname === href && 'font-medium',
                  )}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>

          <div
            role="group"
            aria-label={t('language')}
            className="mt-4 inline-flex rounded-full bg-paper-50 p-1 text-ink-900"
          >
            {routing.locales.map((locale) => (
              <button
                key={locale}
                type="button"
                lang={locale}
                aria-pressed={locale === active}
                onClick={() => {
                  onClose()
                  if (locale !== active) router.replace(pathname, { locale })
                }}
                className={cn(
                  'rounded-full px-3 py-1.5 text-base uppercase',
                  locale === active ? 'font-semibold' : 'opacity-50',
                )}
              >
                {locale}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
