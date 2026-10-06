/** Dominio de producción: base de canonical, hreflang y JSON-LD. */
export const SITE_URL = 'https://carlosconca.cl'

/** DOI desnudo a partir de un enlace completo (no existe campo `doi` en Sanity). */
export function doiFromLink(link: string | null | undefined): string | null {
  const m = link?.match(/10\.\d{4,9}\/[^\s?#]+/)
  return m ? decodeURIComponent(m[0]) : null
}
