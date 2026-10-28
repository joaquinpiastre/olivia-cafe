import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isDefaultMenuSlug } from '@/lib/menu';

export const dynamic = 'force-dynamic';

// Sirve la imagen que se subió desde el panel. La URL lleva ?v=<version>, así que puede cachearse para siempre.
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await db.menuPage.findUnique({ where: { slug }, select: { imageData: true, hasImage: true } });
  if (!page) return new NextResponse('No encontrado', { status: 404 });

  if (!page.hasImage || !page.imageData) {
    if (isDefaultMenuSlug(slug)) return NextResponse.redirect(new URL(`/carta/${slug}.jpg`, req.url));
    return new NextResponse('Sin imagen', { status: 404 });
  }

  const download = new URL(req.url).searchParams.get('download');
  const headers: Record<string, string> = {
    'Content-Type': 'image/jpeg',
    'Cache-Control': 'public, max-age=31536000, immutable',
  };
  if (download) headers['Content-Disposition'] = `attachment; filename="${slug}.jpg"`;
  return new Response(new Uint8Array(page.imageData) as unknown as BodyInit, { headers });
}
