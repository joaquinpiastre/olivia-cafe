import Link from 'next/link';
import type { Reservation } from '@prisma/client';
import { MessageCircle, Users } from 'lucide-react';
import { TYPE_LABEL } from '@/lib/site';
import { WA_TEMPLATES, waUrl } from '@/lib/whatsapp';
import { formatDateShort } from '@/lib/dates';
import { StatusSelect } from './StatusSelect';

export function waActionFor(r: Reservation) {
  switch (r.status) {
    case 'PENDIENTE':
      return { label: 'Confirmar por WhatsApp', href: waUrl(r.phone, WA_TEMPLATES.confirmacion(r)) };
    case 'CONFIRMADA':
      return { label: 'Recordatorio', href: waUrl(r.phone, WA_TEMPLATES.recordatorio(r)) };
    case 'CANCELADA':
      return { label: 'Avisar cancelación', href: waUrl(r.phone, WA_TEMPLATES.cancelacion(r)) };
    default:
      return { label: 'WhatsApp', href: waUrl(r.phone, `Hola ${r.name.split(' ')[0]}, te escribimos de Olivia Pastelería y Café.`) };
  }
}

export function ReservationRow({ r, showDate = false }: { r: Reservation; showDate?: boolean }) {
  const wa = waActionFor(r);
  return (
    <article className={`flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cream-300 sm:flex-row sm:items-center ${r.status === 'CANCELADA' ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-4 sm:w-44 sm:shrink-0">
        <div className="text-center">
          <p className="font-serif text-3xl leading-none">{r.time}</p>
          {showDate && <p className="mt-1 text-xs cap1 text-cocoa-500">{formatDateShort(r.date)}</p>}
        </div>
        <div className="min-w-0 sm:hidden">
          <p className="truncate font-medium">{r.name}</p>
        </div>
      </div>

      <Link href={`/admin/reservas/${r.id}`} className="min-w-0 flex-1">
        <p className="hidden truncate font-medium sm:block">{r.name}</p>
        <p className="flex flex-wrap items-center gap-x-3 text-sm text-cocoa-600">
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{r.partySize}</span>
          <span>{TYPE_LABEL[r.type]}</span>
          <span className="text-cocoa-400">{r.code}</span>
          {r.source === 'MANUAL' && <span className="rounded bg-cream-200 px-1.5 text-xs">manual</span>}
        </p>
        {r.notes && <p className="mt-1 line-clamp-2 text-sm italic text-cocoa-500">“{r.notes}”</p>}
      </Link>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <StatusSelect id={r.id} status={r.status} />
        <a href={wa.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-sm font-medium text-white hover:brightness-95">
          <MessageCircle className="h-4 w-4" /> {wa.label}
        </a>
      </div>
    </article>
  );
}
