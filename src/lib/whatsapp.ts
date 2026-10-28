import { formatDateLong } from './dates';
import { TYPE_LABEL } from './site';

/** Normaliza un teléfono argentino al formato de wa.me (549 + área + número, sin 0 ni 15). */
export function normalizePhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('54')) {
    d = d.slice(2);
    if (d.startsWith('9')) d = d.slice(1);
  }
  if (d.startsWith('0')) d = d.slice(1);
  // área (2 a 4 dígitos) + 15 + número  →  área + número
  const m = d.match(/^(\d{2,4})15(\d{6,8})$/);
  if (m && m[1].length + m[2].length === 10) d = m[1] + m[2];
  if (d.length === 10) return `549${d}`;
  return d.length >= 11 ? d : `54${d}`;
}

export function waUrl(phone: string, text: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

type R = { name: string; date: string; time: string; partySize: number; type: string; code: string };

const first = (name: string) => name.trim().split(/\s+/)[0];

export const WA_TEMPLATES = {
  confirmacion: (r: R) =>
    `¡Hola ${first(r.name)}! 💗 Te confirmamos tu reserva en Olivia Pastelería y Café:\n\n📅 ${formatDateLong(r.date)}\n🕐 ${r.time} hs\n👥 ${r.partySize} ${r.partySize === 1 ? 'persona' : 'personas'}\n🍰 ${TYPE_LABEL[r.type] ?? r.type}\n\nTe esperamos en Av. Godoy Cruz 506. ¡Gracias!`,
  recordatorio: (r: R) =>
    `¡Hola ${first(r.name)}! ☕ Te recordamos tu reserva en Olivia Pastelería y Café: ${formatDateLong(r.date)} a las ${r.time} hs para ${r.partySize} ${r.partySize === 1 ? 'persona' : 'personas'}. ¿Nos confirmás que vienen? ¡Te esperamos!`,
  cancelacion: (r: R) =>
    `Hola ${first(r.name)}, te escribimos de Olivia Pastelería y Café. Lamentablemente tuvimos que cancelar tu reserva del ${formatDateLong(r.date)} a las ${r.time} hs. Si querés, la reprogramamos para otro día. ¡Disculpá las molestias!`,
};
