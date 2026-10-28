'use client';

import { useTransition } from 'react';
import { setReservationStatus } from '@/app/admin/actions';
import { STATUS_LABEL, STATUS_STYLE } from '@/lib/site';

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

/** Cambia el estado de una reserva con un toque. */
export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Estado de la reserva"
      value={status}
      disabled={pending}
      onChange={(e) => {
        const fd = new FormData();
        fd.set('id', id);
        fd.set('status', e.target.value);
        start(() => setReservationStatus(fd));
      }}
      className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset focus:outline-none focus:ring-2 ${STATUS_STYLE[status]} ${pending ? 'opacity-60' : ''}`}
    >
      {Object.entries(STATUS_LABEL).map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}
