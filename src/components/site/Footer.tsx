import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { NAV, mapsLink, telHref, whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';
import { Logo } from './Logo';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './Icons';

export async function Footer() {
  const c = await getContent('contacto');
  return (
    <footer className="mt-24 bg-cocoa text-cream-200">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light size="lg" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-300/90">
            Pastelería artesanal, café y un lugar para quedarse a charlar. Hecho con cariño en el corazón de Mendoza.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Olivia" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-rose">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={c.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Olivia" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-rose">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href={whatsappLink(undefined, c.whatsappNumber)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Olivia" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-rose">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-white">Explorá</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...NAV.slice(1), { href: '/reservas', label: 'Reservas' }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition hover:text-olivia-green">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-xl text-white">Horarios</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
              <span>
                {c.hoursLabel}
                {c.hoursRanges.map((r) => (
                  <span key={r} className="block">{r} hs</span>
                ))}
                <span className="block text-cream-300/70">{c.hoursClosed}</span>
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-xl text-white">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
              <a href={mapsLink(c)} target="_blank" rel="noopener noreferrer" className="hover:text-olivia-green">
                {[c.street, c.detail].filter(Boolean).join(', ')}
                <span className="block">{c.city}, Argentina</span>
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
              <a href={telHref(c)} className="hover:text-olivia-green">{c.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-olivia-green" />
              <a href={`mailto:${c.email}`} className="break-all hover:text-olivia-green">{c.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream-300/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Olivia – Pastelería y Café. Todos los derechos reservados.</p>
          <p>Hecho con ♡ en Mendoza</p>
        </div>
      </div>
    </footer>
  );
}
