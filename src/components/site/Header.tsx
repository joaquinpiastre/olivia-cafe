'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV } from '@/lib/site';
import { Logo } from './Logo';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled || open ? 'bg-cream/95 shadow-[0_1px_0_rgba(110,70,70,0.08)] backdrop-blur' : 'bg-cream/80 backdrop-blur-sm'}`}>
      <div className="container-x flex h-[84px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-7 xl:flex">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative text-[0.95rem] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-rose after:transition-all ${active ? 'text-olivia-beige after:w-full' : 'text-cocoa-700 after:w-0 hover:text-olivia-beige hover:after:w-full'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/reservas" className="btn-primary hidden px-6 py-2.5 sm:inline-flex">
            Reservá tu mesa
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa xl:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        className={`fixed inset-x-0 top-[84px] bottom-0 overflow-y-auto bg-cream px-5 pb-10 pt-4 transition-all duration-300 xl:hidden ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
      >
        <nav aria-label="Menú móvil" className="flex flex-col">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`border-b border-cream-300 py-4 font-serif text-2xl ${active ? 'text-olivia-beige' : 'text-cocoa'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/reservas" className="btn-primary mt-8 w-full py-4 text-base">
          Reservá tu mesa
        </Link>
      </div>
    </header>
  );
}
