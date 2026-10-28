// Tardes de Té: tipos y valores por DEFECTO. Lo que se ve en la web se edita desde el panel
// (Admin → Contenido → Tardes de Té); estos valores se usan hasta que se guarde algo ahí.

export type TeaMenu = {
  id: string;
  name: string;
  tagline: string;
  /** Valor por persona en pesos */
  price: number;
  infusion: string;
  pastry: string[];
  /** "Degustación de sándwiches" o "Salados", según el menú */
  savoryTitle: string;
  savory: string[];
  secondStep: string;
  visible: boolean;
};

export type TeaContent = {
  intro: string;
  quote: string;
  minGuests: number;
  depositPct: number;
  schedule: string;
  menus: TeaMenu[];
  /** Admite {minimo}, {sena} y {horario}: se reemplazan por los valores de arriba */
  rules: string[];
  rulesFootnote: string;
  benefitsIntro: string;
  benefits: { guests: string; perk: string }[];
  addonsIntro: string;
  addons: { name: string; price: number; items: string[] }[];
};

export const DEFAULT_TEA: TeaContent = {
  intro: 'Pensamos estas propuestas para esos momentos que merecen disfrutarse sin apuro y sin preocupaciones: festejar, compartir risas y cosas ricas con quienes más querés.',
  quote: 'Más que café y pasteles, compartimos el amor por verte feliz.',
  minGuests: 10,
  depositPct: 50,
  schedule: '16:30 a 20:30',
  menus: [
    {
      id: 'te-1',
      name: 'Tardes de Té 1',
      tagline: '',
      price: 20900,
      infusion: 'Infusión caliente mediana + 1 repetición',
      pastry: ['Lemon pie', 'Carrot cake', 'Brownie blanco con pistachos y frambuesa', 'Tiramisú'],
      savoryTitle: 'Degustación de sándwiches',
      savory: ['Sándwich de lomo ahumado', 'Sándwich de jamón crudo', 'Sándwich de jamón y queso'],
      secondStep: 'Limonada con menta y jengibre para acompañar el momento de la torta',
      visible: true,
    },
    {
      id: 'te-2',
      name: 'Tardes de Té 2',
      tagline: '',
      price: 19900,
      infusion: 'Infusión caliente mediana + 1 repetición',
      pastry: ['Brownie con crema y frutilla', 'Mini rogel', 'Tarta de dulce de leche, banana y nuez', 'Budín de limón'],
      savoryTitle: 'Degustación de sándwiches',
      savory: ['Sándwich de jamón crudo', 'Sándwich de jamón, queso, tomate y lechuga', 'Sándwich de jamón y queso'],
      secondStep: 'Limonada con menta y jengibre para acompañar el momento de la torta',
      visible: true,
    },
    {
      id: 'sin-tacc',
      name: 'Tardes de Té Sin TACC',
      tagline: '',
      price: 23000,
      infusion: 'Infusión caliente mediana + 1 repetición',
      pastry: ['Lemon pie', 'Tarta de dulce de leche y coco', 'Tarta chocotorta', 'Cheesecake de frutos rojos'],
      savoryTitle: 'Salados',
      savory: ['Focaccia de jamón crudo', 'Sándwich de jamón y queso'],
      secondStep: 'Limonada con menta y jengibre',
      visible: true,
    },
    {
      id: 'hasta-16',
      name: 'Tardes de Té hasta 16 años',
      tagline: 'Para chicos y adolescentes',
      price: 18000,
      infusion: 'Infusión caliente mediana: té, yerbeado, submarino o chocolatada',
      pastry: ['Torta Oreo', 'Brownie con dulce de leche, crema y frutilla', 'Chocotorta'],
      savoryTitle: 'Salados',
      savory: ['Sándwich de jamón y queso', 'Sándwich de jamón, queso, tomate, lechuga y palta', '1 chipá'],
      secondStep: 'Jugo de naranja',
      visible: true,
    },
  ],
  rules: [
    'Se envía nombre y cantidad de personas.',
    'El valor del menú es por persona. Se realiza a partir de {minimo} personas y todos los invitados eligen el mismo menú.',
    'Se reserva con una seña del {sena}% del total y con un mínimo de 48 a 72 hs de anticipación.',
    'El horario es de {horario}.',
    'Al finalizar se abona la cantidad de menús reservados, aunque asistan menos invitados.',
    'Si asisten más personas de las reservadas sin aviso previo de 24 hs, consumen a la carta (se pueden sumar hasta 5 personas a último momento).',
    'Si traés una torta que no es de Olivia, se cobran $1.500 por persona (incluye servicio de corte y platos).',
    'El presupuesto no incluye propina.',
  ],
  rulesFootnote: 'Al reservar aceptás estos términos y condiciones. Existen para garantizar una excelente atención a muchos clientes a la vez.',
  benefitsIntro: 'Además, celebrando tu cumpleaños en Olivia tenemos un regalo sorpresa.',
  benefits: [
    { guests: '10 a 15 invitados', perk: 'Menú de la agasajada gratis + 10% de descuento al encargar la torta' },
    { guests: '15 a 35 invitados', perk: 'Menú de la agasajada gratis + 15% de descuento al encargar la torta' },
    { guests: '35 o más invitados', perk: 'Te regalamos el menú de la agasajada y una torta a elección' },
  ],
  addonsIntro: 'Para adultos, niños, adolescentes y eventos corporativos. Para opciones más grandes y completas, consultá el catálogo de Candy Bar.',
  addons: [
    {
      name: 'Candy Bar completo',
      price: 120000,
      items: [
        'Torta personalizada de 2 kg',
        'Mobiliario de Candy Bar para exhibir la torta y sacarse fotos',
        '2 biombos con los colores elegidos',
        'Globos',
        'Nombre en polifán',
        'Mesas, bandejitas y posatortas a tono',
      ],
    },
    {
      name: 'Rincón de fotos',
      price: 95000,
      items: ['Mobiliario de Candy Bar para sacarse fotos', '1 biombo con el color elegido', 'Globos', 'Mesa y posatortas a tono'],
    },
  ],
};

export const formatPrice = (n: number) => `$${n.toLocaleString('es-AR')}`;

export const findTeaMenu = (menus: TeaMenu[], id: string) => menus.find((m) => m.id === id);

/** Reemplaza {minimo}, {sena} y {horario} en una condición. */
export const fillRule = (rule: string, t: Pick<TeaContent, 'minGuests' | 'depositPct' | 'schedule'>) =>
  rule.replaceAll('{minimo}', String(t.minGuests)).replaceAll('{sena}', String(t.depositPct)).replaceAll('{horario}', t.schedule);
