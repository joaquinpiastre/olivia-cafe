import { ExperiencePage } from '@/components/site/ExperiencePage';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Meriendas libres',
  description: 'Meriendas libres y para compartir en Olivia Pastelería y Café, Mendoza. Pastelería artesanal, opciones dulces y saladas y opciones Sin TACC.',
  alternates: { canonical: '/meriendas' },
};

export default async function MeriendasPage() {
  const [m, c] = await Promise.all([getContent('meriendas'), getContent('contacto')]);
  return (
    <ExperiencePage
      eyebrow="Meriendas"
      title="Meriendas para"
      script="disfrutar muchas cosas"
      intro={m.intro}
      heroImage="/img/meriendas-7.jpg"
      heroAlt="Mesa de merienda libre con panecillos rellenos, sándwiches de miga y bandejas de bocaditos"
      paragraphs={[m.paragraph]}
      gallery={[
        { src: '/img/meriendas-10.jpg', alt: 'Mesa de postres de la merienda libre con budín de carrot cake, brownies, vasitos de tiramisú y postres individuales' },
        { src: '/img/meriendas-11.jpg', alt: 'Mesa de postres con lemon pie, brownies, tartitas con merengue y cupcakes sobre una mesa de madera' },
        { src: '/img/meriendas-12.jpg', alt: 'Mesa de postres con alfajorcitos de chocolate y nuez, vasitos de tiramisú y facturas' },
        { src: '/img/meriendas-13.jpg', alt: 'Tiramisú en vasitos sobre un pie de torta, red velvet y medialunas en la mesa de postres' },
        { src: '/img/meriendas-14.jpg', alt: 'Bandejas de madera con panecillos de sésamo rellenos de jamón y sándwiches de miga' },
        { src: '/img/meriendas-6.jpg', alt: 'Mesa con chipás, sándwiches largos y bandejas de panificados' },
        { src: '/img/meriendas-8.jpg', alt: 'Bandejas con sándwiches alargados, chipás y facturas sobre una mesa de madera' },
        { src: '/img/meriendas-9.jpg', alt: 'Sándwiches de miga de jamón y queso servidos en una bandeja de madera' },
      ]}
      notice={m.notice || undefined}
      hideReserve={!m.reservable}
      waLabel={m.reservable ? undefined : 'Avisame cuando haya fecha'}
      whatsappNumber={c.whatsappNumber}
      reserveType="MERIENDA"
      reserveLabel="Reservar merienda"
      waText={m.reservable ? '¡Hola Olivia! Quería consultar por las meriendas libres.' : '¡Hola Olivia! Quería que me avisen cuando haya una nueva fecha de merienda libre.'}
    />
  );
}
