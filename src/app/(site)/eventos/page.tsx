import Image from 'next/image';
import { Cake, PartyPopper, Palette, Gift } from 'lucide-react';
import { CandyBarPrices } from '@/components/site/CandyBarPrices';
import { EventForm } from '@/components/site/EventForm';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { todayStr } from '@/lib/dates';
import { img } from '@/lib/site';
import { candyInquiries } from '@/lib/candy-bar';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Eventos y candy bar',
  description: 'Combos de candy bar con precios, mesas saladas y dulces, tortas y decoración temática para cumpleaños y eventos en Mendoza. Olivia Pastelería y Café. Pedí tu presupuesto.',
  alternates: { canonical: '/eventos' },
};

export const dynamic = 'force-dynamic';

const SERVICES = [
  { icon: PartyPopper, title: 'Candy bar y mesas dulces', text: 'Paneles, gráfica en gran formato, tortas, postres y souvenirs en un mismo espacio.' },
  { icon: Cake, title: 'Pastelería a medida', text: 'Tortas y dulces personalizados para tu celebración, con la temática que imagines.' },
  { icon: Palette, title: 'Decoración temática', text: 'Armamos la ambientación a partir de tus referencias e ideas.' },
  { icon: Gift, title: 'Para todo tipo de festejos', text: 'Cumpleaños infantiles, de adultos y propuestas para empresas.' },
];

export default async function EventosPage({ searchParams }: { searchParams: Promise<{ consulta?: string }> }) {
  const { consulta } = await searchParams;
  const [candy, c] = await Promise.all([getContent('candy-bar'), getContent('contacto')]);
  const inquiry = consulta ? candyInquiries(candy)[consulta] : undefined;
  return (
    <>
      <PageHero eyebrow="Eventos y candy bar" title="Celebremos" script="tu momento" description="Mesas dulces, tortas y decoración temática para que tu festejo sea tan lindo como lo soñaste." image="/img/card-eventos.jpg" imagePosition="center 52%" imageAlt="Candy bar del Principito con paneles verde y celeste, globos naranjas y oliva y una mesa de dulces en un salón luminoso" />

      <section className="container-x py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 90} className="card text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600"><s.icon className="h-7 w-7" strokeWidth={1.5} /></span>
              <h3 className="mt-5 text-2xl leading-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cocoa-600">{s.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-2xl text-center text-cocoa-600">
          Hacemos Olivia Candy Bar desde 2019. Mirá más trabajos en Instagram:{' '}
          <a href={c.candyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-olivia-beige underline">{c.candyHandle}</a>
          <div className="mt-6">
            <a href="#candy-bar" className="btn-primary">Ver combos y precios</a>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { src: '/img/eventos-1.jpg', alt: 'Torta de cumpleaños de dos pisos con figura decorada a mano' },
            { src: '/img/eventos-2.jpg', alt: 'Cajitas personalizadas, frascos y galletitas decoradas de un candy bar' },
            { src: '/img/eventos-3.jpg', alt: 'Candy bar completo armado en el salón con globos y paneles' },
            { src: '/img/eventos-4.jpg', alt: 'Mesa salada con medialunas rellenas, bocaditos y tablas' },
          ].map((g, i) => (
            <Reveal key={g.src} delay={i * 90} className={`relative aspect-[3/4] overflow-hidden rounded-3xl ${i % 2 ? 'md:mt-8' : ''}`}>
              <Image src={img(g.src)} alt={g.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </section>

      <CandyBarPrices />

      <section id="consulta" className="container-x max-w-3xl scroll-mt-24 py-16">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow">Consulta de eventos</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Contanos <span className="script text-5xl sm:text-6xl">tu idea</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-cocoa-600">Completá el formulario y te respondemos por WhatsApp con las opciones y el presupuesto.</p>
        </Reveal>
        <Reveal delay={100}>
          <EventForm
            key={consulta ?? 'general'}
            minDate={todayStr()}
            whatsappNumber={c.whatsappNumber}
            initialType={inquiry?.eventType}
            initialMessage={inquiry ? `Hola, quería consultar por: ${inquiry.label}.
` : undefined}
          />
        </Reveal>
      </section>
    </>
  );
}
