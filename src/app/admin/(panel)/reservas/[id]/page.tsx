import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';
import { todayStr, formatDateLong } from '@/lib/dates';
import { TYPE_LABEL } from '@/lib/site';
import { WA_TEMPLATES, waUrl } from '@/lib/whatsapp';
import { ReservationAdminForm } from '@/components/admin/ReservationAdminForm';
import { StatusBadge, StatusSelect } from '@/components/admin/StatusSelect';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteReservation } from '@/app/admin/actions';

export const metadata = { title: 'Reserva' };

export default async function ReservaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [r, shifts] = await Promise.all([db.reservation.findUnique({ where: { id } }), db.shift.findMany({ orderBy: { startTime: 'asc' } })]);
  if (!r) notFound();

  const msgs = [
    { label: 'Confirmación', text: WA_TEMPLATES.confirmacion(r), tone: 'bg-[#25D366] text-white' },
    { label: 'Recordatorio', text: WA_TEMPLATES.recordatorio(r), tone: 'bg-white text-cocoa ring-1 ring-cream-300' },
    { label: 'Cancelación', text: WA_TEMPLATES.cancelacion(r), tone: 'bg-white text-cocoa ring-1 ring-cream-300' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reservas" className="text-sm text-cocoa-500 hover:text-rose-700">← Reservas</Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl">{r.name}</h1>
          <StatusBadge status={r.status} />
        </div>
        <p className="mt-1 cap1 text-cocoa-600">
          {formatDateLong(r.date)} · {r.time} hs · {r.partySize} pers. · {TYPE_LABEL[r.type]}
        </p>
        <p className="mt-1 text-xs text-cocoa-400">
          Código {r.code} · {r.source === 'WEB' ? 'Reservada desde la web' : 'Cargada manualmente'} · {r.createdAt.toLocaleString('es-AR', { timeZone: 'America/Argentina/Mendoza' })}
        </p>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-cocoa-600">Estado:</span>
          <StatusSelect id={r.id} status={r.status} />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-cocoa-600">Escribirle por WhatsApp</p>
          <div className="flex flex-wrap gap-2">
            {msgs.map((m) => (
              <a key={m.label} href={waUrl(r.phone, m.text)} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${m.tone}`}>
                <MessageCircle className="h-4 w-4" /> {m.label}
              </a>
            ))}
          </div>
          <details className="mt-3 text-sm text-cocoa-500">
            <summary className="cursor-pointer">Ver mensaje de confirmación</summary>
            <p className="mt-2 whitespace-pre-line rounded-xl bg-cream-100 p-3">{msgs[0].text}</p>
          </details>
        </div>
      </div>

      <div className="card sm:p-8">
        <h2 className="mb-5 text-2xl">Editar reserva</h2>
        <ReservationAdminForm
          mode="edit"
          shifts={shifts}
          today={todayStr()}
          initial={{ id: r.id, type: r.type, date: r.date, shiftId: r.shiftId, partySize: r.partySize, name: r.name, phone: r.phone, email: r.email ?? '', notes: r.notes ?? '', adminNotes: r.adminNotes ?? '' }}
        />
      </div>

      <form action={deleteReservation} className="pt-2">
        <input type="hidden" name="id" value={r.id} />
        <DeleteButton message="¿Eliminar esta reserva definitivamente? (Si solo se canceló, mejor cambiá el estado a Cancelada.)" className="inline-flex items-center gap-2 text-sm text-rose-700 hover:underline">
          <Trash2 className="h-4 w-4" /> Eliminar reserva
        </DeleteButton>
      </form>
    </div>
  );
}
