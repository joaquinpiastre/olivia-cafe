// Descripción de lo que se puede editar desde el panel (Admin → Contenido).
// Un mismo esquema arma el formulario del panel y limpia/valida lo que se guarda. Sin dependencias de servidor.

import { DEFAULT_CANDY, type CandyContent } from './candy-bar';
import { DEFAULT_CONTACT, type ContactInfo } from './site';
import { DEFAULT_TEA, type TeaContent } from './tardes-de-te';

export type Field =
  | { type: 'text' | 'textarea' | 'lines'; key: string; label: string; help?: string; placeholder?: string; max?: number; rows?: number }
  | { type: 'number'; key: string; label: string; help?: string; min?: number; max?: number; money?: boolean; suffix?: string }
  | { type: 'bool'; key: string; label: string; help?: string }
  | { type: 'hidden'; key: string }
  | { type: 'list'; key: string; label: string; help?: string; itemTitle: string; addLabel: string; fields: Field[]; max?: number }
  | { type: 'heading'; label: string; help?: string };

export type MeriendasContent = {
  reservable: boolean;
  notice: string;
  intro: string;
  paragraph: string;
};

export const DEFAULT_MERIENDAS: MeriendasContent = {
  reservable: false,
  notice: 'Pronto anunciamos una nueva fecha de merienda libre. Escribinos por WhatsApp y te avisamos apenas la tengamos.',
  intro: 'Nuestras meriendas libres son perfectas para ir en pareja, con amigas o en familia y quedarse a charlar.',
  paragraph: 'Café, pastelería artesanal y opciones dulces y saladas para armar la merienda a tu gusto. Un plan que nunca falla en pleno centro de Mendoza.',
};

export type ContentMap = {
  contacto: ContactInfo;
  'tardes-de-te': TeaContent;
  meriendas: MeriendasContent;
  'candy-bar': CandyContent;
};
export type ContentKey = keyof ContentMap;

const priceHelp = 'En pesos, solo números (ej. 20900).';

const SCHEMAS: { [K in ContentKey]: Field[] } = {
  contacto: [
    { type: 'heading', label: 'Contacto', help: 'Se muestra en el inicio, contacto, pie de página y botón flotante de WhatsApp.' },
    { type: 'text', key: 'phoneDisplay', label: 'Teléfono (como se ve en la web)', placeholder: '+54 261 714-8842', max: 40 },
    { type: 'text', key: 'whatsappNumber', label: 'WhatsApp (solo números, con código de país)', help: 'Ej. 5492617148842 (54 + 9 + código de área sin 0 + número sin 15).', max: 20 },
    { type: 'text', key: 'email', label: 'Email', max: 120 },
    { type: 'heading', label: 'Dirección' },
    { type: 'text', key: 'street', label: 'Calle y número', placeholder: 'Av. Godoy Cruz 506', max: 120 },
    { type: 'text', key: 'detail', label: 'Referencia', placeholder: 'esquina Chile', max: 120 },
    { type: 'text', key: 'city', label: 'Ciudad', max: 80 },
    { type: 'heading', label: 'Horarios de atención' },
    { type: 'text', key: 'hoursLabel', label: 'Días', placeholder: 'Lunes a sábado', max: 80 },
    { type: 'lines', key: 'hoursRanges', label: 'Franjas horarias (una por línea)', help: 'Formato "9:00 a 13:00". Google las usa para mostrar tus horarios.', rows: 3 },
    { type: 'text', key: 'hoursClosed', label: 'Cuando está cerrado', placeholder: 'Domingos cerrado', max: 80 },
    { type: 'heading', label: 'Redes' },
    { type: 'text', key: 'instagramHandle', label: 'Instagram (nombre)', placeholder: '@oliviapasteleriaycafe', max: 60 },
    { type: 'text', key: 'instagramUrl', label: 'Instagram (link)', max: 200 },
    { type: 'text', key: 'facebookUrl', label: 'Facebook (link)', max: 200 },
    { type: 'text', key: 'candyHandle', label: 'Instagram de Candy Bar (nombre)', placeholder: '@oliviacandy.bar', max: 60 },
    { type: 'text', key: 'candyUrl', label: 'Instagram de Candy Bar (link)', max: 200 },
  ],

  'tardes-de-te': [
    { type: 'heading', label: 'Reglas generales', help: 'Se usan en la página, en el formulario de reservas y para validar la cantidad de personas.' },
    { type: 'number', key: 'minGuests', label: 'Mínimo de personas', min: 1, max: 200 },
    { type: 'number', key: 'depositPct', label: 'Seña', min: 0, max: 100, suffix: '%' },
    { type: 'text', key: 'schedule', label: 'Horario', placeholder: '16:30 a 20:30', max: 40 },
    { type: 'heading', label: 'Textos de la página' },
    { type: 'textarea', key: 'intro', label: 'Presentación', rows: 3, max: 400 },
    { type: 'text', key: 'quote', label: 'Frase destacada', max: 160 },
    {
      type: 'list',
      key: 'menus',
      label: 'Menús',
      help: 'Cada menú tiene su precio por persona. Con "Mostrar en la web" desmarcado se oculta sin borrarlo.',
      itemTitle: 'name',
      addLabel: 'Agregar menú',
      max: 12,
      fields: [
        { type: 'hidden', key: 'id' },
        { type: 'text', key: 'name', label: 'Nombre del menú', max: 80 },
        { type: 'text', key: 'tagline', label: 'Aclaración (opcional)', placeholder: 'Para chicos y adolescentes', max: 80 },
        { type: 'number', key: 'price', label: 'Precio por persona', help: priceHelp, min: 0, max: 100000000, money: true },
        { type: 'bool', key: 'visible', label: 'Mostrar en la web' },
        { type: 'text', key: 'infusion', label: 'Infusión (primer paso)', max: 200 },
        { type: 'lines', key: 'pastry', label: 'Degustación de pastelería (una por línea)', rows: 5 },
        { type: 'text', key: 'savoryTitle', label: 'Título de los salados', placeholder: 'Degustación de sándwiches', max: 80 },
        { type: 'lines', key: 'savory', label: 'Salados (uno por línea)', rows: 4 },
        { type: 'text', key: 'secondStep', label: 'Segundo paso', max: 200 },
      ],
    },
    {
      type: 'lines',
      key: 'rules',
      label: 'Cómo reservar (una condición por línea)',
      help: 'Podés escribir {minimo}, {sena} y {horario}: se reemplazan solos por los valores de arriba.',
      rows: 10,
    },
    { type: 'textarea', key: 'rulesFootnote', label: 'Nota al pie de las condiciones', rows: 2, max: 300 },
    { type: 'heading', label: 'Beneficios de cumpleaños' },
    { type: 'text', key: 'benefitsIntro', label: 'Texto de presentación', max: 200 },
    {
      type: 'list',
      key: 'benefits',
      label: 'Beneficios',
      itemTitle: 'guests',
      addLabel: 'Agregar beneficio',
      max: 10,
      fields: [
        { type: 'text', key: 'guests', label: 'Cantidad de invitados', placeholder: '10 a 15 invitados', max: 60 },
        { type: 'textarea', key: 'perk', label: 'Beneficio', rows: 2, max: 200 },
      ],
    },
    { type: 'heading', label: 'Adicionales' },
    { type: 'textarea', key: 'addonsIntro', label: 'Texto de presentación', rows: 3, max: 400 },
    {
      type: 'list',
      key: 'addons',
      label: 'Adicionales',
      itemTitle: 'name',
      addLabel: 'Agregar adicional',
      max: 10,
      fields: [
        { type: 'text', key: 'name', label: 'Nombre', max: 80 },
        { type: 'number', key: 'price', label: 'Precio', help: priceHelp, min: 0, max: 100000000, money: true },
        { type: 'lines', key: 'items', label: 'Qué incluye (uno por línea)', rows: 6 },
      ],
    },
  ],

  meriendas: [
    { type: 'bool', key: 'reservable', label: 'Se puede reservar merienda libre', help: 'Desmarcado: se oculta el botón de reservar y la opción "Merienda" del formulario, y se muestra el aviso de abajo.' },
    { type: 'textarea', key: 'notice', label: 'Aviso destacado', help: 'Ej. "Pronto anunciamos una nueva fecha…" o la fecha de la próxima merienda. Vacío = no se muestra.', rows: 3, max: 400 },
    { type: 'textarea', key: 'intro', label: 'Presentación (arriba, sobre la foto)', rows: 3, max: 300 },
    { type: 'textarea', key: 'paragraph', label: 'Descripción', rows: 4, max: 600 },
  ],

  'candy-bar': [
    {
      type: 'list',
      key: 'combos',
      label: 'Combos de candy bar',
      itemTitle: 'name',
      addLabel: 'Agregar combo',
      max: 12,
      fields: [
        { type: 'hidden', key: 'id' },
        { type: 'hidden', key: 'photo' },
        { type: 'hidden', key: 'photoAlt' },
        { type: 'text', key: 'name', label: 'Nombre', max: 80 },
        { type: 'number', key: 'price', label: 'Precio', help: priceHelp, min: 0, max: 1000000000, money: true },
        { type: 'text', key: 'tagline', label: 'Frase (opcional)', max: 160 },
        { type: 'text', key: 'badge', label: 'Etiqueta sobre la foto (opcional)', placeholder: 'El más elegido', max: 40 },
        { type: 'lines', key: 'includes', label: 'Qué incluye (uno por línea)', rows: 8 },
        { type: 'number', key: 'setupMinutes', label: 'Tiempo de armado', min: 0, max: 600, suffix: 'minutos' },
        { type: 'text', key: 'space', label: 'Espacio necesario', placeholder: '2 m × 2 m', max: 40 },
      ],
    },
    { type: 'text', key: 'comboNote', label: 'Nota debajo de los combos', max: 300 },
    {
      type: 'list',
      key: 'salty',
      label: 'Mesas saladas',
      itemTitle: 'guests',
      addLabel: 'Agregar mesa salada',
      max: 10,
      fields: [
        { type: 'text', key: 'guests', label: 'Para cuántas personas', placeholder: '25 a 30 personas', max: 60 },
        { type: 'number', key: 'price', label: 'Precio', help: priceHelp, min: 0, max: 1000000000, money: true },
        { type: 'lines', key: 'items', label: 'Qué incluye (uno por línea)', rows: 8 },
      ],
    },
    {
      type: 'list',
      key: 'sweet',
      label: 'Mesas dulces',
      itemTitle: 'guests',
      addLabel: 'Agregar mesa dulce',
      max: 10,
      fields: [
        { type: 'text', key: 'guests', label: 'Para cuántas personas', placeholder: '25 a 30 personas', max: 60 },
        { type: 'number', key: 'price', label: 'Precio', help: priceHelp, min: 0, max: 1000000000, money: true },
        { type: 'lines', key: 'items', label: 'Qué incluye (uno por línea)', rows: 8 },
      ],
    },
    { type: 'text', key: 'sweetNote', label: 'Nota de las mesas dulces', max: 200 },
    { type: 'lines', key: 'tableIncludes', label: 'Todas las mesas incluyen (una por línea)', rows: 5 },
    { type: 'lines', key: 'comboTerms', label: 'Condiciones de los combos (una por línea)', rows: 8 },
    { type: 'lines', key: 'tableTerms', label: 'Condiciones de las mesas (una por línea)', rows: 8 },
    { type: 'textarea', key: 'important', label: 'Aviso final', rows: 3, max: 500 },
  ],
};

export const DEFAULTS: ContentMap = {
  contacto: DEFAULT_CONTACT,
  'tardes-de-te': DEFAULT_TEA,
  meriendas: DEFAULT_MERIENDAS,
  'candy-bar': DEFAULT_CANDY,
};

export const SECTIONS: { key: ContentKey; title: string; description: string; page: string }[] = [
  { key: 'tardes-de-te', title: 'Tardes de Té', description: 'Menús, precios, seña, mínimo de personas, condiciones, beneficios y adicionales.', page: '/tardes-de-te' },
  { key: 'meriendas', title: 'Meriendas libres', description: 'Avisar la próxima fecha y abrir o cerrar las reservas de merienda.', page: '/meriendas' },
  { key: 'candy-bar', title: 'Candy Bar y mesas', description: 'Combos, mesas saladas y dulces, precios y condiciones.', page: '/eventos#candy-bar' },
  { key: 'contacto', title: 'Datos del local', description: 'Teléfono, WhatsApp, email, dirección, horarios y redes.', page: '/contacto' },
];

export const getSchema = (key: ContentKey) => SCHEMAS[key];
export const isContentKey = (k: string): k is ContentKey => k in SCHEMAS;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Valor vacío de un campo (para armar un ítem nuevo en una lista). */
export function emptyValue(f: Field): unknown {
  switch (f.type) {
    case 'number': return f.min ?? 0;
    case 'bool': return true;
    case 'lines': case 'list': return [];
    case 'heading': return undefined;
    default: return '';
  }
}

export function emptyItem(fields: Field[]): Obj {
  const item: Obj = { id: `n${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}` };
  for (const f of fields) if (f.type !== 'heading') item[f.key] = emptyValue(f);
  return item;
}

/**
 * Deja un valor con la forma exacta del esquema: tipos correctos, textos recortados, números dentro de rango.
 * Lo que falta se completa con `defaults`; lo desconocido se descarta.
 */
export function sanitize(fields: Field[], input: unknown, defaults: Obj = {}): Obj {
  const src = isObj(input) ? input : {};
  const out: Obj = {};
  for (const f of fields) {
    if (f.type === 'heading') continue;
    const has = f.key in src;
    const v = has ? src[f.key] : defaults[f.key];
    switch (f.type) {
      case 'text':
      case 'textarea':
        out[f.key] = typeof v === 'string' || typeof v === 'number' ? String(v).trim().slice(0, f.max ?? (f.type === 'text' ? 300 : 1500)) : '';
        break;
      case 'hidden':
        out[f.key] = typeof v === 'string' ? v.slice(0, 300) : '';
        break;
      case 'number': {
        const n = Math.round(Number(v));
        out[f.key] = Number.isFinite(n) ? Math.min(f.max ?? 1e9, Math.max(f.min ?? 0, n)) : (f.min ?? 0);
        break;
      }
      case 'bool':
        out[f.key] = typeof v === 'boolean' ? v : Boolean(defaults[f.key]);
        break;
      case 'lines': {
        const arr = Array.isArray(v) ? v : typeof v === 'string' ? v.split('\n') : [];
        out[f.key] = arr.filter((x): x is string => typeof x === 'string').map((x) => x.trim().slice(0, 500)).filter(Boolean).slice(0, 80);
        break;
      }
      case 'list': {
        const arr = Array.isArray(v) ? v : [];
        const defItems = Array.isArray(defaults[f.key]) ? (defaults[f.key] as Obj[]) : [];
        out[f.key] = arr
          .filter(isObj)
          .slice(0, f.max ?? 40)
          .map((item, i) => {
            const clean = sanitize(f.fields, item, has ? {} : (defItems[i] ?? {}));
            // Los ítems nuevos reciben un identificador propio
            if (f.fields.some((x) => x.type === 'hidden' && x.key === 'id') && !clean.id) clean.id = `n${Date.now().toString(36)}${i}`;
            return clean;
          });
        break;
      }
    }
  }
  return out;
}
