import { getHomePage } from '@/lib/sanity/fetch'
import { buildLlmsTxt } from '@/lib/seo/llms'

export async function GET() {
  const home = await getHomePage('es')
  return new Response(buildLlmsTxt({ home }), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
