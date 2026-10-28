import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { ChevronLeft, ChevronRight, Download, List, CalendarDays, Plus } from 'lucide-react';
import { db } from '@/lib/db';
import { setDayBlocked } from '@/app/admin/actions';
import { addDays, formatDateLong, formatMonth, todayStr, weekdayOf } from '@/lib/dates';
import { STATUS_LABEL, TYPE_LABEL } from '@/lib/site';
import { ReservationRow } from '@/components/admin/ReservationRow';

export const metadata = { title: 'Reservas' };

type SP = { view?: string; from?: string; to?: string; status?: string; type?: string; q?: string; mes?: string; dia?: string; todas?: string };
const isDate = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

function qs(params: Record<string, string | undefined>) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) u.set(k, v);
  const s = u.toString();
  return s ? `?${s}` : '';
}

export default async function ReservasPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const today = todayStr();
  const view = sp.view === 'calendario' ? 'calendario' : 'lista';

  const filterStatus = sp.status && sp.status in STATUS_LABEL ? sp.status : undefined;
  const filterType = sp.type && sp.type in TYPE_LABEL ? sp.type : undefined;

  const tabs = (
    <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-cream-300">
      <Link href={`/admin/reservas${qs({ ...sp, view: 'lista', mes: undefined, dia: undefined })}`} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${view === 'lista' ? 'bg-rose text-white' : 'text-cocoa-600'}`}><List className="h-4 w-4" /> Lista</Link>
      <Link href={`/admin/reservas${qs({ view: 'calendario', status: filterStatus, type: filterType })}`} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${view === 'calendario' ? 'bg-rose text-white' : 'text-cocoa-600'}`}><CalendarDays className="h-4 w-4" /> Calendario</Link>
    </div>
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-4xl">Reservas</h1>
      <div className="flex flex-wrap items-center gap-3">
        {tabs}
        <Link href="/admin/reservas/nueva" className="btn-primary hidden px-5 py-2.5 sm:inline-flex"><Plus className="h-4 w-4" /> Nueva</Link>
      </div>
    </div>
  );

  // ── Vista calendario ────────────────────────────────────────────────
  if (view === 'calendario') {
    const month = /^\d{4}-\d{2}$/.test(sp.mes ?? '') ? sp.mes! : today.slice(0, 7);
    const [y, m] = month.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const offset = (weekdayOf(`${month}-01`) + 6) % 7;
    const where: Prisma.ReservationWhereInput = {
      date: { gte: `${month}-01`, lte: `${month}-31` },
      status: filterStatus ? (filterStatus as Prisma.ReservationWhereInput['status']) : { not: 'CANCELADA' },
      ...(filterType ? { type: filterType as Prisma.ReservationWhereInput['type'] } : {}),
    };
    const [rows, blocked, settings] = await Promise.all([
      db.reservation.findMany({ where, orderBy: { time: 'asc' } }),
      db.blockedDate.findMany({ where: { date: { gte: `${month}-01`, lte: `${month}-31` } } }),
      db.settings.findUnique({ where: { id: 1 } }),
    ]);
    const openDays = settings?.openWeekdays ?? [1, 2, 3, 4, 5, 6];
    const blockedSet = new Set(blocked.map((b) => b.date));
    const perDay = new Map<string, { n: number; people: number; pending: number }>();
    for (const r of rows) {
      const d = perDay.get(r.date) ?? { n: 0, people: 0, pending: 0 };
      d.n++;
      d.people += r.partySize;
      if (r.status === 'PENDIENTE') d.pending++;
      perDay.set(r.date, d);
    }
    const shiftMonth = (n: number) => new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
    const selected = isDate(sp.dia) ? sp.dia! : undefined;
    const dayList = selected ? rows.filter((r) => r.date === selected) : [];

    return (
      <div className="space-y-6">
        {header}
        <div className="card p-3 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Link aria-label="Mes anterior" href={`/admin/reservas${qs({ view: 'calendario', mes: shiftMonth(-1), status: filterStatus, type: filterType })}`} className="rounded-full p-2 hover:bg-cream-100"><ChevronLeft /></Link>
            <h2 className="text-2xl cap1 sm:text-3xl">{formatMonth(month)}</h2>
            <Link aria-label="Mes siguiente" href={`/admin/reservas${qs({ view: 'calendario', mes: shiftMonth(1), status: filterStatus, type: filterType })}`} className="rounded-full p-2 hover:bg-cream-100"><ChevronRight /></Link>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-cocoa-500 sm:gap-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => <span key={d} className="py-1">{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, '0')}`;
              const info = perDay.get(date);
              const closed = !openDays.includes(weekdayOf(date)) || blockedSet.has(date);
              const isSel = date === selected;
              return (
                <Link
                  key={date}
                  href={`/admin/reservas${qs({ view: 'calendario', mes: month, dia: date, status: filterStatus, type: filterType })}`}
                  className={`flex min-h-[3.75rem] flex-col items-center justify-start rounded-xl p-1 text-sm transition sm:min-h-[5.5rem] sm:p-2 ${isSel ? 'bg-rose text-white' : closed ? 'bg-cream-100 text-cocoa-400' : info ? 'bg-rose-50 ring-1 ring-rose-200 hover:bg-rose-100' : 'ring-1 ring-cream-200 hover:bg-cream-100'} ${date === today && !isSel ? 'outline outline-2 outline-rose' : ''}`}
                >
                  <span className="font-medium">{i + 1}</span>
                  {info && <span className={`mt-1 rounded-full px-1.5 text-[0.65rem] font-semibold sm:text-xs ${isSel ? 'bg-white text-rose-700' : 'bg-rose text-white'}`}>{info.n}<span className="hidden sm:inline"> res.</span></span>}
                  {info && <span className={`hidden text-[0.7rem] sm:block ${isSel ? 'text-rose-50' : 'text-cocoa-500'}`}>{info.people} pers.{info.pending ? ` · ${info.pending} pend.` : ''}</span>}
                  {blockedSet.has(date) && <span className="mt-1 text-[0.6rem] uppercase">bloq.</span>}
                </Link>
              );
            })}
          </div>
        </div>
        {selected && (
          <section>
            <h2 className="mb-3 text-2xl cap1">{formatDateLong(selected)}</h2>
            {(() => {
              const b = blocked.find((x) => x.date === selected);
              return b ? (
                <form action={setDayBlocked} className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100">
                  <input type="hidden" name="date" value={selected} />
                  <input type="hidden" name="intent" value="unblock" />
                  <p className="text-sm text-rose-700"><strong>Día bloqueado</strong>{b.reason ? ` · ${b.reason}` : ''}. No se puede reservar online.</p>
                  <button className="btn-outline !px-4 !py-1.5">Desbloquear</button>
                </form>
              ) : selected >= today ? (
                <form action={setDayBlocked} className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-cream-300">
                  <input type="hidden" name="date" value={selected} />
                  <input type="hidden" name="intent" value="block" />
                  <div className="min-w-0 flex-1">
                    <label className="label" htmlFor="block-reason">Bloquear este día (opcional: motivo)</label>
                    <input id="block-reason" name="reason" className="field !py-2" placeholder="Feriado, evento privado…" maxLength={120} />
                  </div>
                  <button className="btn-primary !px-5 !py-2.5">Bloquear día</button>
                </form>
              ) : null;
            })()}
            {dayList.length === 0 ? (
              <p className="rounded-2xl bg-white p-6 text-center text-cocoa-500 ring-1 ring-cream-300">Sin reservas este día.</p>
            ) : (
              <div className="space-y-3">{dayList.map((r) => <ReservationRow key={r.id} r={r} />)}</div>
            )}
          </section>
        )}
      </div>
    );
  }

  // ── Vista lista ─────────────────────────────────────────────────────
  const submitted = sp.from !== undefined; // el formulario de filtros siempre envía "from" (puede ir vacío)
  const from = isDate(sp.from) ? sp.from! : sp.todas || submitted ? undefined : isDate(sp.to) ? undefined : today;
  const to = isDate(sp.to) ? sp.to! : undefined;
  const q = (sp.q ?? '').trim();
  const where: Prisma.ReservationWhereInput = {
    ...(from || to ? { date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    ...(filterStatus ? { status: filterStatus as Prisma.ReservationWhereInput['status'] } : {}),
    ...(filterType ? { type: filterType as Prisma.ReservationWhereInput['type'] } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }, { code: { contains: q.toUpperCase() } }] } : {}),
  };
  const rows = await db.reservation.findMany({ where, orderBy: [{ date: from || !to ? 'asc' : 'desc' }, { time: 'asc' }], take: 400 });

  const byDate = new Map<string, typeof rows>();
  for (const r of rows) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]);

  const exportQs = qs({ from, to, status: filterStatus, type: filterType });
  const quick = [
    { label: 'Hoy', href: qs({ from: today, to: today }) },
    { label: 'Mañana', href: qs({ from: addDays(today, 1), to: addDays(today, 1) }) },
    { label: 'Próx. 7 días', href: qs({ from: today, to: addDays(today, 7) }) },
    { label: 'Desde hoy', href: '' },
    { label: 'Todas', href: qs({ todas: '1' }) },
  ];

  return (
    <div className="space-y-6">
      {header}

      <div className="flex flex-wrap gap-2">
        {quick.map((c) => (
          <Link key={c.label} href={`/admin/reservas${c.href}`} className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-cream-300 hover:ring-rose">{c.label}</Link>
        ))}
      </div>

      <form method="get" className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div><label className="label" htmlFor="f-from">Desde</label><input id="f-from" type="date" name="from" defaultValue={from} className="field !py-2" /></div>
        <div><label className="label" htmlFor="f-to">Hasta</label><input id="f-to" type="date" name="to" defaultValue={to} className="field !py-2" /></div>
        <div>
          <label className="label" htmlFor="f-status">Estado</label>
          <select id="f-status" name="status" defaultValue={filterStatus ?? ''} className="field !py-2">
            <option value="">Todos</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="f-type">Tipo</label>
          <select id="f-type" name="type" defaultValue={filterType ?? ''} className="field !py-2">
            <option value="">Todos</option>
            {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1"><label className="label" htmlFor="f-q">Buscar</label><input id="f-q" name="q" defaultValue={q} placeholder="Nombre, tel. o código" className="field !py-2" /></div>
        <div className="flex items-end gap-2">
          <button className="btn-primary w-full !py-2.5">Filtrar</button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cocoa-600">{rows.length} {rows.length === 1 ? 'reserva' : 'reservas'} · {rows.filter((r) => r.status !== 'CANCELADA').reduce((n, r) => n + r.partySize, 0)} personas (sin canceladas)</p>
        <div className="flex gap-2">
          <a href={`/api/admin/export${exportQs ? exportQs + '&' : '?'}format=xlsx`} className="btn-outline !px-4 !py-2"><Download className="h-4 w-4" /> Excel</a>
          <a href={`/api/admin/export${exportQs ? exportQs + '&' : '?'}format=csv`} className="btn-outline !px-4 !py-2"><Download className="h-4 w-4" /> CSV</a>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-cocoa-500 ring-1 ring-cream-300">No hay reservas con esos filtros.</p>
      ) : (
        <div className="space-y-7">
          {[...byDate.entries()].map(([date, list]) => (
            <section key={date}>
              <h2 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider cap1 text-cocoa-500">
                {formatDateLong(date)} · {list.filter((r) => r.status !== 'CANCELADA').reduce((n, r) => n + r.partySize, 0)} personas
              </h2>
              <div className="space-y-3">{list.map((r) => <ReservationRow key={r.id} r={r} />)}</div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
