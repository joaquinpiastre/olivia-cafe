// Combos y precios de Olivia Candy Bar (catálogo "Candy Bar olivia.pdf").
// Estos son los valores por DEFECTO. Lo que se ve en la web se edita desde el panel (Admin → Contenido → Candy Bar).

export type CandyCombo = {
  id: string;
  name: string;
  /** Valor total del combo en pesos */
  price: number;
  tagline?: string;
  /** Etiqueta destacada sobre la foto */
  badge?: string;
  includes: string[];
  setupMinutes: number;
  space: string;
  photo: string;
  photoAlt: string;
};

export const CANDY_COMBOS: CandyCombo[] = [
  {
    id: 'mini',
    name: 'Candy Olivia Mini',
    price: 350000,
    tagline: 'Ideal para eventos íntimos y pequeños festejos',
    includes: ['2 paneles', 'Medio arco de globos', '2 mesas', 'Nombre', 'Imágenes temáticas', 'Atril de bienvenida', 'Posatorta', 'Torta de 20 porciones', '5 galletas', '5 oreos', '5 paletas'],
    setupMinutes: 35,
    space: '2 m × 2 m',
    photo: '/img/candy/combo-mini.jpg',
    photoAlt: 'Candy bar Olivia Mini con arco de globos rosas y blancos, panel con número 1 y una torta sobre posatortas',
  },
  {
    id: 'classic',
    name: 'Candy Olivia Classic',
    price: 495000,
    tagline: 'Nuestro formato más elegido',
    badge: 'El más elegido',
    includes: ['4 paneles', 'Medio arco de globos', '4 mesas', 'Nombre y número', 'Bandejas y posatorta', 'Imágenes temáticas', 'Atril de bienvenida', 'Torta de 30 porciones', '5 cupcakes', '5 galletas', '5 paletas', '5 titas', '5 yapas'],
    setupMinutes: 60,
    space: '3 m × 3 m',
    photo: '/img/candy/combo-classic.jpg',
    photoAlt: 'Candy bar Olivia Classic con paneles celestes y rosas, arco de globos, un arcoíris y una mesa de postres',
  },
  {
    id: 'gold',
    name: 'Candy Olivia Gold',
    price: 895000,
    tagline: 'Una experiencia súper completa para recuerdos inolvidables',
    includes: [
      '5 a 7 paneles',
      '3 metros de globos',
      '5 a 8 mesas',
      'Nombre y número',
      'Alzadas y bandejas',
      'Imágenes temáticas',
      'Atril de bienvenida',
      'Torta de 60 porciones',
      '30 postrecitos',
      '20 kits de mesa',
      '10 galletas',
      '10 cupcakes',
      '10 icepop',
      '10 oreos cubiertas',
      '10 alfajores',
      '12 yapas',
      '12 titas',
      '10 tubitos de gomitas',
      '12 tic tac',
      '20 cajitas de golosinas',
    ],
    setupMinutes: 90,
    space: '4 m × 3 m',
    photo: '/img/candy/combo-gold.jpg',
    photoAlt: 'Candy bar Olivia Gold con paneles, globos celestes y blancos, figuras de fútbol y mesas de dulces en un salón',
  },
];

export type CandyTable = { guests: string; price: number; items: string[] };

const SALADA_BASE = [
  'Tablas de quesos y fiambres premium',
  'Panes saborizados de salame y de cebolla',
  'Panes caseros',
  'Focaccia artesanal',
  'Sanguchitos de jamón y queso en pan de miga',
  'Cuadraditos de jamón crudo y rúcula en focaccia',
  'Pinchos de fiambres y quesos',
];
const SALADA_MEDIA = ['Bruschetas de palta, tomate y pesto', 'Canastitas de queso azul, peras, miel y nueces'];

export const SALTY_TABLES: CandyTable[] = [
  { guests: '25 a 30 personas', price: 289000, items: SALADA_BASE },
  { guests: '45 a 50 personas', price: 479000, items: [...SALADA_BASE, ...SALADA_MEDIA] },
  { guests: '80 a 85 personas', price: 759000, items: [...SALADA_BASE, ...SALADA_MEDIA, 'Medialunas de jamón y queso', 'Chipá'] },
];

export const SWEET_TABLES: CandyTable[] = [
  {
    guests: '25 a 30 personas',
    price: 235000,
    items: ['Lemon pie', 'Cheesecake de frutos rojos', 'Brownie con dulce de leche, crema y frutillas', 'Petit four de crema y frutilla', 'Matilda', 'Chocotorta'],
  },
  {
    guests: '45 a 50 personas',
    price: 381000,
    items: ['Lemon pie', 'Cheesecake de frutos rojos', 'Tiramisú', 'Brownie con dulce de leche, crema y frutilla', 'Matilda', 'Torta Oreo', 'Alfajor de chocolate, naranja y nuez', 'Tarta de banana, dulce de leche y nuez'],
  },
  {
    guests: '80 a 85 personas',
    price: 624000,
    items: [
      'Lemon pie',
      'Cheesecake de frutos rojos',
      'Cheesecake de maracuyá',
      'Tiramisú',
      'Brownie blanco con pistachos y frambuesas',
      'Matilda',
      'Torta Oreo',
      'Alfajor de chocolate, naranja y nuez',
      'Tarta de banana, dulce de leche y nuez',
      'Red velvet',
      'Carrot cake',
    ],
  },
];

export const SWEET_NOTE = 'Calculado por 3 postres por persona.';

/** Condiciones de los combos de Candy Bar (decoración + pastelería) */
export const COMBO_TERMS = [
  'Te ofrecemos el servicio completo para que no tengas que preocuparte por nada de la mesa temática. No alquilamos productos por separado ni hacemos solo decoración.',
  'Los combos solo se pueden modificar para agregar cantidades.',
  'Se reserva con una seña del 20%. El saldo se puede abonar en cuotas charlables y debe quedar cancelado en su totalidad el día del evento.',
  'Incluye traslado en Gran Mendoza, armado, ordenado y desarmado completo de la ambientación. Para otras localidades, consultá el precio del traslado.',
  'Cada elemento de la ambientación es nuestro material de trabajo y debe devolverse en las mismas condiciones en que fue entregado.',
  'Si cancelás el evento, podemos reprogramar la fecha del armado según nuestra disponibilidad.',
];

/** Condiciones de las mesas saladas y dulces */
export const TABLE_INCLUDES = [
  'Vajilla y elementos de presentación necesarios para exhibir los productos',
  'Platos, pinchos y servilletas, según corresponda al servicio contratado',
  'Montaje y armado estético de la mesa, realizado por nuestro equipo',
  'Traslado dentro de Gran Mendoza',
];

export const TABLE_TERMS = [
  'La fecha se confirma con una seña del 50% del valor total. El otro 50% se abona el día del evento, antes o al comenzar el servicio. La fecha no se considera reservada hasta que la seña esté acreditada.',
  'Para reservar necesitamos: fecha y horario de comienzo y fin, lugar de realización, cantidad de personas y combo elegido.',
  'Cada combo está pensado para una cantidad de personas. Cualquier cambio en invitados, combo u horario debe pedirse con anticipación y puede ajustar el valor final.',
  'Necesitamos una mesa disponible, limpia y despejada al llegar. El tiempo estimado de montaje es de 35 minutos.',
  'Si el lugar tiene escaleras, accesos reducidos, restricciones de ingreso o grandes distancias desde el punto de descarga, avisanos antes.',
  'Los elementos de Olivia Candy Bar quedan al cuidado del cliente durante el evento. En caso de pérdida, rotura o faltante se cobra el valor de reposición o reparación.',
];

export const CANDY_IMPORTANT = 'Todos nuestros servicios se preparan especialmente para cada evento: te recomendamos reservar con anticipación para asegurar la fecha, el personal, los productos y los elementos de montaje.';

export type CandyContent = {
  combos: CandyCombo[];
  comboNote: string;
  salty: CandyTable[];
  sweet: CandyTable[];
  sweetNote: string;
  tableIncludes: string[];
  comboTerms: string[];
  tableTerms: string[];
  important: string;
};

export const DEFAULT_CANDY: CandyContent = {
  combos: CANDY_COMBOS,
  comboNote: 'Todos los combos incluyen el traslado dentro de Gran Mendoza, el armado y el desarmado completo de la ambientación.',
  salty: SALTY_TABLES,
  sweet: SWEET_TABLES,
  sweetNote: SWEET_NOTE,
  tableIncludes: TABLE_INCLUDES,
  comboTerms: COMBO_TERMS,
  tableTerms: TABLE_TERMS,
  important: CANDY_IMPORTANT,
};

/** Para pre-completar el formulario de consulta (/eventos?consulta=<id>#consulta) */
export function candyInquiries(c: CandyContent): Record<string, { label: string; eventType: string }> {
  const out: Record<string, { label: string; eventType: string }> = {};
  for (const combo of c.combos) out[combo.id] = { label: combo.name, eventType: 'Candy bar / mesa dulce' };
  for (const t of c.salty) out[tableInquiryId('salada', t)] = { label: `Mesa salada para ${t.guests}`, eventType: 'Otro' };
  for (const t of c.sweet) out[tableInquiryId('dulce', t)] = { label: `Mesa dulce para ${t.guests}`, eventType: 'Candy bar / mesa dulce' };
  return out;
}

export const tableInquiryId = (prefix: 'salada' | 'dulce', t: CandyTable) => `${prefix}-${t.guests.slice(0, 2)}`;
