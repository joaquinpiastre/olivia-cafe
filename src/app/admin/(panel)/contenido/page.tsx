import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { SECTIONS } from '@/lib/content-schemas';
import { formatDateLong } from '@/lib/dates';

export const metadata = { title: 'Contenido' };
export const dynamic = 'force-dynamic';

export default async function ContenidoPage() {
  const rows = await db.siteContent.findMany({ select: { key: true, updatedAt: true } });
  const updated = new Map(rows.map((r) => [r.key, r.updatedAt]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl">Contenido del sitio</h1>
        <p className="mt-2 max-w-2xl text-cocoa-600">
          Desde acá se cambian los precios, menús, condiciones y datos que se muestran en la web, sin tocar código. Los cambios se ven al instante. Los horarios, cupos y días de las reservas se manejan en <Link href="/admin/configuracion" className="text-rose-700 underline">Configuración</Link>, y las cartas en <Link href="/admin/carta" className="text-rose-700 underline">Carta</Link>.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s) => {
          const at = updated.get(s.key);
          return (
            <Link key={s.key} href={`/admin/contenido/${s.key}`} className="card group flex items-center gap-4 transition hover:-translate-y-0.5">
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-2xl">{s.title}</span>
                <span className="mt-1 block text-sm text-cocoa-600">{s.description}</span>
                <span className="mt-2 block text-xs text-cocoa-500">{at ? `Última edición: ${formatDateLong(at.toISOString().slice(0, 10))}` : 'Sin cambios: se muestran los valores originales'}</span>
              </span>
              <ChevronRight className="h-6 w-6 shrink-0 text-cocoa-400 transition group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
