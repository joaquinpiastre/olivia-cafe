import Image from 'next/image';
import Link from 'next/link';
import { CalendarClock, Check } from 'lucide-react';
import { PageHero } from './PageHero';
import { Reveal } from './Reveal';
import { img, whatsappLink } from '@/lib/site';

type Props = {
  eyebrow: string;
  title: string;
  script: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  paragraphs: string[];
  details?: { title: string; items: string[] };
  gallery: { src: string; alt: string }[];
  reserveType: string;
  reserveLabel: string;
  waText: string;
  /** Aviso destacado (por ejemplo, cuando todavía no hay fecha). */
  notice?: string;
  /** Oculta el botón de reservar y deja solo el de WhatsApp. */
  hideReserve?: boolean;
  waLabel?: string;
  whatsappNumber?: string;
};

export function ExperiencePage(p: Props) {
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} script={p.script} description={p.intro} image={p.heroImage} imageAlt={p.heroAlt} />

      <section className={`container-x py-16 ${p.details ? 'grid gap-12 lg:grid-cols-2 lg:gap-16' : 'max-w-3xl text-center'}`}>
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-cocoa-600">
            {p.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          {p.notice && (
            <p className="mt-6 flex gap-3 rounded-2xl bg-rose-50 px-5 py-4 text-base text-cocoa-700">
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-olivia-green" />
              <span>{p.notice}</span>
            </p>
          )}
          <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${p.details ? '' : 'sm:justify-center'}`}>
            {!p.hideReserve && <Link href={`/reservas?tipo=${p.reserveType}`} className="btn-primary">{p.reserveLabel}</Link>}
            <a href={whatsappLink(p.waText, p.whatsappNumber)} target="_blank" rel="noopener noreferrer" className={p.hideReserve ? 'btn-primary' : 'btn-outline'}>{p.waLabel ?? 'Consultar por WhatsApp'}</a>
          </div>
        </Reveal>
        {p.details && (
        <Reveal delay={120} className="card self-start">
          <h2 className="text-2xl">{p.details?.title}</h2>
          <ul className="mt-5 space-y-3">
            {p.details?.items.map((it) => (
              <li key={it} className="flex gap-3 text-cocoa-600">
                <Check className="mt-1 h-5 w-5 shrink-0 text-olivia-green" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        )}
      </section>

      <section className="container-x pb-6">
        <div className={`grid grid-cols-2 gap-4 ${p.gallery.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {p.gallery.map((g, i) => (
            <Reveal key={g.src} delay={i * 90} className={`relative aspect-[3/4] overflow-hidden rounded-3xl ${p.gallery.length % 3 !== 0 && i % 2 ? 'md:mt-8' : ''}`}>
              <Image src={img(g.src)} alt={g.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
