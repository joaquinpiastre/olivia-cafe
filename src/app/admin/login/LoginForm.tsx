'use client';

import { useActionState, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { loginAction, type FormState } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {} as FormState);
  // controlado: React 19 limpia los campos no controlados tras cada intento
  const [username, setUsername] = useState('');
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="username">Usuario</label>
        <input id="username" name="username" className="field" autoComplete="username" autoCapitalize="none" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="field" autoComplete="current-password" required />
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-rose-100 px-4 py-2.5 text-sm font-medium text-rose-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Ingresando…</> : 'Ingresar'}
      </button>
    </form>
  );
}
