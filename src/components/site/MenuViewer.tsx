'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, FileDown, Maximize2 } from 'lucide-react';
import type { MenuPageView } from '@/lib/menu';
import { Lightbox } from './Lightbox';

export function MenuViewer({ pages, note }: { pages: MenuPageView[]; note: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [open, setOpen] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const n = pages.length;
  const page = pages[Math.min(active, n - 1)];

  const go = useCallback(
    (i: number) => {
      if (i === active || i < 0 || i >= n) return;
      setDir(i > active ? 1 : -1);
      setActive(i);
    },
    [active, n],
  );

  // Pre-carga las otras páginas para que el cambio sea instantáneo
  useEffect(() => {
    const id = window.setTimeout(() => pages.forEach((p) => { const i = new window.Image(); i.src = p.src; }), 800);
    return () => window.clearTimeout(id);
  }, [pages]);

  if (!page) return <p className="text-center text-cocoa-500">Estamos actualizando la carta. Volvé en un ratito o escribinos por WhatsApp.</p>;

  const arrow = 'flex h-12 w-12 items-center justify-center rounded-full bg-rose text-white shadow-soft transition hover:bg-rose-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-cream-300 disabled:shadow-none';

  return (
    <div>
      <div role="tablist" aria-label="Páginas de la carta" className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
        {pages.map((p, i) => (
          <button
            key={p.slug}
            role="tab"
            id={`tab-${p.slug}`}
            aria-selected={i === active}
            aria-controls="panel-carta"
            type="button"
            onClick={() => go(i)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${i === active ? 'bg-rose text-white shadow-soft' : 'bg-white text-cocoa-700 ring-1 ring-cream-300 hover:ring-rose'}`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div id="panel-carta" role="tabpanel" aria-labelledby={`tab-${page.slug}`} className="mx-auto mt-8 max-w-3xl">
        <div
          style={{ perspective: '1400px' }}
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            const s = touch.current;
            touch.current = null;
            if (!s) return;
            const dx = e.changedTouches[0].clientX - s.x;
            const dy = e.changedTouches[0].clientY - s.y;
            // deslizar hacia el costado cambia de página
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
          }}
        >
          {/* Se vuelve a crear en cada página para que corra la animación de entrada */}
          <div key={page.slug} className={dir > 0 ? 'menu-in-right' : 'menu-in-left'}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Ampliar carta: ${page.title}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-cream-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={page.src} alt={page.alt} className="h-auto w-full" loading="eager" decoding="async" />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-cocoa/80 px-4 py-2 text-xs font-medium text-white backdrop-blur transition group-hover:bg-cocoa">
                <Maximize2 className="h-4 w-4" /> Tocá para ampliar
              </span>
            </button>
          </div>
        </div>

        {/* Flechas fuera de la imagen: siempre se ven y no tapan nada */}
        {n > 1 && (
          <div className="mt-5 flex items-center justify-between gap-4">
            <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Página anterior" className={arrow}>
              <ChevronLeft className="h-7 w-7" />
            </button>
            <div className="text-center">
              <p className="text-sm font-medium text-cocoa-700">{page.title}</p>
              <div className="mt-2 flex justify-center gap-1.5">
                {pages.map((p, i) => (
                  <button key={p.slug} type="button" onClick={() => go(i)} aria-label={`Ir a ${p.title}`} className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-rose' : 'w-2 bg-cream-300 hover:bg-rose-200'}`} />
                ))}
              </div>
            </div>
            <button type="button" onClick={() => go(active + 1)} disabled={active === n - 1} aria-label="Página siguiente" className={arrow}>
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => setOpen(true)} className="btn-primary">
            <Maximize2 className="h-4 w-4" /> Ver en pantalla completa
          </button>
          <a href={page.downloadHref} download={`${page.slug}.jpg`} className="btn-outline">
            <Download className="h-4 w-4" /> Descargar esta página
          </a>
          <a href="/api/carta/pdf" className="btn-outline">
            <FileDown className="h-4 w-4" /> Descargar carta completa (PDF)
          </a>
        </div>
        {note && <p className="mt-4 text-center text-xs text-cocoa-500">{note}</p>}
      </div>

      {open && <Lightbox pages={pages} index={Math.min(active, n - 1)} onIndex={(i) => { setDir(i > active ? 1 : -1); setActive(i); }} onClose={() => setOpen(false)} />}
    </div>
  );
}
