import { Trash2 } from 'lucide-react';
import { db } from '@/lib/db';
import { getSettings } from '@/lib/availability';
import { addDays, formatDateLong, todayStr, WEEKDAY_NAMES } from '@/lib/dates';
import { addBlockedDate, addShift, changePasswordAction, deleteShift, removeBlockedDate, saveSettings, updateShift } from '@/app/admin/actions';
import { ActionForm } from '@/components/admin/ActionForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { DateField } from '@/components/ui/DatePicker';

export const metadata = { title: 'Configuración' };

export default async function ConfiguracionPage() {
  const today = todayStr();
  const [settings, shifts, allBlocked, counts] = await Promise.all([
    getSettings(),
    db.shift.findMany({ orderBy: { startTime: 'asc' } }),
    db.blockedDate.findMany({ orderBy: { date: 'asc' } }),
    db.reservation.groupBy({ by: ['shiftId'], _count: true }),
  ]);
  const blocked = allBlocked.filter((b) => b.date >= today);
  const pastBlocked = allBlocked.filter((b) => b.date < today).reverse();
  const used = new Map(counts.map((c) => [c.shiftId, c._count]));

  return (
    <div className="space-y-10">
      <h1 className="text-4xl">Configuración</h1>

      <section className="card sm:p-8">
        <h2 className="text-2xl">Reservas online</h2>
        <ActionForm action={saveSettings} submitLabel="Guardar" className="mt-5 space-y-5">
          <label className="flex items-start gap-3 rounded-xl bg-cream-100 p-4">
            <input type="checkbox" name="reservationsOpen" defaultChecked={settings.reservationsOpen} className="mt-1 h-5 w-5 accent-rose" />
            <span>
              <strong className="block">Reservas abiertas</strong>
              <span className="text-sm text-cocoa-600">Si lo desmarcás, el formulario de la web muestra el mensaje de abajo y no recibe reservas.</span>
            </span>
          </label>
          <div>
            <label className="label" htmlFor="closedMessage">Mensaje cuando están cerradas</label>
            <input id="closedMessage" name="closedMessage" className="field" defaultValue={settings.closedMessage} maxLength={300} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="maxPartySize">Máx. personas por reserva</label>
              <input id="maxPartySize" name="maxPartySize" type="number" min={1} max={100} defaultValue={settings.maxPartySize} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="minAdvanceHours">Anticipación mínima (horas)</label>
              <input id="minAdvanceHours" name="minAdvanceHours" type="number" min={0} max={72} defaultValue={settings.minAdvanceHours} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="maxAdvanceDays">Reservar hasta (días)</label>
              <input id="maxAdvanceDays" name="maxAdvanceDays" type="number" min={1} max={365} defaultValue={settings.maxAdvanceDays} className="field" />
            </div>
          </div>
          <fieldset>
            <legend className="label">Días que se puede reservar</legend>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <label key={d} className="cursor-pointer">
                  <input type="checkbox" name="weekday" value={d} defaultChecked={settings.openWeekdays.includes(d)} className="peer sr-only" />
                  <span className="block rounded-full bg-white px-4 py-2 text-sm ring-1 ring-cream-300 peer-checked:bg-rose peer-checked:text-white peer-checked:ring-rose peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-rose-600">{WEEKDAY_NAMES[d]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </ActionForm>
      </section>

      <section className="card sm:p-8">
        <h2 className="text-2xl">Turnos y cupos</h2>
        <p className="mt-1 text-sm text-cocoa-600">Cada turno tiene un cupo máximo de personas. Las reservas pendientes y confirmadas descuentan cupo.</p>
        <div className="mt-5 divide-y divide-cream-200">
          {shifts.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3 py-3">
              <form action={updateShift} className="flex flex-1 flex-wrap items-center gap-3">
                <input type="hidden" name="id" value={s.id} />
                <span className="w-16 font-serif text-2xl">{s.startTime}</span>
                <label className="flex items-center gap-2 text-sm">
                  Cupo
                  <input name="capacity" type="number" min={1} max={500} defaultValue={s.capacity} className="field !w-24 !py-2" aria-label={`Cupo del turno ${s.startTime}`} />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={s.active} className="h-5 w-5 accent-rose" /> Activo
                </label>
                <button className="btn-outline !px-4 !py-2">Guardar</button>
              </form>
              <form action={deleteShift}>
                <input type="hidden" name="id" value={s.id} />
                <DeleteButton message={used.get(s.id) ? 'Este turno ya tiene reservas: se va a desactivar (no se borra el historial). ¿Continuar?' : '¿Eliminar este turno?'} className="rounded-full p-2 text-rose-700 hover:bg-rose-50">
                  <Trash2 className="h-5 w-5" aria-label={`Eliminar turno ${s.startTime}`} />
                </DeleteButton>
              </form>
            </div>
          ))}
        </div>
        <ActionForm action={addShift} resetOnSuccess submitLabel="Agregar turno" className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl bg-cream-100 p-4" buttonClassName="btn-primary !py-2.5">
          <div>
            <label className="label" htmlFor="startTime">Nuevo turno (hora)</label>
            <input id="startTime" name="startTime" type="time" required className="field !w-36 !py-2" />
          </div>
          <div>
            <label className="label" htmlFor="newCapacity">Cupo</label>
            <input id="newCapacity" name="capacity" type="number" min={1} max={500} defaultValue={20} className="field !w-24 !py-2" />
          </div>
        </ActionForm>
      </section>

      <section className="card sm:p-8">
        <h2 className="text-2xl">Días bloqueados</h2>
        <p className="mt-1 text-sm text-cocoa-600">Feriados, eventos privados, vacaciones… No se podrá reservar online esos días.</p>
        <h3 className="mt-6 font-sans text-sm font-semibold uppercase tracking-wider text-cocoa-500">Bloqueados actualmente ({blocked.length})</h3>
        {blocked.length === 0 ? (
          <p className="mt-3 rounded-xl bg-cream-100 px-4 py-4 text-sm text-cocoa-500">No hay días bloqueados. Todos los días de atención están abiertos a reservas.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {blocked.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100">
                <span><strong className="cap1">{formatDateLong(b.date)}</strong>{b.reason && <span className="text-cocoa-600"> · {b.reason}</span>}</span>
                <form action={removeBlockedDate}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="btn-outline !px-4 !py-1.5">Desbloquear</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        {pastBlocked.length > 0 && (
          <details className="mt-3 text-sm text-cocoa-500">
            <summary className="cursor-pointer">Ver días bloqueados anteriores ({pastBlocked.length})</summary>
            <ul className="mt-2 space-y-1">
              {pastBlocked.map((b) => (
                <li key={b.id} className="cap1">{formatDateLong(b.date)}{b.reason && ` · ${b.reason}`}</li>
              ))}
            </ul>
          </details>
        )}
        <ActionForm action={addBlockedDate} resetOnSuccess submitLabel="Bloquear día" className="mt-8 grid gap-4 border-t border-cream-200 pt-6 md:grid-cols-[auto_1fr]">
          <div className="md:w-80">
            <span className="label">Fecha a bloquear</span>
            <DateField name="date" min={today} max={addDays(today, 400)} blocked={blocked.map((b) => b.date)} />
          </div>
          <div>
            <label className="label" htmlFor="reason">Motivo (opcional)</label>
            <input id="reason" name="reason" className="field" placeholder="Feriado, evento privado…" maxLength={120} />
          </div>
        </ActionForm>
      </section>

      <section className="card sm:p-8">
        <h2 className="text-2xl">Cambiar contraseña</h2>
        <ActionForm action={changePasswordAction} submitLabel="Cambiar contraseña" className="mt-5 grid max-w-md gap-4">
          <div>
            <label className="label" htmlFor="current">Contraseña actual</label>
            <input id="current" name="current" type="password" autoComplete="current-password" className="field" required />
          </div>
          <div>
            <label className="label" htmlFor="next">Nueva contraseña (mín. 8 caracteres)</label>
            <input id="next" name="next" type="password" autoComplete="new-password" minLength={8} className="field" required />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Repetir nueva contraseña</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} className="field" required />
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
