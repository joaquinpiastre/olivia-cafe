import Image from 'next/image';
import Link from 'next/link';
import { Check, Clock, Maximize, Truck } from 'lucide-react';
import { Reveal } from './Reveal';
import { WhatsAppIcon } from './Icons';
import { img, whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';
import { formatPrice } from '@/lib/tardes-de-te';
import { tableInquiryId, type CandyTable } from '@/lib/candy-bar';

const askHref = (id: string) => `/eventos?consulta=${id}#consulta`;

function TableGroup({ title, tone, tables, prefix, note }: { title: string; tone: string; tables: CandyTable[]; prefix: 'salada' | 'dulce'; note?: string }) {
  return (
    <div>
      <h3 className={`rounded-2xl px-5 py-3 text-center font-serif text-2xl ${tone}`}>{title}</h3>
      {note && <p className="mt-2 text-center text-xs text-cocoa-500">{note}</p>}
      <div className="mt-4 space-y-3">
        {tables.map((t) => (
          <details key={t.guests} className="group rounded-2xl bg-white p-4 shadow-soft ring-1 ring-cream-200 open:ring-rose-200">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span>
                <span className="block text-sm text-cocoa-500">Para</span>
                <span className="font-serif text-xl">{t.guests}</span>
              </span>
              <span className="text-right">
                <span className="block font-serif text-3xl text-olivia-beige">{formatPrice(t.price)}</span>
                <span className="text-xs text-cocoa-500 underline decoration-dotted group-open:hidden">Ver qué incluye</span>
                <span className="hidden text-xs text-cocoa-500 underline decoration-dotted group-open:inline">Ocultar</span>
              </span>
            </summary>
            <ul className="mt-4 space-y-1.5 border-t border-cream-200 pt-4 text-sm text-cocoa-600">
              {t.items.map((it) => (
                <li key={it} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <Link href={askHref(tableInquiryId(prefix, t))} className="btn-outline mt-5 !px-5 !py-2">
              Consultar esta mesa
            </Link>
          </details>
        ))}
      </div>
    </div>
  );
}

export async function CandyBarPrices() {
  const [k, c0] = await Promise.all([getContent('candy-bar'), getContent('contacto')]);
  return (
    <section id="candy-bar" className="scroll-mt-24 bg-cream-100 py-16 sm:py-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Olivia Candy Bar</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Combos <span className="script text-5xl sm:text-6xl">y precios</span>
          </h2>
          <p className="mt-4 text-cocoa-600">
            Elegí el combo que mejor se adapte a tu festejo. Incluye la ambientación, la torta y la pastelería: nos ocupamos de todo para que vos solo disfrutes.
          </p>
          <nav aria-label="Secciones de Candy Bar" className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <a href="#combos" className="rounded-full bg-white px-4 py-1.5 ring-1 ring-cream-300 hover:ring-rose">Combos de candy bar</a>
            <a href="#mesas" className="rounded-full bg-white px-4 py-1.5 ring-1 ring-cream-300 hover:ring-rose">Mesas saladas y dulces</a>
            <a href="#condiciones" className="rounded-full bg-white px-4 py-1.5 ring-1 ring-cream-300 hover:ring-rose">Cómo reservar</a>
          </nav>
        </Reveal>

        {/* Combos de candy bar */}
        <div id="combos" className="mt-12 scroll-mt-24 space-y-8">
          {k.combos.map((c) => (
            <Reveal key={c.id} className={`overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-cream-200 ${c.photo ? 'lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : ''}`}>
              {c.photo ? (
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[420px]">
                  <Image src={img(c.photo)} alt={c.photoAlt} fill sizes="(min-width: 1024px) 40vw, 92vw" className="object-cover object-[50%_35%]" />
                  {c.badge && <span className="absolute left-4 top-4 rounded-full bg-rose px-4 py-1.5 text-sm font-medium text-white shadow-soft">{c.badge}</span>}
                </div>
              ) : (
                c.badge && <span className="mx-6 mt-6 inline-block self-start rounded-full bg-rose px-4 py-1.5 text-sm font-medium text-white shadow-soft sm:mx-8 sm:mt-8">{c.badge}</span>
              )}
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div className="min-w-0">
                    <h3 className="text-3xl leading-tight sm:text-4xl">{c.name}</h3>
                    {c.tagline && <p className="mt-1 text-cocoa-500">{c.tagline}</p>}
                  </div>
                  <p className="shrink-0 font-serif text-4xl text-olivia-beige sm:text-5xl">{formatPrice(c.price)}</p>
                </div>

                <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-olivia-beige">Incluye</p>
                <ul className={`mt-3 gap-x-8 text-cocoa-600 sm:columns-2`}>
                  {c.includes.map((it) => (
                    <li key={it} className="mb-1.5 flex break-inside-avoid gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-olivia-green" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cocoa-600">
                  <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-olivia-green" /> Armado: {c.setupMinutes} minutos</span>
                  <span className="inline-flex items-center gap-2"><Maximize className="h-4 w-4 text-olivia-green" /> Espacio necesario: {c.space}</span>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                  <Link href={askHref(c.id)} className="btn-primary">Consultar este combo</Link>
                  <a
                    href={whatsappLink(`¡Hola Olivia! Quería consultar por el combo ${c.name}.`, c0.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-cocoa-600">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-olivia-green" />
          <p>{k.comboNote}</p>
        </Reveal>

        {/* Mesas saladas y dulces */}
        <div id="mesas" className="mt-20 scroll-mt-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Para sumar a tu evento</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Mesas saladas <span className="script text-4xl sm:text-5xl">y dulces</span>
            </h2>
            <p className="mt-4 text-cocoa-600">Elegí según la cantidad de invitados. Tocá cada opción para ver qué incluye.</p>
          </Reveal>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <TableGroup title="Mesas saladas" tone="bg-[#DDE7C7] text-cocoa" tables={k.salty} prefix="salada" />
            </Reveal>
            <Reveal delay={120}>
              <TableGroup title="Mesas dulces" tone="bg-rose-100 text-cocoa" tables={k.sweet} prefix="dulce" note={k.sweetNote || undefined} />
            </Reveal>
          </div>
          <Reveal className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white px-6 py-5 shadow-soft ring-1 ring-cream-200">
            <p className="font-serif text-xl">Todas las mesas incluyen</p>
            <ul className="mt-3 space-y-1.5 text-sm text-cocoa-600">
              {k.tableIncludes.map((it) => (
                <li key={it} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Cómo reservar */}
        <div id="condiciones" className="mt-20 scroll-mt-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Cómo reservar</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Condiciones <span className="script text-4xl sm:text-5xl">del servicio</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal className="card">
              <h3 className="text-2xl">Combos de candy bar</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-cocoa-600">
                {k.comboTerms.map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="card">
              <h3 className="text-2xl">Mesas saladas y dulces</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-cocoa-600">
                {k.tableTerms.map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-cocoa-600">{k.important}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#consulta" className="btn-primary">Pedir presupuesto</a>
              <a href={c0.candyUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Ver trabajos en {c0.candyHandle}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
