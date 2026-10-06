/**
 * Agrega `areasIntro` y `researchAreas` a los homePage ya cargados, sin tocar
 * el resto del documento (lo editado en el Studio se conserva).
 *
 *   pnpm exec tsx scripts/patch-home-areas.ts --dry-run
 *   pnpm exec tsx scripts/patch-home-areas.ts
 *
 * Solo escribe si el campo aún no existe: es idempotente y no pisa ediciones.
 */
import { createClient } from '@sanity/client'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-02-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function main() {
  for (const locale of ['es', 'en']) {
    const src = JSON.parse(await readFile(resolve('data/contenido', `homePage.${locale}.json`), 'utf8'))
    const id = `homePage-${locale}`
    const current = await client.getDocument(id)
    if (!current) throw new Error(`${id} no existe: corre pnpm load:pages primero`)
    const set: Record<string, unknown> = {}
    if (!current.areasIntro) set.areasIntro = src.areasIntro
    if (!current.researchAreas) set.researchAreas = src.researchAreas
    console.log(`${id}: ${Object.keys(set).join(', ') || 'nada que hacer'}${DRY_RUN ? ' (simulación)' : ''}`)
    if (!DRY_RUN && Object.keys(set).length) await client.patch(id).set(set).commit()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
