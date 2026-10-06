import { cacheLife } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/routing'
import { getSiteSettings } from '@/lib/sanity/fetch'

/** El año se cachea (cacheComponents no permite leer la hora en el prerender). */
async function currentYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

type FooterLink = { _key: string; label?: string; url?: string }

function LinkList({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h2 className="text-sm font-medium tracking-wide uppercase">{title}</h2>
      <ul className="mt-[clamp(1.5rem,3vw,3rem)] flex flex-col gap-[clamp(0.875rem,1.4vw,1.25rem)]">
        {items.map((item) => (
          <li key={item._key}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[clamp(1rem,1.25vw,1.125rem)] leading-snug underline-offset-4 hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function Footer({ locale }: { locale: Locale }) {
  const [t, settings, year] = await Promise.all([
    getTranslations({ locale, namespace: 'Footer' }),
    getSiteSettings(locale),
    currentYear(),
  ])

  const links = (settings?.footerLinks ?? []) as FooterLink[]
  const info: FooterLink[] = [
    ...(settings?.cvUrl ? [{ _key: 'cv', label: t('cv'), url: settings.cvUrl }] : []),
    ...((settings?.footerInfo ?? []) as FooterLink[]),
  ]

  return (
    <footer
      data-nav-tone="light"
      aria-label={t('nav')}
      className="px-[var(--gutter)] pt-[clamp(2rem,5vw,6rem)] pb-6"
    >
      <div className="grid grid-cols-1 gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-12 rounded-card bg-card p-[clamp(1.5rem,2.5vw,2.5rem)]">
          <p className="text-[clamp(2.5rem,4vw,4rem)] leading-none font-normal tracking-tight">
            {t('title')}
          </p>
          <span
            aria-hidden
            className="block size-[clamp(6rem,9vw,8.5rem)] bg-fg [mask:url(/logos/cc-logo-footer.svg)_center/contain_no-repeat]"
          />
          <p className="text-[clamp(0.9375rem,1.2vw,1.125rem)]">{t('rights')}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:pl-[clamp(1rem,2vw,2rem)]">
          <LinkList title={t('links')} items={links} />
          <LinkList title={t('info')} items={info} />
        </div>
      </div>

      <div className="mt-[clamp(2rem,3vw,3rem)] grid grid-cols-1 gap-3 lg:grid-cols-2 text-[clamp(0.9375rem,1.2vw,1.125rem)]">
        <p>
          © {year}. {t('designedBy')}{' '}
          <a
            href="https://hyperagencia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Hyper
          </a>
        </p>
        <p className="flex gap-6 font-medium lg:pl-[clamp(1rem,2vw,2rem)]">
          <span>{t('privacy')}</span>
          <span>{t('terms')}</span>
        </p>
      </div>
    </footer>
  )
}
