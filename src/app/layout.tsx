import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
const sans = Jost({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Pastelería y café en Mendoza`, template: `%s | ${SITE.shortName} Pastelería y Café` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ['pastelería Mendoza', 'cafetería Mendoza', 'café Mendoza', 'merienda libre Mendoza', 'tarde de té', 'candy bar Mendoza', 'sin TACC Mendoza', 'Olivia Pastelería y Café'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: 'Olivia Pastelería y Café – logo' }],
  },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description, images: ['/img/og.jpg'] },
  robots: SITE.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#FBF6EE', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${serif.variable} ${script.variable} ${sans.variable}`}>
      <body>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
