'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageOff, Loader2, RotateCcw, Trash2, Upload } from 'lucide-react';
import { deleteMenuPage, moveMenuPage, toggleMenuPage, updateMenuPage } from '@/app/admin/actions';
import type { MenuPageView } from '@/lib/menu';
import { ActionForm } from './ActionForm';
import { DeleteButton } from './DeleteButton';
import { PendingButton } from './PendingButton';

const SERVER_LIMIT = 4_300_000;

/** Reduce la foto en el navegador si hace falta (las fotos de celular pesan mucho) para que entre en el límite del servidor. */
async function prepare(file: File): Promise<Blob> {
  if (file.size <= 3_000_000 && /^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file);
  let maxSide = 3200;
  for (const quality of [0.9, 0.82, 0.72, 0.62]) {
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (blob && blob.size <= SERVER_LIMIT) return blob;
    maxSide = Math.round(maxSide * 0.85);
  }
  throw new Error('La imagen es demasiado pesada. Probá con una de menor resolución.');
}

const iconBtn = 'flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa ring-1 ring-cream-300 transition hover:bg-rose-50 hover:ring-rose disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:ring-cream-300';

type Props = { page: MenuPageView; index: number; total: number; isDefault: boolean };

export function MenuImageEditor({ page, index, total, isDefault }: Props) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const hasImage = !!page.src;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const body = await prepare(file);
      const res = await fetch(`/api/admin/carta/${page.slug}`, { method: 'POST', headers: { 'Content-Type': body.type || 'application/octet-stream' }, body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la imagen');
      setMsg({ ok: true, text: '¡Listo! La carta ya está actualizada en la web.' });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error al subir la imagen' });
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    const text = isDefault ? '¿Volver a la imagen original de esta página?' : '¿Quitar la imagen de esta página? Quedará sin imagen.';
    if (!window.confirm(text)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/carta/${page.slug}`, { method: 'DELETE' });
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: isDefault ? 'Se restauró la imagen original.' : 'Se quitó la imagen.' } : { ok: false, text: 'No se pudo completar' });
    router.refresh();
  }

  return (
    <article className={`card space-y-4 p-4 sm:p-5 ${page.visible ? '' : 'opacity-80'}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose font-serif text-lg text-white" aria-label={`Posición ${index + 1}`}>{index + 1}</span>
        <h2 className="min-w-0 flex-1 truncate text-2xl">{page.title}</h2>
        <div className="flex gap-2">
          <form action={moveMenuPage}>
            <input type="hidden" name="slug" value={page.slug} />
            <input type="hidden" name="dir" value="up" />
            <PendingButton className={iconBtn} disabled={index === 0} aria-label={`Subir "${page.title}"`} title="Subir"><ArrowUp className="h-5 w-5" /></PendingButton>
          </form>
          <form action={moveMenuPage}>
            <input type="hidden" name="slug" value={page.slug} />
            <input type="hidden" name="dir" value="down" />
            <PendingButton className={iconBtn} disabled={index === total - 1} aria-label={`Bajar "${page.title}"`} title="Bajar"><ArrowDown className="h-5 w-5" /></PendingButton>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-1 ${page.visible ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>{page.visible ? 'Visible en la web' : 'Oculta'}</span>
        <span className={`rounded-full px-2.5 py-1 ${page.custom ? 'bg-sky-100 text-sky-800' : 'bg-stone-200 text-stone-600'}`}>{page.custom ? 'Imagen subida' : hasImage ? 'Imagen original' : 'Sin imagen'}</span>
        {!hasImage && page.visible && <span className="text-rose-700">No se muestra hasta que subas una imagen</span>}
      </div>

      {hasImage ? (
        <a href={page.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl bg-cream-100 ring-1 ring-cream-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.src} alt={page.alt} className="mx-auto max-h-80 w-full object-contain" />
        </a>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl bg-cream-100 text-sm text-cocoa-500 ring-1 ring-cream-300">
          <ImageOff className="h-7 w-7" /> Todavía no hay imagen
        </div>
      )}

      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-label={`Elegir imagen para ${page.title}`} />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="btn-primary !px-5 !py-2.5">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</> : <><Upload className="h-4 w-4" /> {hasImage ? 'Reemplazar imagen' : 'Subir imagen'}</>}
        </button>
        {page.custom && (
          <button type="button" onClick={restore} disabled={busy} className="btn-outline !px-5 !py-2.5"><RotateCcw className="h-4 w-4" /> {isDefault ? 'Restaurar original' : 'Quitar imagen'}</button>
        )}
      </div>
      {msg && <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{msg.text}</p>}

      <ActionForm action={updateMenuPage} submitLabel="Guardar nombre y texto" className="space-y-3 border-t border-cream-200 pt-4" buttonClassName="btn-outline !px-4 !py-2">
        <input type="hidden" name="slug" value={page.slug} />
        <div>
          <label className="label" htmlFor={`title-${page.slug}`}>Nombre de la pestaña</label>
          <input id={`title-${page.slug}`} name="title" defaultValue={page.title} maxLength={40} className="field" required />
        </div>
        <div>
          <label className="label" htmlFor={`alt-${page.slug}`}>Texto alternativo (SEO y accesibilidad)</label>
          <textarea id={`alt-${page.slug}`} name="alt" defaultValue={page.alt} maxLength={300} rows={2} className="field text-sm" required />
        </div>
      </ActionForm>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-4">
        <form action={toggleMenuPage}>
          <input type="hidden" name="slug" value={page.slug} />
          <PendingButton className="inline-flex items-center gap-2 text-sm font-medium text-cocoa-700 hover:text-rose-700">
            {page.visible ? <><EyeOff className="h-4 w-4" /> Ocultar de la web</> : <><Eye className="h-4 w-4" /> Mostrar en la web</>}
          </PendingButton>
        </form>
        <form action={deleteMenuPage}>
          <input type="hidden" name="slug" value={page.slug} />
          <DeleteButton message={`¿Eliminar la página "${page.title}" de la carta? Se borra también su imagen subida.`} className="inline-flex items-center gap-1.5 text-sm text-rose-700 hover:underline">
            <Trash2 className="h-4 w-4" /> Eliminar página
          </DeleteButton>
        </form>
      </div>
    </article>
  );
}
