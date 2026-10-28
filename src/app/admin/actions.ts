'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { createSession, destroySession, requireAdmin } from '@/lib/auth';
import { createReservation } from '@/lib/reservations';
import { firstError, reservationSchema } from '@/lib/validators';
import { isValidDateStr } from '@/lib/dates';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { slugify } from '@/lib/menu';
import { CONTENT_TAG } from '@/lib/content';
import { DEFAULTS, getSchema, isContentKey, sanitize } from '@/lib/content-schemas';

export type FormState = { ok?: boolean; error?: string; message?: string };

const STATUSES = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ASISTIO', 'NO_VINO'] as const;
const INQUIRY_STATUSES = ['NUEVA', 'CONTACTADA', 'CERRADA'] as const;
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const refresh = () => revalidatePath('/admin', 'layout');

// ── Sesión ────────────────────────────────────────────────────────────

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) return { error: 'Demasiados intentos. Esperá unos minutos.' };
  const username = str(fd, 'username').toLowerCase();
  const password = String(fd.get('password') ?? '');
  const user = username ? await db.adminUser.findUnique({ where: { username } }) : null;
  // Se compara siempre contra un hash para que el tiempo de respuesta no revele si el usuario existe
  const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
  const valid = await bcrypt.compare(password, hash);
  if (!user || !valid) return { error: 'Usuario o contraseña incorrectos' };
  await createSession(user);
  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePasswordAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const current = String(fd.get('current') ?? '');
  const next = String(fd.get('next') ?? '');
  if (next.length < 8) return { error: 'La nueva contraseña debe tener al menos 8 caracteres' };
  if (next !== String(fd.get('confirm') ?? '')) return { error: 'Las contraseñas no coinciden' };
  const user = await db.adminUser.findUnique({ where: { id: session.uid } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: 'La contraseña actual es incorrecta' };
  await db.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: true, message: 'Contraseña actualizada' };
}

// ── Reservas ──────────────────────────────────────────────────────────

export async function setReservationStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id');
  const status = str(fd, 'status');
  if (!id || !(STATUSES as readonly string[]).includes(status)) return;
  await db.reservation.update({ where: { id }, data: { status: status as (typeof STATUSES)[number] } });
  refresh();
}

export async function deleteReservation(fd: FormData) {
  await requireAdmin();
  await db.reservation.delete({ where: { id: str(fd, 'id') } });
  refresh();
  redirect('/admin/reservas');
}

export async function createManualReservation(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = reservationSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { website: _w, ...data } = parsed.data;
  const status = str(fd, 'status');
  const result = await createReservation(data, {
    source: 'MANUAL',
    admin: true,
    status: (STATUSES as readonly string[]).includes(status) ? (status as (typeof STATUSES)[number]) : 'CONFIRMADA',
  });
  if (!result.ok) return { error: result.error };
  refresh();
  redirect(`/admin/reservas/${result.reservation.id}`);
}

export async function updateReservation(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, 'id');
  const parsed = reservationSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const d = parsed.data;
  const shift = await db.shift.findUnique({ where: { id: d.shiftId } });
  if (!shift) return { error: 'Turno inexistente' };
  await db.reservation.update({
    where: { id },
    data: {
      type: d.type,
      date: d.date,
      time: shift.startTime,
      shiftId: shift.id,
      partySize: d.partySize,
      name: d.name,
      phone: d.phone,
      email: d.email ?? null,
      notes: d.notes ?? null,
      adminNotes: str(fd, 'adminNotes') || null,
    },
  });
  refresh();
  return { ok: true, message: 'Cambios guardados' };
}

// ── Consultas de eventos ──────────────────────────────────────────────

export async function updateInquiry(fd: FormData) {
  await requireAdmin();
  const status = str(fd, 'status');
  await db.eventInquiry.update({
    where: { id: str(fd, 'id') },
    data: {
      ...((INQUIRY_STATUSES as readonly string[]).includes(status) ? { status: status as (typeof INQUIRY_STATUSES)[number] } : {}),
      adminNotes: str(fd, 'adminNotes') || null,
    },
  });
  refresh();
}

export async function deleteInquiry(fd: FormData) {
  await requireAdmin();
  await db.eventInquiry.delete({ where: { id: str(fd, 'id') } });
  refresh();
}

// ── Configuración ─────────────────────────────────────────────────────

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const num = (k: string, min: number, max: number) => Math.min(max, Math.max(min, parseInt(str(fd, k), 10) || min));
  const weekdays = fd.getAll('weekday').map(Number).filter((n) => n >= 0 && n <= 6);
  await db.settings.upsert({
    where: { id: 1 },
    update: {
      reservationsOpen: fd.get('reservationsOpen') === 'on',
      closedMessage: str(fd, 'closedMessage') || undefined,
      maxPartySize: num('maxPartySize', 1, 100),
      minAdvanceHours: num('minAdvanceHours', 0, 72),
      maxAdvanceDays: num('maxAdvanceDays', 1, 365),
      openWeekdays: weekdays,
    },
    create: { id: 1 },
  });
  refresh();
  return { ok: true, message: 'Configuración guardada' };
}

export async function addShift(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const startTime = str(fd, 'startTime');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) return { error: 'Horario inválido' };
  const capacity = Math.min(500, Math.max(1, parseInt(str(fd, 'capacity'), 10) || 20));
  const exists = await db.shift.findUnique({ where: { startTime } });
  if (exists) return { error: 'Ya existe un turno a esa hora' };
  await db.shift.create({ data: { startTime, capacity } });
  refresh();
  return { ok: true, message: 'Turno agregado' };
}

export async function updateShift(fd: FormData) {
  await requireAdmin();
  const capacity = Math.min(500, Math.max(1, parseInt(str(fd, 'capacity'), 10) || 20));
  await db.shift.update({ where: { id: Number(str(fd, 'id')) }, data: { capacity, active: fd.get('active') === 'on' } });
  refresh();
}

export async function deleteShift(fd: FormData) {
  await requireAdmin();
  const id = Number(str(fd, 'id'));
  const count = await db.reservation.count({ where: { shiftId: id } });
  // Si ya tiene reservas se desactiva en lugar de borrarse (no se pierde el historial)
  if (count > 0) await db.shift.update({ where: { id }, data: { active: false } });
  else await db.shift.delete({ where: { id } });
  refresh();
}

export async function addBlockedDate(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const date = str(fd, 'date');
  if (!isValidDateStr(date)) return { error: 'Fecha inválida' };
  await db.blockedDate.upsert({ where: { date }, update: { reason: str(fd, 'reason') }, create: { date, reason: str(fd, 'reason') } });
  refresh();
  return { ok: true, message: 'Día bloqueado' };
}

/** Bloquea o desbloquea un día desde el calendario de reservas. */
export async function setDayBlocked(fd: FormData) {
  await requireAdmin();
  const date = str(fd, 'date');
  if (!isValidDateStr(date)) return;
  if (str(fd, 'intent') === 'unblock') await db.blockedDate.deleteMany({ where: { date } });
  else await db.blockedDate.upsert({ where: { date }, update: { reason: str(fd, 'reason') }, create: { date, reason: str(fd, 'reason') } });
  refresh();
}

export async function removeBlockedDate(fd: FormData) {
  await requireAdmin();
  await db.blockedDate.delete({ where: { id: Number(str(fd, 'id')) } });
  refresh();
}

// ── Carta ─────────────────────────────────────────────────────────────

const refreshMenu = () => {
  revalidatePath('/menu');
  refresh();
};

/** Textos de la página pública /menu. */
export async function saveMenuTexts(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  await db.settings.upsert({
    where: { id: 1 },
    update: {
      menuEyebrow: str(fd, 'menuEyebrow').slice(0, 60),
      menuTitle: str(fd, 'menuTitle').slice(0, 80) || 'Nuestra carta',
      menuScript: str(fd, 'menuScript').slice(0, 60),
      menuDescription: str(fd, 'menuDescription').slice(0, 300),
      menuNote: str(fd, 'menuNote').slice(0, 200),
    },
    create: { id: 1 },
  });
  refreshMenu();
  return { ok: true, message: 'Textos guardados' };
}

/** Nombre de la pestaña y texto alternativo de una página. */
export async function updateMenuPage(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const slug = str(fd, 'slug');
  const title = str(fd, 'title').slice(0, 40);
  const alt = str(fd, 'alt').slice(0, 300);
  if (!title) return { error: 'El nombre no puede quedar vacío' };
  if (!alt) return { error: 'El texto alternativo no puede quedar vacío' };
  const exists = await db.menuPage.findUnique({ where: { slug } });
  if (!exists) return { error: 'Página inexistente' };
  await db.menuPage.update({ where: { slug }, data: { title, alt } });
  refreshMenu();
  return { ok: true, message: 'Guardado' };
}

export async function addMenuPage(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, 'title').slice(0, 40);
  if (!title) return { error: 'Ponele un nombre a la página (ej. "Desayunos")' };
  const base = `carta-${slugify(title) || 'pagina'}`;
  let slug = base;
  for (let n = 2; await db.menuPage.findUnique({ where: { slug } }); n++) slug = `${base}-${n}`;
  const last = await db.menuPage.aggregate({ _max: { sortOrder: true } });
  await db.menuPage.create({
    data: { slug, title, alt: `Carta de Olivia Pastelería y Café: ${title}, con precios`, sortOrder: (last._max.sortOrder ?? 0) + 1, visible: true },
  });
  refreshMenu();
  return { ok: true, message: 'Página agregada. Subile la imagen de la carta.' };
}

/** Sube o baja una página en el orden (el orden del panel es el de las pestañas en la web). */
export async function moveMenuPage(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, 'slug');
  const dir = str(fd, 'dir') === 'up' ? -1 : 1;
  const pages = await db.menuPage.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }], select: { slug: true, sortOrder: true } });
  const i = pages.findIndex((p) => p.slug === slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= pages.length) return;
  const clean = pages.every((p, idx) => p.sortOrder === idx + 1);
  if (clean) {
    // caso normal: se intercambian solo las dos páginas involucradas
    await db.$transaction([
      db.menuPage.update({ where: { slug: pages[i].slug }, data: { sortOrder: pages[j].sortOrder } }),
      db.menuPage.update({ where: { slug: pages[j].slug }, data: { sortOrder: pages[i].sortOrder } }),
    ]);
  } else {
    // hay huecos o repetidos (por ejemplo después de borrar una página): se reasigna 1..n
    [pages[i], pages[j]] = [pages[j], pages[i]];
    await db.$transaction(pages.map((p, idx) => db.menuPage.update({ where: { slug: p.slug }, data: { sortOrder: idx + 1 } })));
  }
  refreshMenu();
}

export async function toggleMenuPage(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, 'slug');
  const page = await db.menuPage.findUnique({ where: { slug } });
  if (!page) return;
  await db.menuPage.update({ where: { slug }, data: { visible: !page.visible } });
  refreshMenu();
}

export async function deleteMenuPage(fd: FormData) {
  await requireAdmin();
  await db.menuPage.deleteMany({ where: { slug: str(fd, 'slug') } });
  refreshMenu();
}

// ── Contenido del sitio (menús, precios, datos del local…) ────────────

const refreshContent = () => {
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
};

export async function saveContent(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const key = str(fd, 'key');
  if (!isContentKey(key)) return { error: 'Sección inexistente' };
  let raw: unknown;
  try {
    raw = JSON.parse(String(fd.get('data') ?? ''));
  } catch {
    return { error: 'No pudimos leer los datos. Recargá la página e intentá de nuevo.' };
  }
  const data = sanitize(getSchema(key), raw, DEFAULTS[key] as unknown as Record<string, unknown>);
  await db.siteContent.upsert({ where: { key }, update: { data: data as object }, create: { key, data: data as object } });
  refreshContent();
  return { ok: true, message: 'Guardado. Ya se ve en la web.' };
}

/** Vuelve una sección a los valores originales (borra lo guardado). */
export async function resetContent(fd: FormData) {
  await requireAdmin();
  const key = str(fd, 'key');
  if (!isContentKey(key)) return;
  await db.siteContent.deleteMany({ where: { key } });
  refreshContent();
}
