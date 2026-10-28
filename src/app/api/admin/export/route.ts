import ExcelJS from 'exceljs';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { STATUS_LABEL, TYPE_LABEL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const STATUSES = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ASISTIO', 'NO_VINO'];
const TYPES = ['MESA', 'MERIENDA', 'TARDE_DE_TE', 'EVENTO'];

export async function GET(req: Request) {
  if (!(await getSession())) return new Response('No autorizado', { status: 401 });
  const sp = new URL(req.url).searchParams;
  const format = sp.get('format') === 'csv' ? 'csv' : 'xlsx';
  const from = sp.get('from');
  const to = sp.get('to');
  const status = sp.get('status');
  const type = sp.get('type');

  const where: Prisma.ReservationWhereInput = {};
  if (from || to) where.date = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
  if (status && STATUSES.includes(status)) where.status = status as Prisma.ReservationWhereInput['status'];
  if (type && TYPES.includes(type)) where.type = type as Prisma.ReservationWhereInput['type'];

  const rows = await db.reservation.findMany({ where, orderBy: [{ date: 'asc' }, { time: 'asc' }] });

  const columns = [
    { header: 'Código', key: 'code', width: 11 },
    { header: 'Fecha', key: 'date', width: 12 },
    { header: 'Hora', key: 'time', width: 8 },
    { header: 'Tipo', key: 'type', width: 18 },
    { header: 'Personas', key: 'partySize', width: 10 },
    { header: 'Nombre', key: 'name', width: 24 },
    { header: 'Teléfono', key: 'phone', width: 18 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Estado', key: 'status', width: 13 },
    { header: 'Origen', key: 'source', width: 9 },
    { header: 'Comentarios', key: 'notes', width: 40 },
    { header: 'Notas internas', key: 'adminNotes', width: 30 },
    { header: 'Creada', key: 'createdAt', width: 18 },
  ];
  const data = rows.map((r) => ({
    code: r.code,
    date: r.date,
    time: r.time,
    type: TYPE_LABEL[r.type],
    partySize: r.partySize,
    name: r.name,
    phone: r.phone,
    email: r.email ?? '',
    status: STATUS_LABEL[r.status],
    source: r.source === 'WEB' ? 'Web' : 'Manual',
    notes: r.notes ?? '',
    adminNotes: r.adminNotes ?? '',
    createdAt: r.createdAt.toLocaleString('es-AR', { timeZone: 'America/Argentina/Mendoza' }),
  }));

  const stamp = new Date().toISOString().slice(0, 10);

  if (format === 'csv') {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [columns.map((c) => esc(c.header)).join(';'), ...data.map((d) => columns.map((c) => esc(d[c.key as keyof typeof d])).join(';'))];
    // BOM para que Excel respete los acentos
    return new Response('﻿' + lines.join('\r\n'), {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="reservas-olivia-${stamp}.csv"` },
    });
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Reservas');
  ws.columns = columns;
  ws.addRows(data);
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC4888A' } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  const buf = await wb.xlsx.writeBuffer();
  return new Response(buf as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="reservas-olivia-${stamp}.xlsx"`,
    },
  });
}
