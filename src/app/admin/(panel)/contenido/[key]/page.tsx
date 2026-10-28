import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
import { getSchema, isContentKey, SECTIONS } from '@/lib/content-schemas';
import { resetContent } from '@/app/admin/actions';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: 'Contenido' };
export const dynamic = 'force-dynamic';

export default async function ContenidoSectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isContentKey(key)) notFound();
  const section = SECTIONS.find((s) => s.key === key)!;
  const value = await getContent(key);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/contenido" className="text-sm text-cocoa-500 hover:text-cocoa">← Contenido</Link>
        <h1 className="mt-1 text-4xl">{section.title}</h1>
        <p className="mt-2 max-w-2xl text-cocoa-600">
          {section.description}{' '}
          <Link href={section.page} target="_blank" className="text-rose-700 underline">Ver en la web ↗</Link>
        </p>
      </div>

      <ContentEditor contentKey={key} schema={getSchema(key)} initial={JSON.parse(JSON.stringify(value))} />

      <form action={resetContent} className="text-sm text-cocoa-500">
        <input type="hidden" name="key" value={key} />
        <DeleteButton message="Se van a borrar todos los cambios de esta sección y se vuelve a los valores originales. ¿Continuar?" className="underline hover:text-rose-700">
          Volver a los valores originales
        </DeleteButton>
      </form>
    </div>
  );
}
