// Datos del negocio en un solo lugar. Lo marcado con [COMPLETAR] hay que reemplazarlo por el dato real.

const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5492617148842';

export const SITE = {
  name: 'Olivia – Pastelería y Café',
  shortName: 'Olivia',
  tagline: 'Momentos que saben bien',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  description:
    'Pastelería artesanal, café, meriendas libres, tardes de té y candy bar en el microcentro de Mendoza. Av. Godoy Cruz 506. Reservá tu mesa online.',
  address: {
    street: 'Av. Godoy Cruz 506',
    detail: 'esquina Chile',
    city: 'Mendoza',
    region: 'Mendoza',
    postalCode: 'M5500',
    country: 'AR',
  },
  phoneDisplay: '+54 261 714-8842',
  phoneTel: '+542617148842',
  whatsappNumber: wa,
  email: 'oliviapasteleriacafe@gmail.com',
  instagram: { handle: '@oliviapasteleriaycafe', url: 'https://www.instagram.com/oliviapasteleriaycafe/' },
  candyBar: { handle: '@oliviacandy.bar', url: 'https://www.instagram.com/oliviacandy.bar/' },
  facebook: 'https://www.facebook.com/Olivia.pasteleriacafe/',
  mapsEmbed: 'https://www.google.com/maps?q=Av.+Godoy+Cruz+506,+Mendoza,+Argentina&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Av.+Godoy+Cruz+506,+Mendoza,+Argentina',
  hours: {
    label: 'Lunes a sábado',
    ranges: ['9:00 a 13:00', '17:00 a 20:30'],
    closed: 'Domingos cerrado',
    // Para datos estructurados (schema.org)
    schema: [
      { opens: '09:00', closes: '13:00' },
      { opens: '17:00', closes: '20:30' },
    ],
  },
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true',
};

export const PLACEHOLDER = '[COMPLETAR]';

/**
 * Versión de las fotos de /public/img. Cuando reemplacen una foto por otra con el MISMO nombre de archivo,
 * subí este número: cambia la URL y se evita que Vercel / el navegador sigan mostrando la foto anterior en caché.
 */
export const IMG_VERSION = '5';
export const img = (path: string) => `${path}?v=${IMG_VERSION}`;

export function whatsappLink(text?: string, number: string = SITE.whatsappNumber) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Datos de contacto que se editan desde el panel (Admin → Contenido → Datos del local). */
export type ContactInfo = {
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  street: string;
  detail: string;
  city: string;
  hoursLabel: string;
  hoursRanges: string[];
  hoursClosed: string;
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl: string;
  candyHandle: string;
  candyUrl: string;
};

export const DEFAULT_CONTACT: ContactInfo = {
  phoneDisplay: SITE.phoneDisplay,
  whatsappNumber: SITE.whatsappNumber,
  email: SITE.email,
  street: SITE.address.street,
  detail: SITE.address.detail,
  city: SITE.address.city,
  hoursLabel: SITE.hours.label,
  hoursRanges: SITE.hours.ranges,
  hoursClosed: SITE.hours.closed,
  instagramHandle: SITE.instagram.handle,
  instagramUrl: SITE.instagram.url,
  facebookUrl: SITE.facebook,
  candyHandle: SITE.candyBar.handle,
  candyUrl: SITE.candyBar.url,
};

/** Link "tel:" a partir del teléfono que se muestra (deja solo el + y los números). */
export const telHref = (c: ContactInfo) => `tel:+${c.phoneDisplay.replace(/\D/g, '')}`;
const mapsQuery = (c: ContactInfo) => encodeURIComponent(`${c.street}, ${c.city}, Argentina`);
export const mapsLink = (c: ContactInfo) => `https://www.google.com/maps/search/?api=1&query=${mapsQuery(c)}`;
export const mapsEmbed = (c: ContactInfo) => `https://www.google.com/maps?q=${mapsQuery(c)}&output=embed`;

/** "9:00 a 13:00" → { opens: '09:00', closes: '13:00' } (para los datos estructurados de Google) */
export function hoursSchema(c: ContactInfo) {
  return c.hoursRanges.flatMap((r) => {
    const m = r.match(/(\d{1,2})[:.](\d{2})\D+(\d{1,2})[:.](\d{2})/);
    return m ? [{ opens: `${m[1].padStart(2, '0')}:${m[2]}`, closes: `${m[3].padStart(2, '0')}:${m[4]}` }] : [];
  });
}

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/menu', label: 'Menú' },
  { href: '/tardes-de-te', label: 'Tardes de Té' },
  { href: '/meriendas', label: 'Meriendas' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/contacto', label: 'Contacto' },
];

export const RESERVATION_TYPES = [
  { value: 'MESA', label: 'Mesa' },
  { value: 'MERIENDA', label: 'Merienda' },
  { value: 'TARDE_DE_TE', label: 'Tarde de té' },
  { value: 'EVENTO', label: 'Cumpleaños o evento' },
] as const;

export const TYPE_LABEL: Record<string, string> = Object.fromEntries(RESERVATION_TYPES.map((t) => [t.value, t.label]));

export const STATUS_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  ASISTIO: 'Asistió',
  NO_VINO: 'No vino',
};

export const STATUS_STYLE: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800 ring-amber-200',
  CONFIRMADA: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  CANCELADA: 'bg-stone-200 text-stone-600 ring-stone-300',
  ASISTIO: 'bg-sky-100 text-sky-800 ring-sky-200',
  NO_VINO: 'bg-rose-100 text-rose-800 ring-rose-200',
};
