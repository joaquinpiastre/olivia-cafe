# Pendientes por completar ([COMPLETAR] y datos a verificar)

## Textos con `[COMPLETAR]` (se ven en la web)
Por ahora no queda ninguno. (Menús, precios, condiciones, contacto y horarios se editan desde Admin → Contenido y precios.)

## Datos encontrados pero a verificar (`src/lib/site.ts`)
- **WhatsApp / teléfono** (se cambia en Admin → Contenido → Datos del local): `+54 261 714-8842` (figura en el Facebook del local). No se pudo confirmar que sea WhatsApp. Se cambia con `NEXT_PUBLIC_WHATSAPP_NUMBER` y en `phoneDisplay` / `phoneTel`.
- **Email:** `oliviapasteleriacafe@gmail.com` (Facebook del local).
- **Facebook:** https://www.facebook.com/Olivia.pasteleriacafe/
- **Instagram de eventos:** `@oliviacandy.bar`.
- **Google Maps:** el mapa se arma por dirección; si tienen el link oficial de la ficha de Google, reemplazar `mapsEmbed` / `mapsLink`.
- **Horarios:** se usaron los provistos (lun–sáb 9–13 y 17–20:30). El Facebook indica 9–12:30 y 17–21: confirmar cuál es el vigente.

## Contenido a reemplazar
- Fotos de stock → ver `docs/IMAGENES.md`.
- Carta (4 imágenes de ejemplo) → subir las reales desde el panel.
- Foto de Axel y Samira para *Nosotros*.

## Otros
- `NEXT_PUBLIC_SITE_URL` con el dominio definitivo.
- `NEXT_PUBLIC_ALLOW_INDEXING=true` cuando el sitio esté listo para Google.
- Cambiar la contraseña del admin (Admin → Configuración → Cambiar contraseña).
