import { Clock, MapPin } from 'lucide-react';
import { mapsLink, whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';
import { InstagramIcon, WhatsAppIcon } from './Icons';

export async function InfoBar() {
  const c = await getContent('contacto');
  const items = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Dónde estamos',
      body: (
        <a href={mapsLink(c)} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-beige">
          {c.street}
          <br />
          {c.city}
        </a>
      ),
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Horarios',
      body: (
        <>
          {c.hoursLabel}
          <br />
          {c.hoursRanges.join(' y ')} hs
        </>
      ),
    },
    {
      icon: <WhatsAppIcon className="h-6 w-6" />,
      title: 'WhatsApp',
      body: (
        <a href={whatsappLink('¡Hola Olivia! Quería hacer una consulta.', c.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-beige">
          {c.phoneDisplay}
          <br />
          Escribinos
        </a>
      ),
    },
    {
      icon: <InstagramIcon className="h-6 w-6" />,
      title: 'Instagram',
      body: (
        <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-beige">
          {c.instagramHandle}
          <br />
          Seguinos
        </a>
      ),
    },
  ];

  return (
    <section aria-label="Información de contacto" className="bg-rose-100">
      <div className="container-x grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-4 lg:justify-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-olivia-beige shadow-sm">{it.icon}</span>
            <div>
              <h3 className="font-serif text-xl">{it.title}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-cocoa-600">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
