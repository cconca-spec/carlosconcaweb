# Línea base del sitio WordPress (antes del cutover)

Extraída el 2026-11-02 de GA4 (propiedad `534300871`, ID `G-XZS2V3VY1Z`) y Search Console (`https://carlosconca.cl/`),
con acceso de solo lectura. Son datos agregados, sin información personal. Comparar contra esto tras el cambio de DNS.

| Archivo | Contenido |
|---|---|
| `ga4-*.csv` | GA4 desde 2025-01-01 (los datos reales empiezan en abril 2026): páginas, canales, páginas de entrada, mensual, dispositivos, países, idioma, descargas, eventos |
| `gsc-*.csv` | Search Console, 16 meses (2025-07-02 → 2026-11-01): consultas, páginas, países, dispositivos, serie diaria |

## Lo que dicen los datos
- **Volumen bajo**: 20–56 usuarios activos y 54–102 sesiones al mes en GA4 (abr–oct 2026). Search Console: 158 clics y 4.260 impresiones en 16 meses.
- **Es una búsqueda de marca**: "carlos conca" = 72 de los 158 clics, posición media 3,4. La home tiene 90 clics (CTR 7,6 %, posición 4,4).
- **Páginas con más clics**: `/` (90), `/biografia/` (19), `/docencia/` (18), `/en/inicio-english/` (13), `/investigacion/` (8).
- **Canales (GA4)**: búsqueda orgánica 257 sesiones, directo 164, referidos 47, social 12.
- **Idioma**: inglés 148 usuarios, español 113: el sitio en inglés pesa tanto como el español.
- **Dispositivo**: escritorio 205 usuarios, móvil 76 (GSC: móvil 36 % de las impresiones).
- **El CV en PDF** (`/wp-content/uploads/2026/03/cconca-ingles.pdf`) tiene 1.771 impresiones, 8 clics y 16 descargas: es la única descarga medida. Ya redirige 301 → `/cv/` (`web/lib/redirects.ts`).
- **`/en/inicio-english/`** (177 vistas, 597 impresiones, 13 clics) se conserva por 301 → `/en/`.
- **Search Console no tiene ningún sitemap enviado.** Tras el cutover, enviar `https://carlosconca.cl/sitemap.xml`.
- Las rutas `/cmd_sco`, `/config.inc.php`, `/journals` son escáneres: se ignoran.

## Rendimiento del WordPress (Lighthouse móvil, 2026-11-03)
`lighthouse-wordpress-movil.csv`: mediana de 3 corridas por URL, perfil móvil simulado (4G lento, CPU 4x), contra `https://carlosconca.cl`.
Es una medición de laboratorio con Lighthouse local (el PageSpeed de Google dio 429 sin clave de API); no hay datos de campo (CrUX).

| URL | WordPress | Sitio nuevo (Vercel) |
|---|---|---|
| `/` | LCP 10,1 s · perf 64 | LCP ≈ 3,0–3,4 s · perf 91 |
| `/publicaciones/` | LCP 6,8 s · CLS 0,22 · perf 58 | LCP ≈ 2,4–2,7 s · CLS 0 · perf 96–98 |
| `/investigacion/` | LCP 3,2 s · CLS 0,07 · perf 84 | LCP ≈ 2,7 s · CLS 0 · perf 96 |

Mediana de los LCP del WordPress en las 12 URLs: 4,9 s (rango 2,9–10,1 s); SEO 92 y accesibilidad 94–100 en todas.
En el sitio nuevo el LCP de la home es 2,2 s de *render delay* (la imagen del hero ya se precarga y pesa unos 73 KB en móvil): es CPU del móvil simulado, no
bytes. El objetivo de 1,2 s no es alcanzable en este perfil de laboratorio; conviene medirlo con datos de campo (CrUX/Search Console) a las semanas del cutover.

## Cómo compararlo después
Misma propiedad GA4 (el sitio nuevo usa el mismo ID, así la serie no se corta). A las 2, 4 y 8 semanas del cutover: usuarios y sesiones
mensuales, clics y posición de las 12 URLs en GSC, y la consulta "carlos conca". Una caída sostenida de clics en `/` o `/biografia/`
indicaría un problema de redirects, canonical o indexación.
