'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, FileText, Image as ImageIcon, Inbox, LayoutDashboard, Settings } from 'lucide-react';

const ITEMS = [
  { href: '/admin', label: 'Panel', short: 'Panel', icon: LayoutDashboard, exact: true },
  { href: '/admin/reservas', label: 'Reservas', short: 'Reservas', icon: CalendarDays },
  { href: '/admin/eventos', label: 'Consultas de eventos', short: 'Eventos', icon: Inbox, badge: true },
  { href: '/admin/contenido', label: 'Contenido y precios', short: 'Contenido', icon: FileText },
  { href: '/admin/carta', label: 'Carta', short: 'Carta', icon: ImageIcon },
  { href: '/admin/configuracion', label: 'Configuración', short: 'Ajustes', icon: Settings },
];

export function AdminNav({ variant, newInquiries }: { variant: 'side' | 'bottom'; newInquiries: number }) {
  const pathname = usePathname();
  const isActive = (i: (typeof ITEMS)[number]) => (i.exact ? pathname === i.href : pathname.startsWith(i.href));

  if (variant === 'side') {
    return (
      <nav aria-label="Panel" className="flex flex-col gap-1">
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} aria-current={isActive(i) ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[0.95rem] transition ${isActive(i) ? 'bg-rose text-white shadow-soft' : 'text-cocoa-700 hover:bg-rose-100'}`}>
            <i.icon className="h-5 w-5" />
            {i.label}
            {i.badge && newInquiries > 0 && <span className="ml-auto rounded-full bg-rose-700 px-2 py-0.5 text-xs text-white">{newInquiries}</span>}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-cream-300 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={isActive(i) ? 'page' : undefined} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] ${isActive(i) ? 'text-rose-700' : 'text-cocoa-500'}`}>
          <i.icon className="h-6 w-6" strokeWidth={isActive(i) ? 2.2 : 1.7} />
          {i.short}
          {i.badge && newInquiries > 0 && <span className="absolute right-[22%] top-1.5 rounded-full bg-rose-700 px-1.5 text-[0.6rem] text-white">{newInquiries}</span>}
        </Link>
      ))}
    </nav>
  );
}
