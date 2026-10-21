import {
  getBiografiaPage,
  getDocenciaPage,
  getHomePage,
  getInvestigacionPage,
  getPublications,
} from '@/lib/sanity/fetch'
import { buildLlmsFull } from '@/lib/seo/llms'

export async function GET() {
  const [home, biografia, investigacion, docencia, publications] = await Promise.all([
    getHomePage('es'),
    getBiografiaPage('es'),
    getInvestigacionPage('es'),
    getDocenciaPage('es'),
    getPublications(),
  ])
  return new Response(buildLlmsFull({ home, biografia, investigacion, docencia, publications }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
