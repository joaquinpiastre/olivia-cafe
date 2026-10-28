'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth, weekdayOf } from '@/lib/dates';

type Props = {
  value: string;
  onChange: (date: string) => void;
  min: string;
  max: string;
  /** 0 = domingo … 6 = sábado. Por defecto, todos. */
  openWeekdays?: number[];
  blocked?: string[];
  name?: string;
};

const HEAD = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** DatePicker con estado propio, para usar dentro de formularios (envía el valor en un input oculto). */
export function DateField({ name, defaultValue = '', onChange, ...rest }: Omit<Props, 'value' | 'onChange'> & { name: string; defaultValue?: string; onChange?: (d: string) => void }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <DatePicker
      {...rest}
      name={name}
      value={value}
      onChange={(d) => {
        setValue(d);
        onChange?.(d);
      }}
    />
  );
}

export function DatePicker({ value, onChange, min, max, openWeekdays = [0, 1, 2, 3, 4, 5, 6], blocked = [], name }: Props) {
  const [month, setMonth] = useState((value || min).slice(0, 7));
  const [y, m] = month.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const offset = (weekdayOf(`${month}-01`) + 6) % 7; // semana que arranca en lunes
  const shift = (n: number) => {
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  };
  const canPrev = `${month}-01` > min.slice(0, 7) + '-01';
  const canNext = month < max.slice(0, 7);

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-3 sm:p-4">
      {name && <input type="hidden" name={name} value={value} />}
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Mes anterior" className="rounded-full p-2 text-cocoa-600 hover:bg-cream-100 disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="font-serif text-lg cap1" aria-live="polite">{formatMonth(month)}</p>
        <button type="button" onClick={() => shift(1)} disabled={!canNext} aria-label="Mes siguiente" className="rounded-full p-2 text-cocoa-600 hover:bg-cream-100 disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-cocoa-500">
        {HEAD.map((h, i) => (
          <span key={i} className="py-1">{h}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = `${month}-${String(day).padStart(2, '0')}`;
          const disabled = date < min || date > max || !openWeekdays.includes(weekdayOf(date)) || blocked.includes(date);
          const selected = date === value;
          return (
            <button
              key={date}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={new Date(`${date}T00:00:00Z`).toLocaleDateString('es-AR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })}
              onClick={() => onChange(date)}
              className={`aspect-square rounded-full text-sm transition ${selected ? 'bg-rose font-semibold text-white shadow-soft' : disabled ? 'cursor-not-allowed text-cocoa-400/50 line-through decoration-cocoa-400/30' : 'text-cocoa hover:bg-rose-100'}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
