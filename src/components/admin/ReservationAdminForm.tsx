'use client';

import { useEffect, useState } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { RESERVATION_TYPES, STATUS_LABEL } from '@/lib/site';
import { addDays } from '@/lib/dates';
import { createManualReservation, updateReservation } from '@/app/admin/actions';
import { ActionForm } from './ActionForm';

type ShiftOpt = { id: number; startTime: string; active: boolean };
type Initial = {
  id?: string;
  type: string;
  date: string;
  shiftId?: number | null;
  partySize: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  adminNotes: string;
};

export function ReservationAdminForm({ mode, shifts, today, initial }: { mode: 'create' | 'edit'; shifts: ShiftOpt[]; today: string; initial?: Initial }) {
  const [date, setDate] = useState(initial?.date ?? today);
  const [type, setType] = useState(initial?.type ?? 'MESA');
  const [shiftId, setShiftId] = useState<number | ''>(initial?.shiftId ?? '');
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (!date || !shiftId) return setHint('');
    let cancelled = false;
    fetch(`/api/disponibilidad?date=${date}&type=${type}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d.open) return setHint(`Ese día figura como no disponible online (${d.reason}). Se carga igual porque es una reserva manual.`);
        const s = d.shifts.find((x: { id: number }) => x.id === shiftId);
        setHint(s ? `En ese turno quedan ${s.remaining} de ${s.capacity} lugares.` : 'Ese turno no está disponible online para este tipo/día (se carga igual).');
      })
      .catch(() => setHint(''));
    return () => {
      cancelled = true;
    };
  }, [date, shiftId, type]);

  const list = shifts.filter((s) => s.active || s.id === initial?.shiftId);

  return (
    <ActionForm action={mode === 'create' ? createManualReservation : updateReservation} submitLabel={mode === 'create' ? 'Crear reserva' : 'Guardar cambios'} className="space-y-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <div className="lg:w-80">
          <span className="label">Fecha</span>
          <DatePicker name="date" value={date} onChange={setDate} min={addDays(today, -60)} max={addDays(today, 400)} />
        </div>
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="type">Tipo</label>
            <select id="type" name="type" className="field" value={type} onChange={(e) => setType(e.target.value)}>
              {RESERVATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="shiftId">Horario</label>
            <select id="shiftId" name="shiftId" className="field" required value={shiftId} onChange={(e) => setShiftId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Elegir…</option>
              {list.map((s) => <option key={s.id} value={s.id}>{s.startTime}{s.active ? '' : ' (inactivo)'}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="partySize">Personas</label>
            <input id="partySize" name="partySize" type="number" inputMode="numeric" min={1} max={200} className="field" defaultValue={initial?.partySize ?? 2} required />
          </div>
          {mode === 'create' && (
            <div>
              <label className="label" htmlFor="status">Estado inicial</label>
              <select id="status" name="status" className="field" defaultValue="CONFIRMADA">
                {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          )}
          {hint && <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 sm:col-span-2">{hint}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Nombre</label>
          <input id="name" name="name" className="field" defaultValue={initial?.name} required />
        </div>
        <div>
          <label className="label" htmlFor="phone">Teléfono (WhatsApp)</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" className="field" defaultValue={initial?.phone} placeholder="261 1234567" required />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="email">Email (opcional)</label>
          <input id="email" name="email" type="email" className="field" defaultValue={initial?.email} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">Comentarios del cliente</label>
          <textarea id="notes" name="notes" className="field min-h-24" maxLength={600} defaultValue={initial?.notes} placeholder="Alergias, Sin TACC, decoración…" />
        </div>
        {mode === 'edit' && (
          <div className="sm:col-span-2">
            <label className="label" htmlFor="adminNotes">Notas internas (no las ve el cliente)</label>
            <textarea id="adminNotes" name="adminNotes" className="field min-h-24" defaultValue={initial?.adminNotes} />
          </div>
        )}
      </div>
    </ActionForm>
  );
}
