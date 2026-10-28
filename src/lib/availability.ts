import type { ReservationType, Settings, Shift } from '@prisma/client';
import { db } from './db';
import { addDays, diffDays, isValidDateStr, nowInMendoza, timeToMinutes, weekdayOf } from './dates';

/** Meriendas y tardes de té solo se ofrecen en turnos de la tarde. */
export const AFTERNOON_FROM = '15:00';

/** Estados que ocupan lugar en el cupo del turno. */
export const COUNTING_STATUSES = ['PENDIENTE', 'CONFIRMADA', 'ASISTIO'] as const;

export async function getSettings(): Promise<Settings> {
  return db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export function shiftAllowedForType(startTime: string, type?: ReservationType | string) {
  if (type === 'MERIENDA' || type === 'TARDE_DE_TE') return timeToMinutes(startTime) >= timeToMinutes(AFTERNOON_FROM);
  return true;
}

export type DayCheck = { ok: true } | { ok: false; reason: string };

/** Valida que el día sea reservable (sin mirar cupos). */
export async function checkDay(date: string, settings?: Settings): Promise<DayCheck> {
  if (!isValidDateStr(date)) return { ok: false, reason: 'Fecha inválida' };
  const s = settings ?? (await getSettings());
  if (!s.reservationsOpen) return { ok: false, reason: s.closedMessage };
  const now = nowInMendoza();
  if (date < now.date) return { ok: false, reason: 'No se puede reservar en fechas pasadas' };
  if (diffDays(now.date, date) > s.maxAdvanceDays) return { ok: false, reason: `Solo tomamos reservas hasta ${s.maxAdvanceDays} días de anticipación` };
  if (!s.openWeekdays.includes(weekdayOf(date))) return { ok: false, reason: 'Ese día no atendemos (abrimos de lunes a sábado)' };
  const blocked = await db.blockedDate.findUnique({ where: { date } });
  if (blocked) return { ok: false, reason: blocked.reason ? `Cerrado: ${blocked.reason}` : 'Ese día no tomamos reservas' };
  return { ok: true };
}

export type ShiftAvailability = { id: number; time: string; capacity: number; remaining: number };

export async function getAvailability(date: string, type?: string) {
  const settings = await getSettings();
  const day = await checkDay(date, settings);
  if (!day.ok) return { open: false as const, reason: day.reason, shifts: [] as ShiftAvailability[], maxPartySize: settings.maxPartySize };

  const [shifts, used] = await Promise.all([
    db.shift.findMany({ where: { active: true }, orderBy: { startTime: 'asc' } }),
    db.reservation.groupBy({
      by: ['shiftId'],
      where: { date, status: { in: [...COUNTING_STATUSES] } },
      _sum: { partySize: true },
    }),
  ]);
  const usedMap = new Map(used.map((u) => [u.shiftId, u._sum.partySize ?? 0]));
  const now = nowInMendoza();
  const cutoff = now.minutes + settings.minAdvanceHours * 60;

  const list = shifts
    .filter((s) => shiftAllowedForType(s.startTime, type))
    .filter((s) => date > now.date || timeToMinutes(s.startTime) >= cutoff)
    .map((s) => ({ id: s.id, time: s.startTime, capacity: s.capacity, remaining: Math.max(0, s.capacity - (usedMap.get(s.id) ?? 0)) }));

  return { open: true as const, reason: undefined, shifts: list, maxPartySize: settings.maxPartySize };
}

/** Fechas deshabilitadas dentro de un rango, para el selector de fecha. */
export async function getBlockedDates() {
  const rows = await db.blockedDate.findMany({ where: { date: { gte: nowInMendoza().date } }, select: { date: true } });
  return rows.map((r) => r.date);
}

export function nextOpenDate(settings: Settings, blocked: string[], from = nowInMendoza().date) {
  for (let i = 0; i < 90; i++) {
    const d = addDays(from, i);
    if (settings.openWeekdays.includes(weekdayOf(d)) && !blocked.includes(d)) return d;
  }
  return from;
}

export type { Shift };
