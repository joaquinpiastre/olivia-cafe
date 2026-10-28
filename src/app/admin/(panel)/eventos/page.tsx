import Link from 'next/link';
import { Mail, MessageCircle, Trash2, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDateLong } from '@/lib/dates';
import { waUrl } from '@/lib/whatsapp';
import { deleteInquiry, updateInquiry } from '@/app/admin/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: 'Consultas de eventos' };

const STATUS = [
  { v: 'NUEVA', l: 'Nuevas', tone: 'bg-rose-100 text-rose-700' },
  { v: 'CONTACTADA', l: 'Contactadas', tone: 'bg-amber-100 text-amber-800' },
  { v: 'CERRADA', l: 'Cerradas', tone: 'bg-stone-200 text-stone-600' },
];

export default async function EventosAdminPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const filter = STATUS.find((s) => s.v === estado)?.v;
  const [rows, counts] = await Promise.all([
    db.eventInquiry.findMany({ where: filter ? { status: filter as 'NUEVA' } : {}, orderBy: { createdAt: 'desc' }, take: 200 }),
    db.eventInquiry.groupBy({ by: ['status'], _count: true }),
  ]);
  const countOf = (v: string) => counts.find((c) => c.status === v)?._count ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Consultas de eventos</h1>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/eventos" className={`rounded-full px-4 py-1.5 text-sm ring-1 ${!filter ? 'bg-rose text-white ring-rose' : 'bg-white ring-cream-300'}`}>Todas</Link>
        {STATUS.map((s) => (
          <Link key={s.v} href={`/admin/eventos?estado=${s.v}`} className={`rounded-full px-4 py-1.5 text-sm ring-1 ${filter === s.v ? 'bg-rose text-white ring-rose' : 'bg-white ring-cream-300'}`}>
            {s.l} ({countOf(s.v)})
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-cocoa-500 ring-1 ring-cream-300">No hay consultas.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((q) => {
            const tone = STATUS.find((s) => s.v === q.status)!;
            return (
              <article key={q.id} className="card space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl">{q.name}</h2>
                    <p className="text-sm text-cocoa-500">{q.createdAt.toLocaleString('es-AR', { timeZone: 'America/Argentina/Mendoza' })}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone.tone}`}>{tone.l.replace(/s$/, '')}</span>
                </div>
                <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-cocoa-600">
                  <strong>{q.eventType}</strong>
                  {q.eventDate && <span className="cap1">{formatDateLong(q.eventDate)}</span>}
                  {q.guests && <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{q.guests} invitados</span>}
                  <span>{q.phone}</span>
                  {q.email && <a href={`mailto:${q.email}`} className="inline-flex items-center gap-1 hover:text-rose-700"><Mail className="h-4 w-4" />{q.email}</a>}
                </p>
                <p className="whitespace-pre-line rounded-xl bg-cream-100 p-4 text-cocoa-700">{q.message}</p>
                <form action={updateInquiry} className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                  <input type="hidden" name="id" value={q.id} />
                  <div>
                    <label className="label" htmlFor={`n-${q.id}`}>Notas internas</label>
                    <input id={`n-${q.id}`} name="adminNotes" defaultValue={q.adminNotes ?? ''} className="field !py-2" placeholder="Presupuesto enviado, seña, etc." />
                  </div>
                  <div>
                    <label className="label" htmlFor={`s-${q.id}`}>Estado</label>
                    <select id={`s-${q.id}`} name="status" defaultValue={q.status} className="field !py-2">
                      {STATUS.map((s) => <option key={s.v} value={s.v}>{s.l.replace(/s$/, '')}</option>)}
                    </select>
                  </div>
                  <button className="btn-primary !py-2.5">Guardar</button>
                </form>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a href={waUrl(q.phone, `¡Hola ${q.name.split(' ')[0]}! Te escribimos de Olivia Pastelería y Café por tu consulta de ${q.eventType.toLowerCase()}. 💗`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white">
                    <MessageCircle className="h-4 w-4" /> Responder por WhatsApp
                  </a>
                  <form action={deleteInquiry}>
                    <input type="hidden" name="id" value={q.id} />
                    <DeleteButton message="¿Eliminar esta consulta?" className="inline-flex items-center gap-1.5 text-sm text-rose-700 hover:underline"><Trash2 className="h-4 w-4" /> Eliminar</DeleteButton>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
