import { db } from './db';
import { getSettings } from './availability';

export type MenuPageView = {
  slug: string;
  title: string;
  alt: string;
  /** URL de la imagen; vacía si la página todavía no tiene imagen */
  src: string;
  downloadHref: string;
  version: number;
  /** true si la imagen se subió desde el panel (false = imagen original de /public/carta) */
  custom: boolean;
  visible: boolean;
};

/** Las 4 páginas originales: tienen una imagen de respaldo en /public/carta/<slug>.jpg */
export const MENU_DEFAULTS = [
  { slug: 'carta-promos', title: 'Promos', alt: 'Promos y meriendas de Olivia Pastelería y Café con precios' },
  { slug: 'carta-dulces-y-salados', title: 'Dulces y salados', alt: 'Carta de Olivia Pastelería y Café: opciones dulces y saladas con precios' },
  { slug: 'carta-bebidas', title: 'Bebidas', alt: 'Carta de bebidas de Olivia Pastelería y Café: cafés, jugos, limonadas, batidos y más, con precios' },
  { slug: 'carta-sin-tacc', title: 'Sin TACC', alt: 'Carta de opciones Sin TACC de Olivia Pastelería y Café con precios' },
];

const DEFAULT_SLUGS = new Set(MENU_DEFAULTS.map((m) => m.slug));
export const isDefaultMenuSlug = (slug: string) => DEFAULT_SLUGS.has(slug);

function toView(p: { slug: string; title: string; alt: string; hasImage: boolean; version: number; visible: boolean }): MenuPageView {
  const fallback = DEFAULT_SLUGS.has(p.slug) ? `/carta/${p.slug}.jpg` : '';
  const src = p.hasImage ? `/api/carta/${p.slug}?v=${p.version}` : fallback;
  return {
    slug: p.slug,
    title: p.title,
    alt: p.alt,
    src,
    downloadHref: p.hasImage ? `${src}&download=1` : src,
    version: p.version,
    custom: p.hasImage,
    visible: p.visible,
  };
}

/** Todas las páginas en el orden del panel (incluye las ocultas y las que no tienen imagen). */
export async function getAllMenuPages(): Promise<MenuPageView[]> {
  try {
    const rows = await db.menuPage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      select: { slug: true, title: true, alt: true, hasImage: true, version: true, visible: true },
    });
    if (rows.length === 0) return MENU_DEFAULTS.map((d) => toView({ ...d, hasImage: false, version: 0, visible: true }));
    return rows.map(toView);
  } catch {
    return MENU_DEFAULTS.map((d) => toView({ ...d, hasImage: false, version: 0, visible: true }));
  }
}

/** Páginas que se muestran en la web: visibles y con imagen. */
export async function getMenuPages(): Promise<MenuPageView[]> {
  return (await getAllMenuPages()).filter((p) => p.visible && p.src);
}

export const MENU_TEXT_DEFAULTS = {
  menuEyebrow: 'Nuestra carta',
  menuTitle: 'Algo rico para',
  menuScript: 'cada antojo',
  menuDescription: 'Dulces, salados, bebidas, promos y opciones Sin TACC. Tocá la carta para ampliarla y leer todos los precios.',
  menuNote: 'Los precios pueden variar. Consultá por WhatsApp ante cualquier duda.',
};

export async function getMenuTexts() {
  try {
    const s = await getSettings();
    return {
      menuEyebrow: s.menuEyebrow,
      menuTitle: s.menuTitle,
      menuScript: s.menuScript,
      menuDescription: s.menuDescription,
      menuNote: s.menuNote,
    };
  } catch {
    return MENU_TEXT_DEFAULTS;
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
