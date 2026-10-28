import type { Reservation, ReservationSource, ReservationStatus } from '@prisma/client';
import { db, isTransientDbError } from './db';
import { checkDay, COUNTING_STATUSES, getSettings, shiftAllowedForType } from './availability';
import { nowInMendoza, timeToMinutes } from './dates';
import { getContent } from './content';
import type { ReservationInput } from './validators';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeCode() {
  let s = '';
  for (let i = 0; i < 4; i++) s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return `OLV-${s}`;
}

export type CreateResult = { ok: true; reservation: Reservation } | { ok: false; error: string };

/**
 * Crea una reserva validando día, turno y cupo. Usa un lock por turno+fecha para que dos pedidos
 * simultáneos no sobrepasen el cupo.
 * `admin: true` (reserva manual) saltea las reglas de anticipación/cupo y permite elegir el estado.
 */
export async function createReservation(
  input: Omit<ReservationInput, 'website'>,
  opts: { source: ReservationSource; admin?: boolean; status?: ReservationStatus },
): Promise<CreateResult> {
  const settings = await getSettings();
  const shift = await db.shift.findUnique({ where: { id: input.shiftId } });
  if (!shift || !shift.active) return { ok: false, error: 'El horario elegido no está disponible' };

  if (!opts.admin) {
    const day = await checkDay(input.date, settings);
    if (!day.ok) return { ok: false, error: day.reason };
    if (!shiftAllowedForType(shift.startTime, input.type)) return { ok: false, error: 'Ese tipo de reserva solo está disponible por la tarde' };
    if (input.partySize > settings.maxPartySize)
      return { ok: false, error: `Para más de ${settings.maxPartySize} personas escribinos por WhatsApp o usá la consulta de eventos` };
    if (input.type === 'TARDE_DE_TE') {
      const tea = await getContent('tardes-de-te');
      if (input.partySize < tea.minGuests)
        return { ok: false, error: `Las tardes de té se hacen a partir de ${tea.minGuests} personas. Para menos, reservá una mesa.` };
    }
    if (input.type === 'MERIENDA' && !(await getContent('meriendas')).reservable)
      return { ok: false, error: 'Por el momento no hay meriendas libres para reservar. Escribinos por WhatsApp y te avisamos la próxima fecha.' };
    const now = nowInMendoza();
    if (input.date === now.date && timeToMinutes(shift.startTime) < now.minutes + settings.minAdvanceHours * 60)
      return { ok: false, error: 'Ese horario ya no está disponible para hoy' };
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${input.date}|${shift.id}`}))`;
        if (!opts.admin) {
          const agg = await tx.reservation.aggregate({
            _sum: { partySize: true },
            where: { date: input.date, shiftId: shift.id, status: { in: [...COUNTING_STATUSES] } },
          });
          const remaining = shift.capacity - (agg._sum.partySize ?? 0);
          if (input.partySize > remaining) {
            return { ok: false as const, error: remaining <= 0 ? 'Ese horario ya está completo. Probá con otro.' : `En ese horario quedan lugares para ${remaining} ${remaining === 1 ? 'persona' : 'personas'}. Elegí otro horario o menos personas.` };
          }
        }
        const reservation = await tx.reservation.create({
          data: {
            code: makeCode(),
            type: input.type,
            date: input.date,
            time: shift.startTime,
            shiftId: shift.id,
            partySize: input.partySize,
            name: input.name,
            phone: input.phone,
            email: input.email,
            notes: input.notes,
            source: opts.source,
            status: opts.status ?? 'PENDIENTE',
          },
        });
        return { ok: true as const, reservation };
      });
    } catch (e: unknown) {
      // colisión de código (P2002) → reintentar con otro código
      if (typeof e === 'object' && e && 'code' in e && (e as { code: string }).code === 'P2002') continue;
      // corte transitorio de conexión con la base: se vuelve a intentar toda la transacción
      if (isTransientDbError(e)) continue;
      console.error('createReservation', e);
      return { ok: false, error: 'No pudimos guardar tu reserva. Probá de nuevo en un momento.' };
    }
  }
  return { ok: false, error: 'No pudimos guardar tu reserva. Probá de nuevo en un momento.' };
}
