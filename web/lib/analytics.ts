/** ID de medición de GA4 (propiedad "carlosconca.cl"). Es público: va en el HTML de cualquier sitio con GA. */
export const GA_MEASUREMENT_ID = 'G-XZS2V3VY1Z'

/**
 * Solo se mide el dominio real. En carlosconcaweb.vercel.app, previews y localhost el script no se
 * carga, para no mezclar visitas de prueba con las de Carlos ni sumar peso a Lighthouse CI.
 */
export const GA_HOSTS = ['carlosconca.cl', 'www.carlosconca.cl'] as const
