import Link from 'next/link';
import { db } from '@/lib/db';
import { todayStr } from '@/lib/dates';
import { ReservationAdminForm } from '@/components/admin/ReservationAdminForm';

export const metadata = { title: 'Nueva reserva' };

export default async function NuevaReservaPage() {
  const shifts = await db.shift.findMany({ orderBy: { startTime: 'asc' } });
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reservas" className="text-sm text-cocoa-500 hover:text-rose-700">← Reservas</Link>
        <h1 className="mt-1 text-4xl">Nueva reserva</h1>
        <p className="mt-1 text-cocoa-600">Para las que entran por teléfono, Instagram o en el local.</p>
      </div>
      <div className="card sm:p-8">
        <ReservationAdminForm mode="create" shifts={shifts} today={todayStr()} />
      </div>
    </div>
  );
}
