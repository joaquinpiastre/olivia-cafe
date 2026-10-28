import Link from 'next/link';
import { LogOut, Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { logoutAction } from '../actions';
import { AdminNav } from '@/components/admin/AdminNav';
import { Logo } from '@/components/site/Logo';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newInquiries = await db.eventInquiry.count({ where: { status: 'NUEVA' } }).catch(() => 0);

  return (
    <div className="lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-cream-300 bg-white p-5 lg:flex">
        <div>
          <Logo />
          <p className="mb-6 mt-1 text-xs text-cocoa-500">Panel de administración</p>
          <Link href="/admin/reservas/nueva" className="btn-primary mb-5 w-full"><Plus className="h-4 w-4" /> Nueva reserva</Link>
          <AdminNav variant="side" newInquiries={newInquiries} />
        </div>
        <div className="border-t border-cream-200 pt-4 text-sm">
          <p className="truncate text-cocoa-500">Sesión: <strong className="text-cocoa">{session.username}</strong></p>
          <form action={logoutAction} className="mt-2">
            <button className="flex items-center gap-2 text-cocoa-600 hover:text-rose-700"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
          </form>
          <Link href="/" target="_blank" className="mt-3 block text-xs text-cocoa-400 hover:text-rose-700">Ver el sitio ↗</Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-cream-300 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/admin/reservas/nueva" className="btn-primary px-4 py-2"><Plus className="h-4 w-4" /> Nueva</Link>
            <form action={logoutAction}>
              <button aria-label="Cerrar sesión" className="rounded-full p-2.5 text-cocoa-600 hover:bg-cream-100"><LogOut className="h-5 w-5" /></button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </div>
      <AdminNav variant="bottom" newInquiries={newInquiries} />
    </div>
  );
}
