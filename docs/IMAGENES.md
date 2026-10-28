# Imágenes del sitio

Las fotos de `public/img/` son **fotos reales de Olivia** (fachada, meriendas, cafés y candy bars). Las originales, sin tocar, están en `assets-originales/fotos-reales/`; las de `public/img/` son copias optimizadas (máx. 1400 px de ancho, JPG).

## Cómo reemplazar una foto
1. Guardá la nueva en `public/img/` **con el mismo nombre de archivo** (JPG, vertical, idealmente 1400 px de ancho).
2. Subí el número de `IMG_VERSION` en `src/lib/site.ts` (por ejemplo de `'2'` a `'3'`). Así Vercel y el navegador no siguen mostrando la foto anterior desde la caché.
3. Actualizá el texto alternativo (alt) de esa foto en el archivo de la página (`src/app/(site)/...`).
4. Volvé a desplegar (`vercel --prod`).

## Qué foto va en cada lugar

| Archivo | Dónde aparece | Foto original usada |
|---|---|---|
| `hero-1.jpg` | Inicio → slider principal (foto 1: fachada) | `WhatsApp Image 2026-10-25 at 14.24.55.jpeg` |
| `hero-2.jpg` | Inicio → slider principal (foto 2) | `WhatsApp Image 2026-10-25 at 14.23.56 (22).jpeg` |
| `hero-3.jpg` | Inicio → slider principal (foto 3) | `WhatsApp Image 2026-10-25 at 14.23.56 (18).jpeg` |
| `card-menu.jpg` | Inicio → card "Menú" | `WhatsApp Image 2026-10-25 at 14.23.56 (25).jpeg` |
| `card-tardes-de-te.jpg` | Inicio → card "Tardes de Té" · Tardes de Té → portada | `WhatsApp Image 2026-10-25 at 14.23.56 (23).jpeg` |
| `card-meriendas.jpg` | Inicio → card "Meriendas libres" · Meriendas → portada | `WhatsApp Image 2026-10-25 at 14.28.58.jpeg` |
| `card-eventos.jpg` | Inicio → card "Eventos y candy bar" · Eventos → portada | `WhatsApp Image 2026-10-27 at 22.22.38 (1).jpeg` |
| `esencia-local.jpg` | Inicio → "Nuestra esencia" | `WhatsApp Image 2026-10-25 at 14.26.51 (1).jpeg` |
| `nosotros-historia.jpg` | Nosotros → historia | `WhatsApp Image 2026-10-25 at 14.23.56 (21).jpeg` |
| `nosotros-local.jpg` | Nosotros → "Te esperamos en Olivia" (fachada) | `WhatsApp Image 2026-10-25 at 14.24.55.jpeg` |
| `menu-header.jpg` | (disponible, sin uso actual) | `WhatsApp Image 2026-10-25 at 14.23.56 (20).jpeg` |
| `meriendas-1.jpg` | Meriendas → galería (foto 1) | `WhatsApp Image 2026-10-25 at 14.28.58 (2).jpeg` |
| `meriendas-2.jpg` | Meriendas → galería (foto 2) | `WhatsApp Image 2026-10-25 at 14.28.58.jpeg` |
| `meriendas-3.jpg` | Meriendas → galería (foto 3) | `WhatsApp Image 2026-10-25 at 14.28.58 (3).jpeg` |
| `meriendas-4.jpg` | Meriendas → galería (foto 4) | `WhatsApp Image 2026-10-25 at 14.28.58 (1).jpeg` |
| `meriendas-5.jpg` | Meriendas → galería (foto 5) | `WhatsApp Image 2026-10-25 at 14.28.58 (4).jpeg` |
| `meriendas-6.jpg` | Meriendas → galería (foto 6) | `WhatsApp Image 2026-10-25 at 14.53.10 (1).jpeg` |
| `meriendas-7.jpg` | Meriendas → galería (foto 7) | `WhatsApp Image 2026-10-25 at 14.53.10.jpeg` |
| `meriendas-8.jpg` | Meriendas → galería (foto 8) | `WhatsApp Image 2026-10-25 at 14.53.10 (2).jpeg` |
| `meriendas-9.jpg` | Meriendas → galería (foto 9) | `WhatsApp Image 2026-10-25 at 14.53.09.jpeg` |
| `tardes-te-1.jpg` | Tardes de Té → galería (foto 1) | `WhatsApp Image 2026-10-27 at 22.06.07.jpeg` |
| `tardes-te-2.jpg` | Tardes de Té → galería (foto 2) | `WhatsApp Image 2026-10-27 at 22.06.07 (2).jpeg` |
| `tardes-te-3.jpg` | Tardes de Té → galería (foto 3) | `WhatsApp Image 2026-10-27 at 22.06.07 (1).jpeg` |
| `tardes-te-4.jpg` | Tardes de Té → galería (foto 4) | `WhatsApp Image 2026-10-27 at 22.06.07 (3).jpeg` |
| `tardes-te-5.jpg` | Tardes de Té → galería (foto 5) | `WhatsApp Image 2026-10-27 at 22.06.08.jpeg` |
| `eventos-1.jpg` | Eventos → galería | `WhatsApp Image 2026-10-25 at 14.26.50 (1).jpeg` |
| `eventos-2.jpg` | Eventos → galería | `WhatsApp Image 2026-10-25 at 14.26.50.jpeg` |
| `eventos-3.jpg` | Eventos → galería | `WhatsApp Image 2026-10-25 at 14.26.51 (1).jpeg` |
| `eventos-4.jpg` | Eventos → galería | `WhatsApp Image 2026-10-25 at 14.23.56 (9).jpeg` |
| `reservas-header.jpg` | Reservas → portada | `WhatsApp Image 2026-10-25 at 14.23.56 (18).jpeg` |
| `candy/combo-mini.jpg`, `combo-classic.jpg`, `combo-gold.jpg` | Eventos → combos de Candy Bar (fotos del catálogo) | `assets-originales/catalogo-candy-bar/Candy Bar olivia.pdf` |
| `og.jpg` | Imagen al compartir el sitio en redes | (diseño con el logo) |

`meriendas-1.jpg` a `meriendas-5.jpg` y `card-meriendas.jpg` son tablas de tarde de té: ya no se usan en Meriendas libres (queda disponible para Tardes de Té). La portada de Meriendas y la card del inicio usan `meriendas-7.jpg`.

Hay varias fotos repetidas entre páginas distintas porque tenemos pocas de meriendas; cuando tengan más, se reemplazan por separado. En `assets-originales/fotos-reales/` quedaron además muchas fotos de mesas saladas (tablas de fiambres, medialunas rellenas, tostadas) sin usar todavía.

## Marca (logos e ilustraciones)

Generados a partir del PDF de logos (`assets-originales/logos-marca.pdf`), todos con **fondo transparente**:

| Archivo | Dónde se usa |
|---|---|
| `public/img/marca/logo-olivia.png` | Logo horizontal: header, footer, login y panel de administración, datos estructurados |
| `public/img/marca/taza.png` | Ilustración de la taza (disponible para usar) |
| `public/img/marca/nos-vemos-en-olivia.png` | Página de confirmación de reserva |
| `public/img/marca/flores-superior.png`, `flores-inferior.png` | Guardas florales de la página de confirmación |
| `public/img/og.jpg` | Imagen al compartir el sitio en WhatsApp / redes (1200 × 630) |
| `src/app/icon.png`, `src/app/favicon.ico`, `src/app/apple-icon.png` | Ícono de la pestaña, favicon clásico e ícono para iPhone (taza blanca sobre verde salvia) |
| `public/img/marca/favicon-1024.png` | Ícono en alta resolución (por si lo necesitan para redes) |

Colores de la marca (tomados del logo): verde **#C4D49C** y beige **#CCBC94**.

Si cambian el logo, guardá el nuevo con **otro nombre de archivo** (por ejemplo `logo-olivia-2.png`) y actualizá `src/components/site/Logo.tsx`; así se evita que el navegador o Vercel sigan mostrando la versión vieja en caché.

## Carta

`public/carta/carta-sin-tacc.jpg`, `carta-dulces-y-salados.jpg`, `carta-bebidas.jpg` y `carta-promos.jpg` son las cartas reales (905 × 1280 px). Los archivos originales quedaron en `assets-originales/carta/`. Cuando cambien los precios, subí las nuevas desde el panel: **Admin → Carta → Reemplazar imagen**. Conviene exportarlas con más resolución (por ejemplo 1810 × 2560 px) para que se lean mejor al hacer zoom.
