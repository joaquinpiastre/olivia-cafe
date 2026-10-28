import Image from 'next/image';
import Link from 'next/link';
import { Check, Gift, Heart } from 'lucide-react';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { img, whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';
import { fillRule, formatPrice } from '@/lib/tardes-de-te';

export const metadata = {
  title: 'Tardes de Té',
  description:
    'Tardes de té y cumpleaños en Olivia Pastelería y Café, Mendoza: menús con infusión, degustación de pastelería y sándwiches, opción Sin TACC y menú para chicos. Mirá los precios y reservá.',
  alternates: { canonical: '/tardes-de-te' },
};

const gallery = [
  { src: '/img/tardes-te-1.jpg', alt: 'Tabla de degustación con minipanes, torta, tiramisú en vasito y postres individuales sobre un individual rosa' },
  { src: '/img/tardes-te-2.jpg', alt: 'Tabla de degustación con minipanes, torta rellena, merengue y tiramisú en vasito' },
  { src: '/img/tardes-te-3.jpg', alt: 'Tabla de degustación con minipanes de sésamo, torta, tiramisú en vasito y postres chicos sobre una mesa de madera' },
  { src: '/img/tardes-te-4.jpg', alt: 'Tabla de pastelería y salados con minipanes rellenos, mini tortas y budín, servida en el salón' },
  { src: '/img/tardes-te-5.jpg', alt: 'Vista desde arriba de la tabla de degustación con minipanes, una frutilla, postres chicos y budín' },
];

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-olivia-beige">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-cocoa-600">
            <Check className="mt-1 h-4 w-4 shrink-0 text-olivia-green" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function TardesDeTePage() {
  const [t, c] = await Promise.all([getContent('tardes-de-te'), getContent('contacto')]);
  const menus = t.menus.filter((m) => m.visible);
  return (
    <>
      <PageHero
        eyebrow="Tardes de Té y cumpleaños"
        title="Una pausa para"
        script="compartir"
        description="Té, pastelería artesanal y tiempo para charlar. Vos te olvidás de cocinar, limpiar y preparar; nosotros nos encargamos del té, los sabores y la magia."
        image="/img/card-tardes-de-te.jpg"
        imageAlt="Manos sosteniendo un café junto a un tostado y una porción de torta"
      />

      <section className="container-x max-w-3xl py-14 text-center">
        <Reveal>
          <p className="text-lg leading-relaxed text-cocoa-600">{t.intro}</p>
          {t.quote && <p className="mt-5 font-script text-3xl text-olivia-green">{t.quote}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/reservas?tipo=TARDE_DE_TE" className="btn-primary">Reservar tarde de té</Link>
            <a href="#menus" className="btn-outline">Ver los menús</a>
          </div>
        </Reveal>
      </section>

      {/* Menús */}
      <section id="menus" className="scroll-mt-24 bg-cream-100 py-16">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Elegí tu menú</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Nuestros menús, <span className="script">un mismo cariño</span></h2>
            <p className="mt-4 text-cocoa-600">
              Cada menú tiene dos pasos: primero la infusión con la degustación de pastelería y salados, y después una bebida fresca para acompañar la torta. El valor es <strong>por persona</strong> y todos los invitados eligen el mismo menú.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {menus.map((m, i) => (
              <Reveal key={m.id} delay={(i % 2) * 100} className="card flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl">{m.name}</h3>
                    {m.tagline && <p className="mt-1 text-sm text-cocoa-500">{m.tagline}</p>}
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block font-serif text-3xl text-olivia-beige">{formatPrice(m.price)}</span>
                    <span className="text-xs text-cocoa-500">por persona</span>
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="font-script text-2xl text-olivia-green">Primer paso</p>
                    <p className="mt-1 text-cocoa-700">{m.infusion}</p>
                  </div>
                  <List title="Degustación de pastelería" items={m.pastry} />
                  {m.savory.length > 0 && <List title={m.savoryTitle} items={m.savory} />}
                  <div>
                    <p className="font-script text-2xl text-olivia-green">Segundo paso</p>
                    <p className="mt-1 text-cocoa-700">{m.secondStep}</p>
                  </div>
                </div>

                <Link href={`/reservas?tipo=TARDE_DE_TE&menu=${m.id}`} className="btn-outline mt-8 self-start">
                  Reservar este menú
                </Link>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-cocoa-500">
            Las imágenes son ilustrativas. Si tenés alguna restricción alimentaria, avisanos al reservar.
          </p>
        </div>
      </section>

      {/* Fotos */}
      <section className="container-x py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={i * 90} className={`relative overflow-hidden rounded-3xl ${i === gallery.length - 1 ? 'max-md:col-span-2 max-md:aspect-[16/10]' : 'aspect-[3/4]'} md:aspect-[3/4] ${i % 2 ? 'md:mt-8' : ''}`}>
              <Image src={img(g.src)} alt={g.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cómo reservar */}
      <section id="como-reservar" className="scroll-mt-24 container-x grid gap-12 pb-16 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">Cómo reservar</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Lo que tenés <span className="script">que saber</span></h2>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-cocoa px-2 py-4">
              <p className="font-serif text-2xl text-olivia-green">{t.minGuests}+</p>
              <p className="text-xs text-cream-200">personas</p>
            </div>
            <div className="rounded-2xl bg-cocoa px-2 py-4">
              <p className="font-serif text-2xl text-olivia-green">{t.depositPct}%</p>
              <p className="text-xs text-cream-200">de seña</p>
            </div>
            <div className="rounded-2xl bg-cocoa px-2 py-4">
              <p className="font-serif text-xl leading-8 text-olivia-green">{t.schedule}</p>
              <p className="text-xs text-cream-200">horario</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/reservas?tipo=TARDE_DE_TE" className="btn-primary">Reservar tarde de té</Link>
            <a href={whatsappLink('¡Hola Olivia! Quería consultar por las tardes de té.', c.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn-outline">Consultar por WhatsApp</a>
          </div>
        </Reveal>
        <Reveal delay={120} className="card self-start">
          <ul className="space-y-3.5">
            {t.rules.map((r) => (
              <li key={r} className="flex gap-3 text-cocoa-600">
                <Check className="mt-1 h-5 w-5 shrink-0 text-olivia-green" />
                <span>{fillRule(r, t)}</span>
              </li>
            ))}
          </ul>
          {t.rulesFootnote && <p className="mt-6 border-t border-cream-200 pt-4 text-sm text-cocoa-500">{t.rulesFootnote}</p>}
        </Reveal>
      </section>

      {/* Beneficios de cumpleaños */}
      {t.benefits.length > 0 && (
      <section className="bg-rose-50 py-16">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Gift className="mx-auto h-8 w-8 text-olivia-green" />
            <p className="eyebrow mt-3">Beneficios</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Festejá tu cumpleaños <span className="script">con nosotros</span></h2>
            {t.benefitsIntro && <p className="mt-4 text-cocoa-600">{t.benefitsIntro}</p>}
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.benefits.map((b, i) => (
              <Reveal key={b.guests} delay={i * 100} className="card text-center">
                <p className="font-serif text-2xl text-olivia-green">{b.guests}</p>
                <p className="mt-3 text-cocoa-600">{b.perk}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Adicionales */}
      {t.addons.length > 0 && (
      <section className="container-x py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Adicionales</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Un toque <span className="script">único y especial</span></h2>
          <p className="mt-4 text-cocoa-600">
            {t.addonsIntro} Mirá nuestros trabajos en{' '}
            <a href={c.candyUrl} target="_blank" rel="noopener noreferrer" className="text-olivia-beige underline">{c.candyHandle}</a>.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {t.addons.map((a, i) => (
            <Reveal key={a.name} delay={i * 100} className="card">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl">{a.name}</h3>
                <p className="font-serif text-2xl text-olivia-green">{formatPrice(a.price)}</p>
              </div>
              <ul className="mt-5 space-y-2.5">
                {a.items.map((it) => (
                  <li key={it} className="flex gap-3 text-cocoa-600">
                    <Heart className="mt-1 h-4 w-4 shrink-0 text-olivia-green" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/reservas?tipo=TARDE_DE_TE" className="btn-primary">Reservar tarde de té</Link>
          <p className="mt-3 text-sm text-cocoa-500">¿Querés sumar algún adicional? Contanoslo en los comentarios de la reserva o por WhatsApp.</p>
        </Reveal>
      </section>
      )}
    </>
  );
}
