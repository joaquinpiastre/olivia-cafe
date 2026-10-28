import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Clock, Hash, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDateLong } from '@/lib/dates';
import { TYPE_LABEL, whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';
import { WhatsAppIcon } from '@/components/site/Icons';

export const metadata = { title: 'Reserva recibida', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ConfirmacionPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const code = (c ?? '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12);
  const r = code ? await db.reservation.findUnique({ where: { code } }) : null;
  const contact = await getContent('contacto');

  return (
    <>
      <Image src="/img/marca/flores-superior.png" alt="" aria-hidden="true" width={1600} height={218} priority className="h-auto w-full" />
      <section className="container-x max-w-2xl pb-8 pt-10 text-center sm:pt-14">
        <h1 className="text-4xl sm:text-5xl">
          ¡Recibimos tu reserva<span className="script text-5xl sm:text-6xl"> ♡</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-cocoa-600">
          {r ? `Gracias, ${r.name.split(' ')[0]}.` : 'Gracias.'} Tu reserva queda <strong>pendiente de confirmación</strong>: te escribimos por WhatsApp para confirmarla.
        </p>

        {r && (
          <div className="card mx-auto mt-10 max-w-md text-left">
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><CalendarCheck className="h-5 w-5 text-olivia-beige" /><span className="cap1">{formatDateLong(r.date)}</span></li>
              <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-olivia-beige" />{r.time} hs · {TYPE_LABEL[r.type]}</li>
              <li className="flex items-center gap-3"><Users className="h-5 w-5 text-olivia-beige" />{r.partySize} {r.partySize === 1 ? 'persona' : 'personas'}</li>
              <li className="flex items-center gap-3"><Hash className="h-5 w-5 text-olivia-beige" />Código: <strong className="tracking-widest">{r.code}</strong></li>
            </ul>
          </div>
        )}

        <p className="mt-8 text-sm text-cocoa-500">¿Necesitás cambiar o cancelar? Escribinos citando tu código.</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={whatsappLink(`¡Hola Olivia! Hice una reserva${r ? ` (código ${r.code})` : ''} y quería consultar.`, contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <WhatsAppIcon className="h-4 w-4" /> Escribir por WhatsApp
          </a>
          <Link href="/" className="btn-outline">Volver al inicio</Link>
        </div>

        <Image src="/img/marca/nos-vemos-en-olivia.png" alt="Nos vemos en Olivia" width={1200} height={594} className="mx-auto mt-12 h-auto w-64 sm:w-80" />
        <p className="mt-2 text-xs text-cocoa-400">{contact.street}, {contact.city}</p>
      </section>
      <Image src="/img/marca/flores-inferior.png" alt="" aria-hidden="true" width={1600} height={219} className="h-auto w-full" />
    </>
  );
}
