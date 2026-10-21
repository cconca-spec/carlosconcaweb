import { getSiteSettings } from '@/lib/sanity/fetch'

/** Enlace estable al CV: redirige al archivo vigente en Sanity (temporal, porque el destino cambia al subir uno nuevo). */
export async function GET() {
  const settings = await getSiteSettings('es')
  if (!settings?.cvUrl) return new Response('Not found', { status: 404 })
  return Response.redirect(settings.cvUrl, 302)
}
