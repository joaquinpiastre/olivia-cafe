'use client';

import { startTransition, useActionState, useId, useState } from 'react';
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from 'lucide-react';
import { saveContent, type FormState } from '@/app/admin/actions';
import { emptyItem, type Field } from '@/lib/content-schemas';
import { formatPrice } from '@/lib/tardes-de-te';

type Obj = Record<string, unknown>;

type FieldsProps = { fields: Field[]; value: Obj; onChange: (v: Obj) => void; idBase: string };

function Fields({ fields, value, onChange, idBase }: FieldsProps) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-5">
      {fields.map((f, i) => {
        if (f.type === 'hidden') return null;
        if (f.type === 'heading') {
          return (
            <div key={`h${i}`} className="border-b border-cream-200 pb-2 pt-4 first:pt-0">
              <h3 className="font-serif text-xl">{f.label}</h3>
              {f.help && <p className="mt-0.5 text-sm text-cocoa-500">{f.help}</p>}
            </div>
          );
        }
        const id = `${idBase}-${f.key}`;
        const help = f.help && <p className="mt-1 text-xs text-cocoa-500">{f.help}</p>;

        if (f.type === 'bool') {
          return (
            <label key={f.key} className="flex items-start gap-3 rounded-xl bg-cream-100 p-4">
              <input type="checkbox" checked={Boolean(value[f.key])} onChange={(e) => set(f.key, e.target.checked)} className="mt-1 h-5 w-5 accent-rose" />
              <span>
                <strong className="block">{f.label}</strong>
                {f.help && <span className="text-sm text-cocoa-600">{f.help}</span>}
              </span>
            </label>
          );
        }

        if (f.type === 'number') {
          const n = Number(value[f.key]) || 0;
          return (
            <div key={f.key}>
              <label className="label" htmlFor={id}>{f.label}</label>
              <div className="flex items-center gap-3">
                <input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={f.min}
                  max={f.max}
                  step={f.money ? 100 : 1}
                  value={Number.isFinite(n) ? n : 0}
                  onChange={(e) => set(f.key, e.target.value === '' ? 0 : Number(e.target.value))}
                  className="field !w-48"
                />
                {f.money && <span className="font-serif text-xl text-cocoa-600">{formatPrice(n)}</span>}
                {f.suffix && <span className="text-sm text-cocoa-500">{f.suffix}</span>}
              </div>
              {help}
            </div>
          );
        }

        if (f.type === 'text') {
          return (
            <div key={f.key}>
              <label className="label" htmlFor={id}>{f.label}</label>
              <input id={id} className="field" value={String(value[f.key] ?? '')} placeholder={f.placeholder} maxLength={f.max} onChange={(e) => set(f.key, e.target.value)} />
              {help}
            </div>
          );
        }

        if (f.type === 'textarea' || f.type === 'lines') {
          const isLines = f.type === 'lines';
          const text = isLines ? (Array.isArray(value[f.key]) ? (value[f.key] as string[]).join('\n') : '') : String(value[f.key] ?? '');
          return (
            <div key={f.key}>
              <label className="label" htmlFor={id}>{f.label}</label>
              <textarea
                id={id}
                className="field"
                rows={f.rows ?? 3}
                value={text}
                placeholder={f.placeholder}
                maxLength={isLines ? undefined : f.max}
                // En las listas se conservan las líneas vacías mientras se escribe; el servidor las descarta al guardar
                onChange={(e) => set(f.key, isLines ? e.target.value.split('\n') : e.target.value)}
              />
              {help}
            </div>
          );
        }

        // list
        const lf = f as Extract<Field, { type: 'list' }>;
        const items = Array.isArray(value[f.key]) ? (value[f.key] as Obj[]) : [];
        const setItems = (next: Obj[]) => set(f.key, next);
        const move = (i: number, dir: -1 | 1) => {
          const j = i + dir;
          if (j < 0 || j >= items.length) return;
          const next = [...items];
          [next[i], next[j]] = [next[j], next[i]];
          setItems(next);
        };
        return (
          <div key={f.key}>
            <p className="label">{f.label}</p>
            {help}
            <div className="mt-3 space-y-3">
              {items.map((item, i) => {
                const title = String(item[lf.itemTitle] ?? '').trim() || 'Sin título';
                const price = typeof item.price === 'number' ? item.price : null;
                const hidden = item.visible === false;
                return (
                  <details key={String(item.id ?? i)} className="group rounded-2xl bg-white ring-1 ring-cream-300 open:shadow-soft" open={Boolean(item._new)}>
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{title}</span>
                        <span className="block text-xs text-cocoa-500">
                          {price !== null && formatPrice(price)}
                          {hidden && ' · oculto en la web'}
                        </span>
                      </span>
                      <span className="text-xs text-cocoa-500 underline decoration-dotted group-open:hidden">Editar</span>
                      <span className="hidden text-xs text-cocoa-500 underline decoration-dotted group-open:inline">Cerrar</span>
                    </summary>
                    <div className="space-y-5 border-t border-cream-200 px-4 py-5">
                      <Fields fields={lf.fields} value={item} idBase={`${id}-${i}`} onChange={(v) => setItems(items.map((x, k) => (k === i ? v : x)))} />
                      <div className="flex flex-wrap gap-2 border-t border-cream-200 pt-4">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="btn-outline !px-3 !py-2" aria-label="Subir"><ArrowUp className="h-4 w-4" /></button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="btn-outline !px-3 !py-2" aria-label="Bajar"><ArrowDown className="h-4 w-4" /></button>
                        <button
                          type="button"
                          onClick={() => confirm(`¿Eliminar "${title}"?`) && setItems(items.filter((_, k) => k !== i))}
                          className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </button>
                      </div>
                    </div>
                  </details>
                );
              })}
              {items.length === 0 && <p className="rounded-xl bg-cream-100 px-4 py-4 text-sm text-cocoa-500">Todavía no hay ninguno.</p>}
              {items.length < (lf.max ?? 40) && (
                <button type="button" onClick={() => setItems([...items, { ...emptyItem(lf.fields), _new: true }])} className="btn-outline !py-2">
                  <Plus className="h-4 w-4" /> {lf.addLabel}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ContentEditor({ contentKey, schema, initial }: { contentKey: string; schema: Field[]; initial: Obj }) {
  const idBase = useId();
  const [value, setValue] = useState<Obj>(initial);
  const [state, formAction, pending] = useActionState(saveContent, {} as FormState);

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.set('key', contentKey);
        fd.set('data', JSON.stringify(value));
        startTransition(() => formAction(fd));
      }}
    >
      <div className="card space-y-5 sm:p-8">
        <Fields fields={schema} value={value} onChange={setValue} idBase={idBase} />
      </div>

      <div className="sticky bottom-20 z-20 flex flex-wrap items-center gap-3 rounded-2xl bg-white/95 px-5 py-4 shadow-soft ring-1 ring-cream-300 backdrop-blur lg:bottom-4">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</> : 'Guardar cambios'}
        </button>
        {state.error && <p role="alert" className="text-sm font-medium text-rose-700">{state.error}</p>}
        {state.ok && state.message && <p role="status" className="text-sm font-medium text-emerald-700">✓ {state.message}</p>}
      </div>
    </form>
  );
}
