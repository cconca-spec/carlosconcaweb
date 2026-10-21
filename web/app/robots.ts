import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

/** Rastreadores de asistentes de IA: se permiten de forma explícita (objetivo AEO/GEO del proyecto). */
const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot', 'Google-Extended']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow: '/api/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
