import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ['', 1],
    ['/nosotros', 0.7],
    ['/menu', 0.9],
    ['/tardes-de-te', 0.7],
    ['/meriendas', 0.7],
    ['/eventos', 0.8],
    ['/contacto', 0.8],
    ['/reservas', 0.9],
  ];
  return pages.map(([path, priority]) => ({ url: `${SITE.url}${path}`, lastModified: new Date(), changeFrequency: 'monthly', priority }));
}
