import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/site/Icons';
import { mapsEmbed, mapsLink, telHref, whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';

export async function generateMetadata() {
  const c = await getContent('contacto');
  return {
    title: 'Contacto y cómo llegar',
    description: `Olivia Pastelería y Café: ${c.street}, ${c.city}. ${c.hoursLabel}: ${c.hoursRanges.join(' y ')} hs. Escribinos por WhatsApp.`,
    alternates: { canonical: '/contacto' },
  };
}

export default async function ContactoPage() {
  const c = await getContent('contacto');
  const rows = [
    { icon: MapPin, title: 'Dónde estamos', body: <a href={mapsLink(c)} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-beige">{[c.street, c.detail].filter(Boolean).join(', ')}<br />{c.city}, Argentina</a> },
    { icon: Clock, title: 'Horarios', body: <>{c.hoursLabel}: {c.hoursRanges.join(' y ')} hs<br /><span className="text-cocoa-500">{c.hoursClosed}</span></> },
    { icon: WhatsAppIcon, title: 'WhatsApp', body: <a href={whatsappLink('¡Hola Olivia! Quería hacer una consulta.', c.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-beige">{c.phoneDisplay}</a> },
    { icon: Phone, title: 'Teléfono', body: <a href={telHref(c)} className="hover:text-olivia-beige">{c.phoneDisplay}</a> },
    { icon: Mail, title: 'Email', body: <a href={`mailto:${c.email}`} className="break-all hover:text-olivia-beige">{c.email}</a> },
    { icon: InstagramIcon, title: 'Instagram', body: <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-beige">{c.instagramHandle}</a> },
  ];

  return (
    <>
      <PageHero eyebrow="Contacto" title="Vení a" script="visitarnos" description={`Estamos en ${c.city}: ${[c.street, c.detail].filter(Boolean).join(', ')}.`} />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <ul className="space-y-6">
            {rows.map((r) => (
              <li key={r.title} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600"><r.icon className="h-6 w-6" /></span>
                <div>
                  <h2 className="font-serif text-xl">{r.title}</h2>
                  <p className="text-cocoa-600">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink('¡Hola Olivia! Quería hacer una consulta.', c.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn-primary"><WhatsAppIcon className="h-4 w-4" /> Escribinos</a>
            <a href={c.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn-outline"><FacebookIcon className="h-4 w-4" /> Facebook</a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-cream-300">
            <iframe
              title="Mapa de Olivia Pastelería y Café en Google Maps"
              src={mapsEmbed(c)}
              className="h-[380px] w-full sm:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a href={mapsLink(c)} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 w-full sm:w-auto">Abrir en Google Maps</a>
        </Reveal>
      </section>
    </>
  );
}
