import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: {
    // Los tests de rutas necesitan servidor: se corren con `pnpm test:routes`
    exclude: ['tests/**', 'node_modules/**'],
    // next-intl importa 'next/navigation' sin extensión; vite lo resuelve si se procesa en línea
    server: { deps: { inline: ['next-intl'] } },
  },
})
