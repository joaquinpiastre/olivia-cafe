import Link from 'next/link';
import { getAllMenuPages, getMenuTexts, isDefaultMenuSlug } from '@/lib/menu';
import { addMenuPage, saveMenuTexts } from '@/app/admin/actions';
import { ActionForm } from '@/components/admin/ActionForm';
import { MenuImageEditor } from '@/components/admin/MenuImageEditor';

export const metadata = { title: 'Carta' };

export default async function CartaAdminPage() {
  const [pages, texts] = await Promise.all([getAllMenuPages(), getMenuTexts()]);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl">Carta</h1>
        <p className="mt-2 max-w-2xl text-cocoa-600">
          Desde acá se maneja todo lo de la página de la carta: los textos, el orden de las páginas, sus imágenes y cuáles se muestran. Los cambios se ven al instante en la web, sin tocar código.{' '}
          <Link href="/menu" target="_blank" className="text-rose-700 underline">Ver la carta en la web ↗</Link>
        </p>
      </div>

      <section className="card sm:p-8">
        <h2 className="text-2xl">Textos de la página</h2>
        <p className="mt-1 text-sm text-cocoa-600">Lo que aparece arriba de la carta y debajo de los botones.</p>
        <ActionForm action={saveMenuTexts} submitLabel="Guardar textos" className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="menuEyebrow">Texto chico de arriba</label>
              <input id="menuEyebrow" name="menuEyebrow" defaultValue={texts.menuEyebrow} maxLength={60} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="menuTitle">Título</label>
              <input id="menuTitle" name="menuTitle" defaultValue={texts.menuTitle} maxLength={80} className="field" required />
            </div>
            <div>
              <label className="label" htmlFor="menuScript">Palabra destacada (letra manuscrita)</label>
              <input id="menuScript" name="menuScript" defaultValue={texts.menuScript} maxLength={60} className="field" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="menuDescription">Descripción</label>
            <textarea id="menuDescription" name="menuDescription" defaultValue={texts.menuDescription} maxLength={300} rows={2} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="menuNote">Aviso debajo de la carta (ej. “Los precios pueden variar”)</label>
            <input id="menuNote" name="menuNote" defaultValue={texts.menuNote} maxLength={200} className="field" />
          </div>
        </ActionForm>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-3xl">Páginas de la carta</h2>
          <p className="mt-1 max-w-2xl text-sm text-cocoa-600">
            El orden de acá es el orden de las pestañas en la web: la página <strong>1</strong> es la que se ve primero. Usá las flechas ↑ ↓ para ordenarlas.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {pages.map((p, i) => (
            <MenuImageEditor key={`${p.slug}-${p.version}`} page={p} index={i} total={pages.length} isDefault={isDefaultMenuSlug(p.slug)} />
          ))}
        </div>
      </section>

      <section className="card sm:p-8">
        <h2 className="text-2xl">Agregar una página</h2>
        <p className="mt-1 text-sm text-cocoa-600">Por ejemplo “Desayunos”, “Temporada” o “Cumpleaños”. Se agrega al final; después subile la imagen y ubicala donde quieras.</p>
        <ActionForm action={addMenuPage} resetOnSuccess submitLabel="Agregar página" className="mt-5 flex flex-wrap items-end gap-3" buttonClassName="btn-primary !py-2.5">
          <div className="min-w-[14rem] flex-1">
            <label className="label" htmlFor="newTitle">Nombre de la página</label>
            <input id="newTitle" name="title" maxLength={40} className="field" placeholder="Ej. Desayunos" required />
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
