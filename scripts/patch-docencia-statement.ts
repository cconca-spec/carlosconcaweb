/**
 * Agrega `statement` (frase destacada) a los docenciaPage ya cargados, sin
 * tocar el resto del documento. Solo escribe si el campo aún no existe.
 *
 *   pnpm exec tsx scripts/patch-docencia-statement.ts --dry-run
 *   pnpm exec tsx scripts/patch-docencia-statement.ts
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
    const src = JSON.parse(await readFile(resolve('data/contenido', `docenciaPage.${locale}.json`), 'utf8'))
    const id = `docenciaPage-${locale}`
    const current = await client.getDocument(id)
    if (!current) throw new Error(`${id} no existe: corre pnpm load:pages primero`)
    const todo = !current.statement
    console.log(`${id}: ${todo ? 'statement' : 'nada que hacer'}${DRY_RUN ? ' (simulación)' : ''}`)
    if (!DRY_RUN && todo) await client.patch(id).set({ statement: src.statement }).commit()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
