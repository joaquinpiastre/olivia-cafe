'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { FormState } from '@/app/admin/actions';

type Props = {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  buttonClassName?: string;
  /** Vacía los campos cuando se guarda bien (para formularios de "agregar") */
  resetOnSuccess?: boolean;
};

/** Formulario del panel con estado de "guardando", mensaje de éxito y de error. */
export function ActionForm({ action, children, submitLabel, className = 'space-y-4', buttonClassName = 'btn-primary', resetOnSuccess = false }: Props) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    // Se envía a mano (en vez de <form action>) para que React no vacíe los campos cuando hay un error
    <form
      ref={formRef}
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClassName}>
          {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</> : submitLabel}
        </button>
        {state.error && <p role="alert" className="text-sm font-medium text-rose-700">{state.error}</p>}
        {state.ok && state.message && <p role="status" className="text-sm font-medium text-emerald-700">✓ {state.message}</p>}
      </div>
    </form>
  );
}
