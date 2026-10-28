import { whatsappLink } from '@/lib/site';
import { getContent } from '@/lib/content';
import { WhatsAppIcon } from './Icons';

export async function WhatsAppFloat() {
  const c = await getContent('contacto');
  return (
    <a
      href={whatsappLink('¡Hola Olivia! Quería hacer una consulta.', c.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="wa-pulse fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
