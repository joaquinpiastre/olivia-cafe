import Image from 'next/image';
import Link from 'next/link';

// Logo con fondo transparente: sirve tanto sobre crema como sobre el footer oscuro.
export function Logo({ className = '', size = 'md' }: { className?: string; light?: boolean; size?: 'md' | 'lg' }) {
  const height = size === 'lg' ? 'h-24 sm:h-28' : 'h-[64px]';
  return (
    <Link href="/" aria-label="Olivia Pastelería y Café – Inicio" className={`inline-flex ${className}`}>
      <Image src="/img/marca/logo-olivia.png" alt="Olivia Pastelería y Café" width={1400} height={666} priority sizes="240px" className={`${height} w-auto`} />
    </Link>
  );
}
