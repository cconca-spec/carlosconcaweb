# INFRA

Quién es dueño de qué, variables de entorno y cómo mover el hosting.
Se completa a medida que llegan las cuentas del cliente.

## Cuentas

| Servicio | Dueño actual | Dueño final | Estado |
|---|---|---|---|
| Repo GitHub (`cconca-spec/carlosconcaweb`) | Carlos | Carlos | publicado el 2026-10-15; Hyper es colaborador y empuja por SSH con deploy key |
| Sanity (proyecto `ntv5ihqf`, dataset `production`) | Carlos | Carlos | contenido migrado (197 publicaciones + 18 páginas); Studio en https://carlosconca.sanity.studio; webhook activo |
| Vercel | Carlos (Hobby) | Carlos | producción en https://carlosconcaweb.vercel.app (Ready, 2026-11-02), Root Directory `web` |
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

## Webhook de revalidación (activo desde 2026-11-02)

Creado en Sanity (proyecto `ntv5ihqf`, id `lzsRqApprGGahRy9`, visible en sanity.io/manage → API → Webhooks):

- URL: `https://carlosconcaweb.vercel.app/api/revalidate/`, método POST
  (al cambiar el DNS a carlosconca.cl, **actualizar la URL** del webhook)
- Secret: el valor de `SANITY_REVALIDATE_SECRET` (en Vercel y en `.env.local`)
- Dataset: `production`; create, update y delete; sin borradores
- Filtro: `_type in ["publication","homePage","biografiaPage","investigacionPage","docenciaPage","publicacionesPage","contactoPage","privacidadPage","terminosPage","siteSettings"]`
- Proyección: `{_type}`

Si se agrega un tipo de documento nuevo, sumarlo a `PAGE_TYPES` (`web/lib/sanity/tags.ts`) **y** a este filtro.
El endpoint devuelve 401 sin firma válida y 400 si el tipo no es uno de los anteriores.
Probado creando y borrando un documento de prueba: 200 `{"revalidated":"privacidadPage"}` en ambas entregas.
Se creó por la Management API (`POST api.sanity.io/v2021-10-04/hooks/projects/<id>` con `type: "document"` y
`rule: {on, filter, projection}`; hace falta `apiVersion`).

## Deploy del Studio

`pnpm --filter studio run deploy` (con `run`: `pnpm deploy` es otro comando) y `SANITY_AUTH_TOKEN` en el
entorno para no usar login interactivo. No pasar flags tras `--`: se toman como la carpeta de salida.

## Lighthouse CI (T10)

`pnpm lhci` (en CI, tras `test:routes`) levanta `next start` en :3102 y mide 6 URLs representativas
en perfil móvil, 3 corridas por URL y mediana (`web/lighthouserc.cjs`). Requiere `pnpm build` y Chrome.
Falla el build si: LCP > 4500 ms (tope de regresión; el objetivo de 1,2 s sale como advertencia),
CLS > 0,05, TBT > 200 ms (proxy de laboratorio del INP, que es métrica de campo), accesibilidad < 0,95
o falla alguna auditoría SEO básica. `canonical` se excluye porque apunta a carlosconca.cl y en CI se
mide en localhost (lo cubre `lib/seo/metadata.test.ts`). El reporte queda como artefacto `lighthouse`.

## Migración de hosting: checklist de cutover (carlosconca.cl)

### DNS actual (inventario del 2026-11-02, zona del cPanel de Namecheap)
Nameservers: `dns1/dns2.namecheaphosting.com` → **la zona del cPanel es la que manda**. WordPress y correo están en
el mismo servidor de Namecheap (198.54.119.207); los MX apuntan a `mx{1,2,3}-hosting.jellyfish.systems`.

| Registro | Valor | En el cutover |
|---|---|---|
| `A` carlosconca.cl | 198.54.119.207 | **cambiar** a `216.198.79.1` (valor de Vercel, 2026-11-03) |
| `CNAME` www | carlosconca.cl | **cambiar** a `f5014c9608ad74dd.vercel-dns-017.com.` (valor de Vercel, 2026-11-03) |
| `MX` ×3, `TXT` SPF, `default._domainkey` (DKIM), `_dmarc` | correo en Namecheap | **no tocar** |
| `A` mail, webmail, cpanel, whm, ftp, webdisk, cpcontacts, cpcalendars, autoconfig, autodiscover | 198.54.119.207 | **no tocar** (siguen sirviendo correo y paneles) |
| `SRV`/`TXT` _caldav(s), _carddav(s), _autodiscover | cPanel | **no tocar** |

No hay registros CAA: Vercel puede emitir el certificado sin cambios. El SPF usa `+a`: al mover el apex a Vercel
deja de cubrir la IP del hosting, pero `+mx`, las dos `ip4` y `include:spf.web-hosting.com` siguen autorizando el
correo saliente. Aun así, enviar un correo de prueba a una cuenta externa tras el cambio y revisar que no caiga en spam.

> ⚠ **No cancelar ni dejar vencer el hosting de Namecheap**: sirve el correo `@carlosconca.cl` y es el respaldo
> inmediato (WordPress) si hay que volver atrás. Avisar a Carlos y a quien paga la factura.

### Antes (días previos)
- [x] **Línea base del WP**: GA4, Search Console y Lighthouse móvil de las 12 URLs en `docs/baseline/` (2026-11-03). Falta solo, si se quiere, CrUX de campo (necesita clave de API).
- [x] Analítica: GA4 `G-XZS2V3VY1Z` instalado (solo en carlosconca.cl/www) y política de privacidad actualizada (2026-11-03).
- [ ] Contenido visible al público (no bloquea el cambio): correo/ORCID de Carlos, publicación 198, revisión del texto legal por el cliente, imagen OG.
- [x] Build de `main` en Ready (2026-11-03). [ ] Falta confirmar el CI de GitHub (incluye `pnpm lhci`, solo probado en local).
- [x] TTL del `A` apex y del `CNAME` www bajado de 14400 a **300 s** el 2026-11-03 (confirmado con `dig` en el servidor autoritativo). Esperar mínimo 4 h, idealmente 24 h, antes de cambiar los valores.
- [ ] Avisar a Carlos del plan y del riesgo del correo (ver arriba).

### Día D (lo ejecuta quien tenga acceso a Vercel y al cPanel de Carlos)
1. [x] Vercel → proyecto → Settings → Domains: `carlosconca.cl` y `www.carlosconca.cl` agregados el 2026-11-03. **El apex (`carlosconca.cl`) debe ser el dominio principal sin redirección, y `www` debe redirigir (308) al apex**: el canonical, el sitemap y lo indexado usan el apex. Vercel los dejó al revés por defecto; corregirlo antes del cambio.
2. [ ] cPanel → Zone Editor: editar solo el `A` apex y el `CNAME` www con esos valores.
3. [ ] Esperar propagación y certificado: `dig +short carlosconca.cl`, `curl -sI https://carlosconca.cl/`.
4. [ ] **Webhook de Sanity**: cambiar su URL a `https://carlosconca.cl/api/revalidate/` (sanity.io/manage → API → Webhooks, id `lzsRqApprGGahRy9`).
5. [ ] Verificación contra el dominio real (ver abajo).
6. [ ] Correo: enviar y recibir una prueba; `dig +short MX carlosconca.cl` sin cambios.
7. [ ] Search Console: reenviar `https://carlosconca.cl/sitemap.xml`; no hace falta "cambio de dirección" (mismo dominio). Los `wp-sitemap*.xml` darán 404.

### Verificación (copiar y pegar)
```bash
B=https://carlosconca.cl
for p in / /publicaciones/ /investigacion/ /docencia/ /biografia/ /contacto/ /privacidad/ /terminos/ \
         /en/ /en/publications/ /en/research/ /en/teaching/ /en/biography/ /en/contact/ /en/privacy/ /en/terms/ \
         /robots.txt /sitemap.xml /llms.txt; do printf "%s -> " $p; curl -s -o /dev/null -w "%{http_code}\n" $B$p; done
curl -sI $B/publicaciones | head -3          # 308 → con slash
curl -sI $B/en/inicio-english/ | head -3     # 301 → /en/
curl -sI $B/cv/ | head -3                    # 302 → CV en cdn.sanity.io
curl -s -o /dev/null -w "%{http_code}\n" $B/work/   # 404 a propósito
curl -sI https://www.carlosconca.cl/ | head -3       # redirige al apex
curl -s -X POST -o /dev/null -w "%{http_code}\n" $B/api/revalidate/   # 401
```
Además: cada `source` de `web/lib/redirects.ts` debe dar 301 al destino sin cadenas.

### Rollback
Devolver el `A` apex a `198.54.119.207` y el `CNAME` www a `carlosconca.cl` (con TTL en 300 s tarda minutos). El WordPress sigue intacto en el hosting. Restaurar la URL anterior del webhook si se quiere seguir probando en `carlosconcaweb.vercel.app`.

### Después (primeras semanas)
- [ ] Comparar Core Web Vitals de campo contra la línea base (objetivos en CLAUDE.md).
- [ ] Vigilar Search Console: cobertura, 404 nuevos, URLs indexadas de las 12 rutas.
- [ ] **Rotar el token de Sanity** ("Hyper Access") y usar uno mínimo (solo Editor) para el mantenimiento.
- [ ] Decidir cuándo apagar el WordPress (nunca el hosting si sigue sirviendo el correo).

## Redirects en el cutover

Tras cambiar el DNS, repetir `curl -sI` sobre cada `source` de `web/lib/redirects.ts` contra el dominio real (301 al destino, sin cadenas), `/cv/` (302 a cdn.sanity.io) y una URL demo (`/work/` → 404). Reenviar el sitemap nuevo en Search Console; los `wp-sitemap*.xml` darán 404.
