'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { MenuPageView } from '@/lib/menu';

type T = { s: number; x: number; y: number };
const MIN = 1;
const MAX = 6;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Props = { pages: MenuPageView[]; index: number; onIndex: (i: number) => void; onClose: () => void };

/**
 * Visor a pantalla completa con zoom:
 * - pellizco con dos dedos (celular), rueda del mouse o botones +/− (compu)
 * - arrastrar para moverse cuando está ampliado
 * - doble toque / doble clic para ampliar y volver
 * - deslizar hacia los costados (sin zoom) o usar los botones de abajo para cambiar de página
 * Los botones de página van en una barra aparte, así nunca tapan la carta.
 */
export function Lightbox({ pages, index, onIndex, onClose }: Props) {
  const page = pages[index];
  const n = pages.length;
  const [t, setT] = useState<T>({ s: 1, x: 0, y: 0 });
  const [dir, setDir] = useState<1 | -1>(1);
  const tRef = useRef(t);
  tRef.current = t;
  const stageRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; mx: number; my: number; t: T } | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const multi = useRef(false);
  const moved = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const reset = useCallback(() => setT({ s: 1, x: 0, y: 0 }), []);

  const step = useCallback(
    (d: 1 | -1) => {
      if (n < 2) return;
      setDir(d);
      onIndex((index + d + n) % n);
    },
    [index, n, onIndex],
  );

  // coordenadas relativas al centro del visor
  const rel = (cx: number, cy: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
  };

  const zoomTo = useCallback((ns: number, px = 0, py = 0) => {
    const cur = tRef.current;
    const s = clamp(ns, MIN, MAX);
    if (s === 1) return setT({ s: 1, x: 0, y: 0 });
    const ratio = s / cur.s;
    setT({ s, x: px - (px - cur.x) * ratio, y: py - (py - cur.y) * ratio });
  }, []);

  useEffect(() => {
    reset();
  }, [index, reset]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === '+' || e.key === '=') zoomTo(tRef.current.s * 1.4);
      else if (e.key === '-') zoomTo(tRef.current.s / 1.4);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, step, zoomTo]);

  // La rueda necesita listener no-pasivo para poder evitar el scroll de la página
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = rel(e.clientX, e.clientY);
      zoomTo(tRef.current.s * (e.deltaY < 0 ? 1.18 : 1 / 1.18), p.x, p.y);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;
    if (pointers.current.size === 1) {
      multi.current = false;
      swipe.current = { x: e.clientX, y: e.clientY };
    }
    if (pointers.current.size === 2) {
      multi.current = true;
      const [a, b] = [...pointers.current.values()];
      const m = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: m.x, my: m.y, t: tRef.current };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y) > 1) moved.current = true;

    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mid = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
      const p0 = pinch.current;
      const s = clamp(p0.t.s * (dist / p0.dist), MIN, MAX);
      const ratio = s / p0.t.s;
      if (s === 1) setT({ s: 1, x: 0, y: 0 });
      else setT({ s, x: mid.x - (p0.mx - p0.t.x) * ratio, y: mid.y - (p0.my - p0.t.y) * ratio });
    } else if (pointers.current.size === 1 && tRef.current.s > 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setT((c) => ({ ...c, x: c.x + dx, y: c.y + dy }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (!wasSingle) return;

    // deslizar hacia el costado (solo sin zoom) cambia de página
    const sw = swipe.current;
    swipe.current = null;
    if (sw && !multi.current && tRef.current.s <= 1.02) {
      const dx = e.clientX - sw.x;
      const dy = e.clientY - sw.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        step(dx < 0 ? 1 : -1);
        return;
      }
    }

    if (!moved.current) {
      const now = Date.now();
      const lt = lastTap.current;
      if (now - lt.time < 320 && Math.abs(e.clientX - lt.x) < 30 && Math.abs(e.clientY - lt.y) < 30) {
        const p = rel(e.clientX, e.clientY);
        if (tRef.current.s > 1.05) reset();
        else zoomTo(2.6, p.x, p.y);
        lastTap.current = { time: 0, x: 0, y: 0 };
      } else {
        lastTap.current = { time: now, x: e.clientX, y: e.clientY };
      }
    }
  };

  if (!page) return null;

  const topBtn = 'rounded-full p-2.5 text-white hover:bg-white/15';
  const navBtn = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-cocoa shadow-lg transition active:scale-95 hover:bg-rose-100 disabled:opacity-40';

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label={`Carta: ${page.title}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-white sm:px-5">
        <p className="truncate font-serif text-lg sm:text-xl">{page.title}</p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => zoomTo(tRef.current.s / 1.4)} aria-label="Alejar" className={topBtn}><ZoomOut className="h-5 w-5" /></button>
          <button type="button" onClick={() => zoomTo(tRef.current.s * 1.4)} aria-label="Acercar" className={topBtn}><ZoomIn className="h-5 w-5" /></button>
          <button type="button" onClick={reset} aria-label="Restablecer zoom" className={topBtn}><RotateCcw className="h-5 w-5" /></button>
          <a href={page.downloadHref} download={`${page.slug}.jpg`} aria-label="Descargar esta página" className={topBtn}><Download className="h-5 w-5" /></a>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar" className={topBtn}><X className="h-6 w-6" /></button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative flex-1 touch-none select-none overflow-hidden"
        style={{ cursor: t.s > 1 ? 'grab' : 'zoom-in' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) => e.preventDefault()}
      >
        {/* El contenedor se vuelve a crear en cada página para que corra la animación de entrada */}
        <div key={page.slug} className={`absolute inset-0 ${dir > 0 ? 'menu-in-right' : 'menu-in-left'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.src}
            alt={page.alt}
            draggable={false}
            className="h-full w-full object-contain will-change-transform"
            style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.s})`, transition: pointers.current.size ? 'none' : 'transform .12s ease-out' }}
          />
        </div>
      </div>

      {/* Barra inferior: los botones están acá, fuera de la imagen, para no tapar nada */}
      <div className="flex items-center justify-between gap-3 bg-black px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button type="button" onClick={() => step(-1)} disabled={n < 2} aria-label="Página anterior" className={navBtn}>
          <ChevronLeft className="h-7 w-7" />
        </button>
        <div className="min-w-0 text-center text-white">
          <p className="truncate text-sm font-medium">{page.title}</p>
          <div className="mt-1.5 flex justify-center gap-1.5" aria-hidden="true">
            {pages.map((p, i) => (
              <span key={p.slug} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
          <p className="mt-1.5 hidden text-xs text-white/60 sm:block">Pellizcá o hacé doble toque para acercar</p>
        </div>
        <button type="button" onClick={() => step(1)} disabled={n < 2} aria-label="Página siguiente" className={navBtn}>
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
