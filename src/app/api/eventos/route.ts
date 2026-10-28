import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventInquirySchema, firstError } from '@/lib/validators';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`evt:${clientIp(req.headers)}`, 4, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados intentos. Esperá unos minutos o escribinos por WhatsApp.' }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = eventInquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: firstError(parsed.error) }, { status: 400 });

  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  try {
    await db.eventInquiry.create({ data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('eventos', e);
    return NextResponse.json({ ok: false, error: 'No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.' }, { status: 500 });
  }
}
