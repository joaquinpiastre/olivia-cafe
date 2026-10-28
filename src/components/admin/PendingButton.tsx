'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

/** Botón de envío que se deshabilita y muestra un spinner mientras la acción del servidor se ejecuta. */
export function PendingButton({ children, className, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button {...rest} type="submit" disabled={disabled || pending} aria-busy={pending} className={className}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : children}
    </button>
  );
}
