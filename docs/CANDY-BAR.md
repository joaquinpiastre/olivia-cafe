# Candy Bar: combos y precios

Se muestran en la página **Eventos** (`/eventos#candy-bar`), tomados del catálogo `assets-originales/catalogo-candy-bar/Candy Bar olivia.pdf`.

## Cómo cambiar un precio o lo que incluye un combo
Todo está en **`src/lib/candy-bar.ts`**:
- `CANDY_COMBOS`: los 3 combos (Mini, Classic, Gold) con precio, qué incluye, tiempo de armado, espacio y foto.
- `SALTY_TABLES` y `SWEET_TABLES`: mesas saladas y dulces (25-30, 45-50 y 80-85 personas).
- `COMBO_TERMS`, `TABLE_INCLUDES`, `TABLE_TERMS`: condiciones y seña.

Se edita el valor y se vuelve a publicar (`vercel --prod`). Los precios se muestran con formato `$350.000` automáticamente.

## Qué quedó afuera del catálogo (por ahora)
Pastelería y golosinas personalizadas por unidad (cookies, cupcakes, tortas por kilo, shots, petit four, golosinas, papelería y deco), tortas personalizadas (sabores y rellenos) y postres clásicos de 18 cm. Si quieren, se agregan como otra sección.

## Fotos
`public/img/candy/combo-*.jpg` (extraídas del catálogo). Para cambiarlas, guardá la nueva con el mismo nombre, subí `IMG_VERSION` en `src/lib/site.ts` y volvé a publicar.

## Consultas
Cada botón "Consultar este combo / esta mesa" abre el formulario de `/eventos` ya completado con el combo elegido (`/eventos?consulta=classic#consulta`). Las consultas llegan al panel en **Admin → Consultas de eventos**.
