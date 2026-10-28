import { NextResponse } from 'next/server';
import { createReservation } from '@/lib/reservations';
import { firstError, reservationSchema } from '@/lib/validators';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`res:${clientIp(req.headers)}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados intentos. Esperá unos minutos o escribinos por WhatsApp.' }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: firstError(parsed.error) }, { status: 400 });

  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true, code: 'OLV-0000' }); // honeypot: se descarta en silencio

  const result = await createReservation(data, { source: 'WEB' });
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  return NextResponse.json({ ok: true, code: result.reservation.code });
}
