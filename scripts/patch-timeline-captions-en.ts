/**
 * Traduce las bajadas del timeline de `homePage-en` (el WordPress las tiene en
 * español). Solo toca `timeline[].caption` y solo si sigue en español: no pisa
 * ediciones hechas en el Studio.
 *
 *   pnpm exec tsx scripts/patch-timeline-captions-en.ts --dry-run
 *   pnpm exec tsx scripts/patch-timeline-captions-en.ts
 */
import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')
const TRANSLATIONS: Record<string, string> = {
  Formación: 'Training',
  'París y el CNRS': 'Paris and the CNRS',
  'Retorno y Liderazgo': 'Return and Leadership',
  'Premio Nacional': 'National Prize',
  Consolidación: 'Consolidation',
  'Legado Actual': 'Current Legacy',
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-02-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function main() {
  const id = 'homePage-en'
  const doc = await client.getDocument<{ timeline?: { _key: string; caption?: string }[] }>(id)
  if (!doc) throw new Error(`${id} no existe`)
  const set: Record<string, string> = {}
  for (const item of doc.timeline ?? []) {
    const en = item.caption && TRANSLATIONS[item.caption]
    if (en) set[`timeline[_key=="${item._key}"].caption`] = en
  }
  console.log(`${id}: ${Object.keys(set).length} bajadas por traducir${DRY_RUN ? ' (simulación)' : ''}`)
  if (!DRY_RUN && Object.keys(set).length) await client.patch(id).set(set).commit()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
