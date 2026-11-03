/**
 * Actualiza la política de privacidad (cuerpo, fecha y SEO) para mencionar GA4, sin tocar nada más.
 * Solo escribe si el documento sigue siendo el borrador del 2026-11-02 (`updated` sin cambiar):
 * si Carlos o el cliente ya lo editaron en el Studio, no lo pisa.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/patch-privacidad-analytics.ts --dry-run
 *   pnpm exec tsx --env-file=.env.local scripts/patch-privacidad-analytics.ts
 */
import { createClient } from '@sanity/client'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const DRAFT_DATE = '2026-11-02'
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-02-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function main() {
  for (const locale of ['es', 'en']) {
    const src = JSON.parse(await readFile(resolve('data/contenido', `privacidadPage.${locale}.json`), 'utf8'))
    const id = `privacidadPage-${locale}`
    const current = await client.getDocument(id)
    if (!current) throw new Error(`${id} no existe: corre pnpm load:pages primero`)
    const todo = current.updated === DRAFT_DATE
    console.log(`${id}: ${todo ? 'actualizar' : `se deja (updated=${current.updated})`}${DRY_RUN ? ' (simulación)' : ''}`)
    if (!DRY_RUN && todo) await client.patch(id).set({ body: src.body, updated: src.updated, seo: src.seo }).commit()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
