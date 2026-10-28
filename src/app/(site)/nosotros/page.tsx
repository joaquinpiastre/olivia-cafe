import Image from 'next/image';
import Link from 'next/link';
import { Coffee, Heart, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { InfoBar } from '@/components/site/InfoBar';
import { img } from '@/lib/site';

export const metadata = {
  title: 'Nosotros',
  description: 'La historia de Olivia Pastelería y Café: Axel y Samira empezaron en 2019 en una casa de Tunuyán y hoy tienen su café en el microcentro de Mendoza.',
  alternates: { canonical: '/nosotros' },
};

const VALUES = [
  { icon: Heart, title: 'Hecho con cariño', text: 'Todo empezó cocinando en casa para quienes queríamos. Esa forma de trabajar sigue intacta.' },
  { icon: Coffee, title: 'Un lugar para quedarse', text: 'Pensamos Olivia como un espacio cálido que te invita a relajarte y a charlar sin mirar el reloj.' },
  { icon: Sparkles, title: 'Momentos especiales', text: 'Cumpleaños, meriendas, tardes de té y hasta propuestas de casamiento: nos encanta ser parte.' },
];

export default function NosotrosPage() {
  return (
    <>
      <PageHero eyebrow="Nosotros" title="Nuestra" script="historia" description="Dos jóvenes, una cocina de casa y muchas ganas de que los momentos sepan bien." />

      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
          <Image src={img('/img/nosotros-historia.jpg')} alt="Mesa de madera con tortas, limonada, cafés y pastelitos servida en Olivia" fill sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow">Cómo empezó todo</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">De una casa en Tunuyán al centro de Mendoza</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-cocoa-600">
            <p>
              Olivia es el sueño de <strong className="font-semibold text-cocoa">Axel y Samira</strong>, una pareja joven de Tunuyán. En 2019 empezaron haciendo tortas personalizadas y desayunos desde su casa. El nombre es un homenaje a su mascota, que criaron juntos.
            </p>
            <p>
              Con el tiempo los pedidos crecieron y necesitaron más espacio: primero buscaron un local pequeño para trabajar mejor y después abrieron un café. Hoy Olivia está en pleno microcentro de Mendoza, sobre Av. Godoy Cruz, y es uno de los lugares elegidos por quienes buscan una buena merienda o un lugar para celebrar.
            </p>
            <p>
              Samira cuenta que se complementan: uno pone la idea y el otro la lleva a cabo. Y lo que sueñan para Olivia es simple: que sea un lugar querido por los mendocinos.
            </p>
          </div>
          <blockquote className="mt-8 border-l-2 border-rose pl-5 font-serif text-2xl italic text-cocoa-700">
            “Es un lugar cálido que te invita a relajarte.”
            <footer className="mt-2 font-sans text-sm not-italic text-cocoa-500">— Axel</footer>
          </blockquote>
        </Reveal>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="container-x">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="eyebrow">Lo que nos define</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Más que un café, <span className="script text-5xl sm:text-6xl">una experiencia</span></h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100} className="card text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600"><v.icon className="h-7 w-7" strokeWidth={1.5} /></span>
                <h3 className="mt-5 text-2xl">{v.title}</h3>
                <p className="mt-3 text-cocoa-600">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
        <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-soft lg:order-2 lg:max-w-none">
          <Image src={img('/img/nosotros-local.jpg')} alt="Fachada de Olivia Pastelería y Café, con su puerta de entrada y balcones" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
        </Reveal>
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">Te esperamos en <span className="script text-5xl sm:text-6xl">Olivia</span></h2>
          <p className="mt-5 text-lg leading-relaxed text-cocoa-600">
            Pastelería artesanal, café, meriendas libres, tardes de té, candy bar y opciones Sin TACC. Venite con quien más quieras.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/reservas" className="btn-primary">Reservá tu mesa</Link>
            <Link href="/menu" className="btn-outline">Ver el menú</Link>
          </div>
        </Reveal>
      </section>
      <InfoBar />
    </>
  );
}
