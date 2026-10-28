import { MenuViewer } from '@/components/site/MenuViewer';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { getMenuPages, getMenuTexts } from '@/lib/menu';

export const metadata = {
  title: 'Menú y carta con precios',
  description: 'Mirá la carta completa de Olivia Pastelería y Café en Mendoza: promos, dulces y salados, bebidas y opciones Sin TACC. Con precios actualizados.',
  alternates: { canonical: '/menu' },
};

// Se vuelve a generar al editar la carta desde el panel
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [pages, texts] = await Promise.all([getMenuPages(), getMenuTexts()]);
  return (
    <>
      <PageHero eyebrow={texts.menuEyebrow} title={texts.menuTitle} script={texts.menuScript} description={texts.menuDescription} />
      <section className="container-x py-14">
        <Reveal>
          <MenuViewer pages={pages} note={texts.menuNote} />
        </Reveal>
      </section>
    </>
  );
}
