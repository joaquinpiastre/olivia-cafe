'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Minus, Plus } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';
import { RESERVATION_TYPES, whatsappLink } from '@/lib/site';
import { formatDateLong } from '@/lib/dates';
import { findTeaMenu, formatPrice, type TeaMenu } from '@/lib/tardes-de-te';

type Shift = { id: number; time: string; capacity: number; remaining: number };
type Avail = { open: boolean; reason?: string; shifts: Shift[] };

type Props = {
  today: string;
  maxDate: string;
  openWeekdays: number[];
  blocked: string[];
  maxPartySize: number;
  reservationsOpen: boolean;
  closedMessage: string;
  initialType?: string;
  initialMenu?: string;
  /** Datos de las tardes de té (editables desde el panel) */
  tea: { menus: TeaMenu[]; minGuests: number; depositPct: number; schedule: string };
  meriendaOpen: boolean;
  whatsappNumber: string;
};

export function ReservationForm({ today, maxDate, openWeekdays, blocked, maxPartySize, reservationsOpen, closedMessage, initialType, initialMenu, tea, meriendaOpen, whatsappNumber }: Props) {
  const router = useRouter();
  const types = RESERVATION_TYPES.filter((t) => t.value !== 'MERIENDA' || meriendaOpen);
  const [type, setType] = useState(types.some((t) => t.value === initialType) ? initialType! : 'MESA');
  const [date, setDate] = useState('');
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [partySize, setPartySize] = useState(initialType?.toUpperCase() === 'TARDE_DE_TE' ? tea.minGuests : 2);
  const [menuId, setMenuId] = useState(initialMenu && findTeaMenu(tea.menus, initialMenu) ? initialMenu : '');
  const [avail, setAvail] = useState<Avail | null>(null);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '', website: '' });

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoadingAvail(true);
    setShiftId(null);
    fetch(`/api/disponibilidad?date=${date}&type=${type}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Avail) => !cancelled && setAvail(d))
      .catch(() => !cancelled && setAvail({ open: false, reason: 'No pudimos consultar los horarios. Probá de nuevo.', shifts: [] }))
      .finally(() => !cancelled && setLoadingAvail(false));
    return () => {
      cancelled = true;
    };
  }, [date, type]);

  const isTea = type === 'TARDE_DE_TE';
  const minParty = isTea ? tea.minGuests : 1;
  const teaMenu = findTeaMenu(tea.menus, menuId);
  const selectedShift = useMemo(() => avail?.shifts.find((s) => s.id === shiftId), [avail, shiftId]);
  const morning = avail?.shifts.filter((s) => s.time < '15:00') ?? [];
  const afternoon = avail?.shifts.filter((s) => s.time >= '15:00') ?? [];

  if (!reservationsOpen) {
    return (
      <div className="card text-center">
        <p className="font-serif text-2xl">Reservas online pausadas</p>
        <p className="mt-3 text-cocoa-600">{closedMessage}</p>
        <a href={whatsappLink('¡Hola Olivia! Quería hacer una reserva.', whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
          Reservar por WhatsApp
        </a>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!date) return setError('Elegí una fecha');
    if (!shiftId) return setError('Elegí un horario');
    if (isTea && !teaMenu) return setError('Elegí el menú de la tarde de té');
    if (isTea && partySize < tea.minGuests) return setError(`Las tardes de té se hacen a partir de ${tea.minGuests} personas`);
    const notes = teaMenu ? `Menú: ${teaMenu.name} (${formatPrice(teaMenu.price)} p/p)${form.notes.trim() ? `
${form.notes.trim()}` : ''}` : form.notes;
    setSending(true);
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, date, shiftId, partySize, ...form, notes }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'No pudimos guardar tu reserva');
        // refrescar cupos por si cambió la disponibilidad
        const r = await fetch(`/api/disponibilidad?date=${date}&type=${type}`, { cache: 'no-store' });
        setAvail(await r.json());
        setShiftId(null);
        return;
      }
      router.push(`/reservas/confirmacion?c=${data.code}`);
    } catch {
      setError('Sin conexión. Probá de nuevo o escribinos por WhatsApp.');
    } finally {
      setSending(false);
    }
  }

  const step = (n: string, title: string) => (
    <h2 className="mb-4 flex items-center gap-3 font-serif text-2xl">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose text-sm font-semibold text-white">{n}</span>
      {title}
    </h2>
  );

  const shiftButtons = (list: Shift[]) => (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {list.map((s) => {
        const full = s.remaining < partySize;
        const selected = s.id === shiftId;
        return (
          <button
            key={s.id}
            type="button"
            disabled={full}
            aria-pressed={selected}
            onClick={() => setShiftId(s.id)}
            className={`rounded-xl px-2 py-2.5 text-sm transition ${selected ? 'bg-rose text-white shadow-soft' : full ? 'cursor-not-allowed bg-cream-100 text-cocoa-400 line-through' : 'bg-white ring-1 ring-cream-300 hover:ring-rose'}`}
          >
            <span className="block font-medium">{s.time}</span>
            <span className={`block text-[0.68rem] ${selected ? 'text-rose-50' : 'text-cocoa-500'}`}>{s.remaining <= 0 ? 'Completo' : s.remaining < partySize ? `Quedan ${s.remaining}` : s.remaining <= 6 ? `¡Quedan ${s.remaining}!` : 'Disponible'}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-10" noValidate>
      <section>
        {step('1', '¿Qué querés reservar?')}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {types.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={type === t.value}
              onClick={() => {
                setType(t.value);
                if (t.value === 'TARDE_DE_TE') setPartySize((n) => Math.max(n, tea.minGuests));
              }}
              className={`rounded-2xl px-3 py-3.5 text-sm font-medium transition ${type === t.value ? 'bg-rose text-white shadow-soft' : 'bg-white ring-1 ring-cream-300 hover:ring-rose'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {type === 'EVENTO' && (
          <p className="mt-3 text-sm text-cocoa-600">
            Para eventos grandes o con candy bar, completá también la <a href="/eventos#consulta" className="text-olivia-beige underline">consulta de eventos</a> así armamos un presupuesto.
          </p>
        )}
      </section>

      {isTea && (
        <section>
          <h2 className="mb-1 font-serif text-2xl">Elegí tu menú</h2>
          <p className="mb-4 text-sm text-cocoa-600">
            Valor por persona. Todos los invitados comen el mismo menú. <a href="/tardes-de-te#menus" target="_blank" className="text-olivia-beige underline">Ver qué incluye cada uno</a>.
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {tea.menus.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={menuId === m.id}
                onClick={() => setMenuId(m.id)}
                className={`rounded-2xl px-4 py-3.5 text-left transition ${menuId === m.id ? 'bg-rose text-white shadow-soft' : 'bg-white ring-1 ring-cream-300 hover:ring-rose'}`}
              >
                <span className="block font-medium">{m.name}</span>
                <span className={`block text-sm ${menuId === m.id ? 'text-rose-50' : 'text-cocoa-500'}`}>{formatPrice(m.price)} por persona</span>
              </button>
            ))}
          </div>
          {teaMenu && (
            <div className="mt-4 rounded-2xl bg-cream-100 px-4 py-4 text-sm text-cocoa-600">
              <p><strong>Pastelería:</strong> {teaMenu.pastry.join(', ')}.</p>
              <p className="mt-1"><strong>{teaMenu.savoryTitle}:</strong> {teaMenu.savory.join(', ')}.</p>
              <p className="mt-1"><strong>Para tomar:</strong> {teaMenu.infusion}. Después, {teaMenu.secondStep.charAt(0).toLowerCase() + teaMenu.secondStep.slice(1)}.</p>
            </div>
          )}
        </section>
      )}

      <section>
        {step('2', 'Fecha y personas')}
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <DatePicker value={date} onChange={setDate} min={today} max={maxDate} openWeekdays={openWeekdays} blocked={blocked} />
          <div>
            <label className="label" htmlFor="personas">Cantidad de personas</label>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Menos personas" onClick={() => setPartySize((n) => Math.max(minParty, n - 1))} className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-cream-300 hover:ring-rose">
                <Minus className="h-5 w-5" />
              </button>
              <output id="personas" className="w-12 text-center font-serif text-3xl">{partySize}</output>
              <button type="button" aria-label="Más personas" onClick={() => setPartySize((n) => Math.min(maxPartySize, n + 1))} className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-cream-300 hover:ring-rose">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 max-w-[14rem] text-xs text-cocoa-500">{isTea ? `Desde ${tea.minGuests} personas. ` : ''}Hasta {maxPartySize} personas online. Para grupos más grandes escribinos por WhatsApp.</p>
          </div>
        </div>
        {isTea && <p className="mt-3 text-sm text-cocoa-600">Las tardes de té son de {tea.schedule} hs. Se reservan con una seña del {tea.depositPct}% y 48 a 72 hs de anticipación; te pasamos los datos para abonarla por WhatsApp.</p>}
        <p className="mt-3 text-xs text-cocoa-500">Atendemos de lunes a sábado. Los días no disponibles aparecen tachados.</p>
      </section>

      <section aria-live="polite">
        {step('3', 'Horario')}
        {!date && <p className="rounded-2xl bg-cream-100 px-4 py-5 text-center text-sm text-cocoa-500">Elegí una fecha para ver los horarios disponibles.</p>}
        {date && loadingAvail && (
          <p className="flex items-center justify-center gap-2 py-6 text-sm text-cocoa-500"><Loader2 className="h-4 w-4 animate-spin" /> Buscando horarios…</p>
        )}
        {date && !loadingAvail && avail && !avail.open && <p className="rounded-2xl bg-rose-50 px-4 py-5 text-center text-sm text-rose-700">{avail.reason}</p>}
        {date && !loadingAvail && avail?.open && avail.shifts.length === 0 && (
          <p className="rounded-2xl bg-rose-50 px-4 py-5 text-center text-sm text-rose-700">No quedan horarios para {formatDateLong(date)}. Probá con otro día.</p>
        )}
        {date && !loadingAvail && avail?.open && avail.shifts.length > 0 && (
          <div className="space-y-5">
            {morning.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-cocoa-600">Mañana</p>
                {shiftButtons(morning)}
              </div>
            )}
            {afternoon.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-cocoa-600">Tarde</p>
                {shiftButtons(afternoon)}
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        {step('4', 'Tus datos')}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Nombre y apellido</label>
            <input id="name" className="field" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Teléfono (WhatsApp)</label>
            <input id="phone" className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="261 1234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="email">Email <span className="font-normal text-cocoa-400">(opcional)</span></label>
            <input id="email" className="field" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="notes">Comentarios <span className="font-normal text-cocoa-400">(alergias, Sin TACC, decoración, cumpleaños…)</span></label>
            <textarea id="notes" className="field min-h-28" maxLength={600} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          {/* honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>No completar<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></label>
          </div>
        </div>
      </section>

      {selectedShift && (
        <div className="rounded-2xl bg-rose-50 px-5 py-4 text-sm text-cocoa-700">
          <strong className="font-serif text-lg">Tu reserva:</strong>{' '}
          {RESERVATION_TYPES.find((t) => t.value === type)?.label} · <span className="cap1">{formatDateLong(date)}</span> · {selectedShift.time} hs · {partySize} {partySize === 1 ? 'persona' : 'personas'}
          {teaMenu && (
            <p className="mt-1">
              {teaMenu.name} · Total estimado <strong>{formatPrice(teaMenu.price * partySize)}</strong> · Seña del {tea.depositPct}%: <strong>{formatPrice((teaMenu.price * partySize * tea.depositPct) / 100)}</strong>
            </p>
          )}
        </div>
      )}

      {error && <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

      <div>
        <button type="submit" disabled={sending} className="btn-primary w-full py-4 text-base sm:w-auto sm:px-12">
          {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : 'Enviar reserva'}
        </button>
        <p className="mt-3 text-xs text-cocoa-500">Tu reserva queda <strong>pendiente de confirmación</strong>. Te vamos a escribir por WhatsApp al número que dejes para confirmarla.</p>
      </div>
    </form>
  );
}
