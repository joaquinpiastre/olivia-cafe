import { NextResponse } from 'next/server';
import { getAvailability } from '@/lib/availability';
import { isValidDateStr } from '@/lib/dates';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? '';
  const type = searchParams.get('type') ?? undefined;
  if (!isValidDateStr(date)) return NextResponse.json({ open: false, reason: 'Fecha inválida', shifts: [] }, { status: 400 });
  try {
    const result = await getAvailability(date, type);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('disponibilidad', e);
    return NextResponse.json({ open: false, reason: 'No pudimos consultar la disponibilidad', shifts: [] }, { status: 500 });
  }
}
