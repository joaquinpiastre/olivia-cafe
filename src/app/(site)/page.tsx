import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Cake, Coffee, CakeSlice, PartyPopper, Sparkles, Users } from 'lucide-react';
import { HeroSlider } from '@/components/site/HeroSlider';
import { InfoBar } from '@/components/site/InfoBar';
import { Reveal } from '@/components/site/Reveal';
import { img } from '@/lib/site';

export const metadata = {
  title: { absolute: 'Olivia – Pastelería y Café | Momentos que saben bien · Mendoza' },
  alternates: { canonical: '/' },
};

const FEATURES = [
  { icon: Cake, label: 'Pastelería artesanal' },
  { icon: Coffee, label: 'Café de todos los días' },
  { icon: Users, label: 'Meriendas para compartir' },
  { icon: Sparkles, label: 'Tardes de té y experiencias' },
  { icon: PartyPopper, label: 'Eventos y candy bar' },
];

const CARDS = [
  { href: '/menu', title: 'Menú', text: 'Mirá nuestra carta completa con dulces, salados, bebidas y promos.', img: '/img/card-menu.jpg', alt: 'Torta de zanahoria con café con leche y jugo de naranja sobre una mesa de madera' },
  { href: '/tardes-de-te', title: 'Tardes de Té', text: 'Una pausa para compartir, con té, scones y pastelería.', img: '/img/card-tardes-de-te.jpg', alt: 'Manos sosteniendo un café junto a un tostado y una porción de torta' },
  { href: '/meriendas', title: 'Meriendas libres', text: 'Para disfrutar de muchas cosas ricas en una misma merienda.', img: '/img/meriendas-7.jpg', alt: 'Mesa de merienda libre con panecillos rellenos, sándwiches de miga y bandejas de bocaditos' },
  { href: '/eventos', title: 'Eventos y candy bar', text: 'Mesas dulces y celebraciones a medida.', img: '/img/card-eventos.jpg', alt: 'Candy bar del Principito con paneles verde y celeste, globos naranjas y oliva y una mesa de dulces en un salón luminoso' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-cream-100 to-cream">
        <div className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="animate-[fadeIn_.9s_ease-out_both] text-center lg:text-left">
            <p className="eyebrow">Pastelería y Café · Mendoza</p>
            <h1 className="mt-4 text-5xl leading-[1.05] sm:text-7xl">
              El placer de
              <span className="script block text-[2.7rem] leading-[1.15] sm:text-7xl lg:text-[4.5rem]">compartir algo rico♡</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-cocoa-600 lg:mx-0">
              Pastelería artesanal, café y un rincón cálido para quedarte a charlar y celebrar lo lindo de cada día.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/menu" className="btn-primary px-8 py-3.5 text-base">
                Conocé nuestro menú
              </Link>
              <Link href="/reservas" className="btn-outline px-8 py-3.5 text-base">
                Reservá tu mesa
              </Link>
            </div>
          </div>
          <HeroSlider />
        </div>
      </section>

      {/* Franja de íconos */}
      <section aria-label="Lo que ofrecemos" className="border-y border-cream-200 bg-white/60">
        <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-8 py-9 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f, i) => (
            <Reveal as="li" key={f.label} delay={i * 80} className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <f.icon className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <span className="font-serif text-lg leading-tight">{f.label}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Cards */}
      <section className="container-x pt-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Descubrí Olivia</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Algo rico para <span className="script text-5xl sm:text-6xl">cada momento</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 100}>
              <Link href={c.href} className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
                <Image src={img(c.img)} alt={c.alt} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-3xl !text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-snug text-cream-100/90">{c.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide">
                    Ver más <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Esencia */}
      <section className="container-x pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] shadow-soft lg:max-w-none">
              <Image src={img('/img/esencia-local.jpg')} alt="Salón de Olivia con un candy bar armado para un festejo" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
            </div>
            <span aria-hidden="true" className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[2rem] bg-rose-100" />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Nuestra esencia</p>
            <h2 className="mt-3 text-4xl leading-tight sm:text-5xl">
              Más que un café,
              <span className="script block text-5xl sm:text-7xl">una experiencia</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cocoa-600">
              Olivia nació en una casa de Tunuyán, con tortas y desayunos hechos con mucho cariño. Hoy es un lugar cálido en pleno microcentro de Mendoza, pensado para relajarte, compartir una buena merienda y celebrar los momentos especiales.
            </p>
            <Link href="/nosotros" className="btn-outline mt-8">
              Conocé nuestra historia
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA reservas */}
      <section className="container-x pt-24">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-rose px-6 py-14 text-center text-white sm:px-12">
          <CakeSlice aria-hidden="true" className="absolute -left-6 -top-6 h-36 w-36 -rotate-12 text-white/10" />
          <h2 className="relative text-3xl !text-white sm:text-5xl">
            ¿Te guardamos una mesa? <span className="font-script text-4xl font-normal sm:text-6xl">♡</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-rose-50">Reservá en menos de un minuto para una merienda, una tarde de té o tu próximo festejo.</p>
          <Link href="/reservas" className="btn-light relative mt-8 px-9 py-3.5 text-base">
            Reservá tu mesa
          </Link>
        </Reveal>
      </section>

      <div className="mt-24">
        <InfoBar />
      </div>
    </>
  );
}
