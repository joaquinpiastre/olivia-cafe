import Link from 'next/link';
import { CalendarCheck, Clock, Inbox, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { addDays, formatDateLong, todayStr } from '@/lib/dates';
import { ReservationRow } from '@/components/admin/ReservationRow';

export const metadata = { title: 'Panel' };

export default async function DashboardPage() {
  const today = todayStr();
  const weekEnd = addDays(today, 7);
  const active = ['PENDIENTE', 'CONFIRMADA', 'ASISTIO'] as const;

  const [todayList, upcoming, pending, confirmed, peopleToday, newInquiries] = await Promise.all([
    db.reservation.findMany({ where: { date: today }, orderBy: { time: 'asc' } }),
    db.reservation.findMany({ where: { date: { gt: today, lte: weekEnd }, status: { not: 'CANCELADA' } }, orderBy: [{ date: 'asc' }, { time: 'asc' }] }),
    db.reservation.count({ where: { status: 'PENDIENTE', date: { gte: today } } }),
    db.reservation.count({ where: { status: 'CONFIRMADA', date: { gte: today } } }),
    db.reservation.aggregate({ _sum: { partySize: true }, where: { date: today, status: { in: [...active] } } }),
    db.eventInquiry.count({ where: { status: 'NUEVA' } }),
  ]);

  const stats = [
    { label: 'Pendientes de confirmar', value: pending, icon: Clock, href: '/admin/reservas?status=PENDIENTE', tone: 'bg-amber-100 text-amber-800' },
    { label: 'Confirmadas (próximas)', value: confirmed, icon: CalendarCheck, href: '/admin/reservas?status=CONFIRMADA', tone: 'bg-emerald-100 text-emerald-800' },
    { label: 'Personas esperadas hoy', value: peopleToday._sum.partySize ?? 0, icon: Users, href: `/admin/reservas?from=${today}&to=${today}`, tone: 'bg-sky-100 text-sky-800' },
    { label: 'Consultas de eventos nuevas', value: newInquiries, icon: Inbox, href: '/admin/eventos', tone: 'bg-rose-100 text-rose-700' },
  ];

  const byDate = new Map<string, typeof upcoming>();
  for (const r of upcoming) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl">Hola 👋</h1>
        <p className="mt-1 cap1 text-cocoa-600">{formatDateLong(today)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 sm:p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${s.tone}`}><s.icon className="h-5 w-5" /></span>
            <span className="font-serif text-4xl leading-none">{s.value}</span>
            <span className="text-sm text-cocoa-600">{s.label}</span>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-3xl">Reservas de hoy</h2>
          <Link href="/admin/reservas/nueva" className="text-sm font-medium text-rose-700 hover:underline">+ Nueva reserva</Link>
        </div>
        {todayList.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-cocoa-500 ring-1 ring-cream-300">No hay reservas para hoy.</p>
        ) : (
          <div className="space-y-3">{todayList.map((r) => <ReservationRow key={r.id} r={r} />)}</div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-3xl">Próximos 7 días</h2>
          <Link href="/admin/reservas" className="text-sm font-medium text-rose-700 hover:underline">Ver todas</Link>
        </div>
        {byDate.size === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-cocoa-500 ring-1 ring-cream-300">No hay reservas en los próximos días.</p>
        ) : (
          <div className="space-y-6">
            {[...byDate.entries()].map(([date, list]) => (
              <div key={date}>
                <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider cap1 text-cocoa-500">
                  {formatDateLong(date)} · {list.reduce((n, r) => n + r.partySize, 0)} personas
                </h3>
                <div className="space-y-3">{list.map((r) => <ReservationRow key={r.id} r={r} />)}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
