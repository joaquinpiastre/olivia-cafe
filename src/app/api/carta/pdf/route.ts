import { PDFDocument } from 'pdf-lib';
import { getMenuPages } from '@/lib/menu';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// PDF con las 4 páginas de la carta, armado con las imágenes vigentes.
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const pages = await getMenuPages();
  const pdf = await PDFDocument.create();
  pdf.setTitle('Carta – Olivia Pastelería y Café');

  for (const p of pages) {
    const res = await fetch(new URL(p.src, origin));
    if (!res.ok) continue;
    const bytes = new Uint8Array(await res.arrayBuffer());
    const img = await pdf.embedJpg(bytes);
    const width = 595;
    const height = (img.height / img.width) * width;
    const page = pdf.addPage([width, height]);
    page.drawImage(img, { x: 0, y: 0, width, height });
  }

  const out = await pdf.save();
  return new Response(out as unknown as BodyInit, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="carta-olivia.pdf"', 'Cache-Control': 'public, max-age=300' },
  });
}
