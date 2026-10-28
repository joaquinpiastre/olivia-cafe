import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_BYTES = 4_400_000; // Vercel limita el cuerpo de las funciones a ~4.5 MB

// Reemplaza la imagen de una página de la carta. El cuerpo es el archivo de imagen en crudo.
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { slug } = await params;
  const exists = await db.menuPage.findUnique({ where: { slug }, select: { slug: true } });
  if (!exists) return NextResponse.json({ error: 'Página inexistente' }, { status: 404 });

  const input = Buffer.from(await req.arrayBuffer());
  if (input.length === 0) return NextResponse.json({ error: 'Archivo vacío' }, { status: 400 });
  if (input.length > MAX_BYTES) return NextResponse.json({ error: 'La imagen pesa demasiado (máx. 4 MB). Probá con una más liviana.' }, { status: 413 });

  let output: Buffer;
  try {
    // Se guarda en JPG de alta calidad, con el lado mayor limitado a 3200 px (se leen bien los precios al hacer zoom).
    output = await sharp(input)
      .rotate()
      .resize({ width: 3200, height: 3200, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: 'No se pudo leer la imagen. Usá un JPG, PNG o WebP.' }, { status: 400 });
  }

  const version = Math.floor(Date.now() / 1000);
  await db.menuPage.update({ where: { slug }, data: { imageData: new Uint8Array(output), hasImage: true, version } });
  return NextResponse.json({ ok: true, version });
}

// Vuelve a la imagen original de /public/carta (las páginas nuevas quedan sin imagen).
export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { slug } = await params;
  const exists = await db.menuPage.findUnique({ where: { slug }, select: { slug: true } });
  if (!exists) return NextResponse.json({ error: 'Página inexistente' }, { status: 404 });
  await db.menuPage.update({ where: { slug }, data: { imageData: null, hasImage: false, version: Math.floor(Date.now() / 1000) } });
  return NextResponse.json({ ok: true });
}
