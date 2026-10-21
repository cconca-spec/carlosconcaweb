/**
 * Redirects 301 desde URLs del WordPress anterior que siguen indexadas o enlazadas.
 * El resto del contenido demo del tema (sample-page, work, portfolio, taxonomías, hello-world)
 * se deja a propósito en 404: no tiene valor SEO y redirigirlo a la home cuenta como soft-404.
 * Los destinos son las URLs finales (con barra), para que no haya cadenas de redirects.
 */
export const LEGACY_REDIRECTS = [
  // Home EN antigua, aún indexada
  { source: '/en/inicio-english/', destination: '/en/' },
  // Autor y feed del WordPress
  { source: '/author/cconcaroot/', destination: '/' },
  { source: '/en/author/cconcaroot/', destination: '/en/' },
  { source: '/feed/', destination: '/' },
  { source: '/en/feed/', destination: '/en/' },
  // CV en PDF: /cv/ apunta siempre al archivo vigente en Sanity
  { source: '/wp-content/uploads/2026/03/cconca-ingles.pdf', destination: '/cv/' },
] as const
