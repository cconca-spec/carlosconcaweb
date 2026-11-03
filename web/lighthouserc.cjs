/**
 * Lighthouse CI (T10). Corre contra `next start`, así que requiere `pnpm build` antes.
 *   pnpm lhci
 * Perfil móvil (el predeterminado de Lighthouse), que es donde está el objetivo del proyecto.
 * Las URLs llevan barra final (`trailingSlash: true`).
 */
const PORT = 3102
const PAGES = [
  '/', // home ES
  '/publicaciones/', // las 197 tarjetas en el HTML: la más pesada
  '/investigacion/',
  '/privacidad/', // texto largo, representa las páginas simples
  '/en/',
  '/en/publications/',
]

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm exec next start -p ${PORT}`,
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 60000,
      url: PAGES.map((p) => `http://localhost:${PORT}${p}`),
      numberOfRuns: 3,
    },
    assert: {
      // Se evalúa la mediana de las 3 corridas.
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          aggregationMethod: 'median',
          assertions: {
            // Objetivos de CLAUDE.md. LCP: el objetivo (1,2 s) se reporta como advertencia y el
            // `error` es un tope de regresión calibrado con la primera medición (2026-11-02:
            // 2,0–3,7 s en móvil con red lenta simulada). Bajar el tope a medida que se optimice.
            'largest-contentful-paint': ['error', { maxNumericValue: 4500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
            // INP es métrica de campo; en laboratorio su proxy es el tiempo de bloqueo total.
            'total-blocking-time': ['error', { maxNumericValue: 200 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            // SEO por auditoría y no por categoría: `canonical` falla en local porque apunta a
            // https://carlosconca.cl (lo cubre lib/seo/metadata.test.ts).
            'document-title': 'error',
            'meta-description': 'error',
            'http-status-code': 'error',
            'is-crawlable': 'error',
            hreflang: 'error',
            'link-text': 'error',
            'crawlable-anchors': 'error',
            'image-alt': 'error',
            canonical: 'off',
          },
        },
        {
          // Objetivo real del proyecto: se ve en el reporte sin romper el build.
          matchingUrlPattern: '.*',
          aggregationMethod: 'median',
          assertions: { 'largest-contentful-paint': ['warn', { maxNumericValue: 1200 }] },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}
