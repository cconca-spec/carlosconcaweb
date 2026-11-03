# INFRA

Quién es dueño de qué, variables de entorno y cómo mover el hosting.
Se completa a medida que llegan las cuentas del cliente.

## Cuentas

| Servicio | Dueño actual | Dueño final | Estado |
|---|---|---|---|
| Repo GitHub (`cconca-spec/carlosconcaweb`) | Carlos | Carlos | publicado el 2026-10-15; Hyper es colaborador y empuja por SSH con deploy key |
| Sanity (proyecto `ntv5ihqf`, dataset `production`) | Carlos | Carlos | creado; contenido migrado (197 publicaciones + 14 páginas) |
| Vercel | Carlos (Hobby) | Carlos | proyecto creado 2026-10-19, Root Directory `web`; falta confirmar el primer build en Ready |
| DNS carlosconca.cl | — | Carlos | pendiente |

## Repo y acceso por SSH

El repo vive en la cuenta de Carlos porque Vercel Hobby solo conecta repos del dueño.
`origin` = `git@github.com-cconca:cconca-spec/carlosconcaweb.git`. El alias sale de
`~/.ssh/config` y usa la llave `~/.ssh/id_hyper_cconca` (ed25519, título `hyper-access`),
registrada como **deploy key con escritura** en el repo (Settings → Deploy keys), no en la
cuenta de Carlos. Para otra máquina: generar una llave nueva y registrarla igual.
Comprobar con `ssh -T git@github.com-cconca`.

## Conectar Vercel (lo hace Carlos desde su cuenta)

1. Add New → Project → importar `cconca-spec/carlosconcaweb`.
2. Root Directory: `web`. Framework: Next.js.
3. Variables de entorno de `.env.example` (sin `SANITY_WRITE_TOKEN`).
4. En Hobby, un commit de un autor distinto al dueño puede quedar bloqueado: probar con un
   deploy de prueba hecho por `hyperagencia`.
   Problemas ya vistos: `pnpm@11.12.0`/`11.13.0` están rotos (el `packageManager` está
   fijado en 11.13.1; no usar versiones deprecadas en npm) y `NEXT_NO_VERSION` si el Root
   Directory no es `web`.
5. Con la URL pública, crear el webhook de Sanity (sección siguiente).

## Variables de entorno

Ver `.env.example`. Los valores reales viven en `.env.local` (nunca al repo) y,
en producción, en el proyecto de Vercel.

| Variable | Uso |
|---|---|
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | cliente y script de migración |
| `SANITY_WRITE_TOKEN` | solo `pnpm migrate`; permisos de escritura |
| `SANITY_REVALIDATE_SECRET` | firma del webhook que invalida caché (T3) |

## Token de escritura de Sanity

Token "Hyper Access" (permisos Editor, Access Manager, Blueprints Deployer, Deploy Studio),
vence el 2027-01-03. Solo en `.env.local`. Quedó expuesto en una conversación de desarrollo:
**rotarlo** (sanity.io/manage → API → Tokens) al terminar de desarrollar, y usar un token
nuevo y mínimo (solo Editor) para el cutover. Las lecturas del sitio no usan token.

## Scripts de datos

| Comando | Qué hace |
|---|---|
| `pnpm migrate` | Importa `data/publicaciones.json` (idempotente por `legacyId`, verifica) |
| `pnpm extract:wp` / `pnpm build:content` | Texto del WordPress → `data/contenido/*.json` |
| `pnpm load:pages` | Carga esos JSON con ID fijo `{tipo}-{locale}`; `--force` sobrescribe |

Para el cutover (Fase 6) se repiten contra el proyecto definitivo de Carlos.

## Webhook de revalidación (pendiente: necesita URL pública)

Cuando exista el sitio desplegado, en sanity.io/manage → API → Webhooks:

- URL: `https://<dominio>/api/revalidate/`, método POST
- Secret: el valor de `SANITY_REVALIDATE_SECRET` (en Vercel y en `.env.local`)
- Dataset: `production`; disparar en create, update y delete
- Filtro: `_type in ["publication","homePage","biografiaPage","investigacionPage","docenciaPage","publicacionesPage","contactoPage","siteSettings"]`
- Proyección: `{_type}`

El endpoint devuelve 401 sin firma válida y 400 si el tipo no es uno de los anteriores.

## Lighthouse CI (T10)

`pnpm lhci` (en CI, tras `test:routes`) levanta `next start` en :3102 y mide 6 URLs representativas
en perfil móvil, 3 corridas por URL y mediana (`web/lighthouserc.cjs`). Requiere `pnpm build` y Chrome.
Falla el build si: LCP > 4500 ms (tope de regresión; el objetivo de 1,2 s sale como advertencia),
CLS > 0,05, TBT > 200 ms (proxy de laboratorio del INP, que es métrica de campo), accesibilidad < 0,95
o falla alguna auditoría SEO básica. `canonical` se excluye porque apunta a carlosconca.cl y en CI se
mide en localhost (lo cubre `lib/seo/metadata.test.ts`). El reporte queda como artefacto `lighthouse`.

## Migración de hosting

Pendiente: se documenta en la Fase 6 (cutover).

## Redirects en el cutover

Tras cambiar el DNS, repetir `curl -sI` sobre cada `source` de `web/lib/redirects.ts` contra el dominio real (301 al destino, sin cadenas), `/cv/` (302 a cdn.sanity.io) y una URL demo (`/work/` → 404). Reenviar el sitemap nuevo en Search Console; los `wp-sitemap*.xml` darán 404.
