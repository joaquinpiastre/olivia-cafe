import { unstable_cache } from 'next/cache';
import { db } from './db';
import { DEFAULTS, getSchema, sanitize, type ContentKey, type ContentMap } from './content-schemas';

export const CONTENT_TAG = 'site-content';

// Se lee toda la tabla de una vez y se guarda en caché hasta que alguien guarda desde el panel (revalidateTag).
// Si la base falla, la función lanza (así el error no queda cacheado) y getContent usa los valores por defecto.
const loadAll = unstable_cache(
  async () => {
    const rows = await db.siteContent.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.data])) as Record<string, unknown>;
  },
  ['site-content-all'],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

/** Contenido editable de una sección: lo guardado desde el panel, o los valores por defecto del código. */
export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const defaults = DEFAULTS[key];
  try {
    const all = await loadAll();
    if (!(key in all)) return defaults;
    return sanitize(getSchema(key), all[key], defaults as unknown as Record<string, unknown>) as unknown as ContentMap[K];
  } catch (e) {
    console.error('getContent', key, e);
    return defaults;
  }
}
