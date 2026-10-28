'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { whatsappLink } from '@/lib/site';

const EVENT_TYPES = ['Cumpleaños infantil', 'Cumpleaños adulto', 'Baby shower', 'Candy bar / mesa dulce', 'Evento empresarial', 'Otro'];

export function EventForm({ minDate, initialType, initialMessage, whatsappNumber }: { minDate: string; initialType?: string; initialMessage?: string; whatsappNumber?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const [f, setF] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: initialType && EVENT_TYPES.includes(initialType) ? initialType : EVENT_TYPES[0],
    eventDate: '',
    guests: '',
    message: initialMessage ?? '',
    website: '',
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setState('sending');
    try {
      const res = await fetch('/api/eventos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'No pudimos enviar tu consulta');
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError('Sin conexión. Probá de nuevo o escribinos por WhatsApp.');
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div className="card text-center" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-olivia-green" strokeWidth={1.5} />
        <h3 className="mt-4 text-3xl">¡Gracias, {f.name.split(' ')[0]}!</h3>
        <p className="mx-auto mt-3 max-w-sm text-cocoa-600">Recibimos tu consulta. Te vamos a contactar por WhatsApp lo antes posible para charlar los detalles.</p>
        <a href={whatsappLink('¡Hola Olivia! Acabo de enviar una consulta de evento desde la web.', whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn-outline mt-6">Escribir por WhatsApp</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 sm:grid-cols-2 sm:p-8" noValidate>
      <div>
        <label className="label" htmlFor="ev-name">Nombre y apellido</label>
        <input id="ev-name" className="field" autoComplete="name" value={f.name} onChange={set('name')} required />
      </div>
      <div>
        <label className="label" htmlFor="ev-phone">Teléfono (WhatsApp)</label>
        <input id="ev-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="261 1234567" value={f.phone} onChange={set('phone')} required />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="ev-email">Email <span className="font-normal text-cocoa-400">(opcional)</span></label>
        <input id="ev-email" className="field" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set('email')} />
      </div>
      <div>
        <label className="label" htmlFor="ev-type">Tipo de evento</label>
        <select id="ev-type" className="field" value={f.eventType} onChange={set('eventType')}>
          {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="ev-date">Fecha estimada</label>
          <input id="ev-date" className="field" type="date" min={minDate} value={f.eventDate} onChange={set('eventDate')} />
        </div>
        <div>
          <label className="label" htmlFor="ev-guests">Invitados</label>
          <input id="ev-guests" className="field" type="number" inputMode="numeric" min={1} max={1999} value={f.guests} onChange={set('guests')} />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="ev-msg">Contanos tu idea</label>
        <textarea id="ev-msg" className="field min-h-32" maxLength={1500} placeholder="Temática, colores, qué te imaginás, si necesitás opciones Sin TACC…" value={f.message} onChange={set('message')} required />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>No completar<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label>
      </div>
      {error && <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === 'sending'} className="btn-primary w-full py-4 text-base sm:w-auto sm:px-12">
          {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : 'Enviar consulta'}
        </button>
      </div>
    </form>
  );
}
