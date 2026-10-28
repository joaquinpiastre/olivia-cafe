# Olivia – Pastelería y Café

Sitio web + panel de administración (reservas, consultas de eventos y carta) para Olivia, Av. Godoy Cruz 506, Mendoza.

- **Frontend + backend:** Next.js 15 (App Router) + Tailwind CSS 3, deploy en **Vercel**
- **Base de datos:** PostgreSQL en **Railway**, con **Prisma**
- Las rutas de API y las server actions viven dentro de la misma app Next.js (no hay un servidor aparte)

## Estructura

```
prisma/              schema.prisma (modelo de datos) y seed.ts
public/img/          fotos del sitio (reemplazables, ver docs/IMAGENES.md)
public/carta/        las 4 páginas de la carta (imágenes iniciales)
src/app/(site)/      sitio público: inicio, nosotros, menu, tardes-de-te, meriendas, eventos, contacto, reservas
src/app/admin/       panel: login + (panel)/ dashboard, reservas, eventos, carta, configuración
src/app/api/         disponibilidad, reservas, eventos, carta (imagen y PDF), admin/export, admin/carta
src/components/      site/ (público), admin/ (panel), ui/
src/lib/             site.ts (datos del negocio), availability.ts, reservations.ts, auth.ts, whatsapp.ts…
```

Los datos del negocio (dirección, horarios, teléfono, redes) están en un solo archivo: [src/lib/site.ts](src/lib/site.ts).

## Correr en local

Requisitos: Node 20+ y una base PostgreSQL (puede ser la de Railway).

```bash
npm install
cp .env.example .env.local        # y completá las variables (ver abajo)
cp .env.local .env                # Prisma CLI lee .env
npx prisma db push                # crea las tablas
npm run db:seed                   # turnos, 4 páginas de carta y usuario admin
npm run dev                       # http://localhost:3000   ·   panel: /admin
```

> En Windows/PowerShell: `Copy-Item .env.example .env.local`.
> Si `npm run db:seed` no toma las variables, usá `npx tsx --env-file=.env.local prisma/seed.ts`.

## Variables de entorno

Documentadas en [.env.example](.env.example).

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL. En Vercel usá la URL **pública** de Railway (`DATABASE_PUBLIC_URL`) y agregale `?connection_limit=5` |
| `AUTH_SECRET` | Firma de la sesión del admin (cadena aleatoria larga) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (SEO, sitemap, Open Graph) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp en formato internacional sin `+` (ej. `5492617148842`) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` = el sitio pide a Google que no lo indexe. Pasalo a `true` cuando esté listo |
| `SEED_ADMIN_USER` / `SEED_ADMIN_PASSWORD` | Solo para `npm run db:seed` |

## Deploy

### 1. Base de datos en Railway
1. Railway → *New Project* → *Provision PostgreSQL*.
2. En el servicio Postgres → *Settings → Networking* → **TCP Proxy** al puerto `5432` (necesario para que Vercel llegue a la base).
3. Armá la URL: `postgresql://postgres:<PGPASSWORD>@<dominio-proxy>:<puerto-proxy>/railway?connection_limit=5`.
4. Desde tu máquina, con esa URL en `.env`: `npx prisma db push` y `npm run db:seed`.

### 2. App en Vercel
1. Vercel → *Add New Project* → importá el repositorio (o `npx vercel --prod` desde esta carpeta).
2. Cargá las variables de entorno de la tabla de arriba (sin las `SEED_*`).
3. Deploy. Al terminar, actualizá `NEXT_PUBLIC_SITE_URL` con la URL final (o tu dominio) y volvé a desplegar.
4. *Settings → Domains* para conectar el dominio propio. Para **oliviapasteleria.com.ar** ya está todo cargado en Vercel; los pasos de la delegación en NIC.ar están en [docs/DOMINIO.md](docs/DOMINIO.md).

`vercel.json` fija la región de las funciones en `sfo1` (cerca de la base en Railway US West).

## Cómo se usa el panel (`/admin`)

- **Panel:** reservas de hoy, próximos 7 días y contadores.
- **Reservas:** lista con filtros, vista calendario, cambio de estado con un toque, botón de WhatsApp con mensaje armado (confirmación / recordatorio / cancelación), carga manual y exportación a Excel/CSV.
- **Consultas de eventos:** las que llegan del formulario de *Eventos*.
- **Contenido y precios:** menús y precios de Tardes de Té, condiciones, beneficios y adicionales; aviso y apertura de Meriendas libres; combos y mesas de Candy Bar; teléfono, WhatsApp, dirección, horarios y redes. Se guardan en la tabla `SiteContent` y se ven al instante. Si una sección no se editó, la web usa los valores por defecto del código (`src/lib/tardes-de-te.ts`, `candy-bar.ts`, `site.ts`, `content-schemas.ts`).
- **Carta:** reemplazar la imagen de cada una de las 4 páginas (se actualiza al instante en la web) y editar su texto alternativo.
- **Configuración:** abrir/cerrar reservas, máximo de personas, anticipación, días de atención, turnos con su cupo, días bloqueados y cambio de contraseña.

## Reglas de las reservas

- Solo se puede reservar en los días configurados (lunes a sábado), sin días bloqueados ni fechas pasadas.
- Cada turno tiene un cupo de personas. Las reservas **Pendiente**, **Confirmada** y **Asistió** descuentan cupo; **Cancelada** y **No vino** lo liberan.
- *Merienda* y *Tarde de té* solo se ofrecen en turnos desde las 15:00 (constante `AFTERNOON_FROM` en `src/lib/availability.ts`).
- Las reservas manuales del admin no aplican las reglas de cupo/anticipación.
- Fechas y horas se manejan en hora de Mendoza (`America/Argentina/Mendoza`).

## Imágenes de la carta

Las imágenes iniciales están en `public/carta/` (`carta-sin-tacc.jpg`, `carta-dulces-y-salados.jpg`, `carta-bebidas.jpg`, `carta-promos.jpg`). Al subir una nueva desde el panel se guarda en la base de datos (optimizada, JPG, lado mayor ≤ 3200 px) y tiene prioridad sobre el archivo de `public/`. "Restaurar original" vuelve al archivo de `public/`.

## Comandos

```bash
npm run dev         # desarrollo
npm run build       # build de producción (incluye prisma generate)
npm run start       # servir el build
npm run db:push     # sincronizar el esquema con la base
npm run db:seed     # datos iniciales + usuario admin
```
