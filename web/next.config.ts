import type { NextConfig } from 'next'
import { loadEnvConfig } from '@next/env'
import createNextIntlPlugin from 'next-intl/plugin'
import { resolve } from 'node:path'
import { LEGACY_REDIRECTS } from './lib/redirects'

// Un solo .env.local en la raíz del monorepo para web, studio y migración
// forceReload: Next ya cargó los .env de web/ y cachea ese resultado
loadEnvConfig(resolve(process.cwd(), '..'), process.env.NODE_ENV !== 'production', console, true)

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')

const nextConfig: NextConfig = {
  cacheComponents: true,
  trailingSlash: true,
  // statusCode explícito: `permanent` emite 308 y estos son 301.
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, statusCode: 301 }))
  },
}

export default withNextIntl(nextConfig)
