import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://radioencasa.com'),
  title: 'Radio en Casa — Mudamos la forma de hacer radio',
  description:
    'Radio online, estudio de podcast, streaming y producciones audiovisuales desde Palermo Soho, Buenos Aires.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://radioencasa.com/',
    siteName: 'Radio en Casa',
    title: 'Radio en Casa — Mudamos la forma de hacer radio',
    description:
      'Radio online, estudio de podcast, streaming y producciones audiovisuales desde Palermo Soho, Buenos Aires.',
    images: [
      {
        url: '/og-radio-en-casa.jpg',
        width: 1200,
        height: 630,
        alt: 'Radio en Casa — Estudio de radio, podcast y streaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@radioencasa',
    title: 'Radio en Casa — Mudamos la forma de hacer radio',
    description:
      'Radio online, estudio de podcast, streaming y producciones audiovisuales desde Palermo Soho, Buenos Aires.',
    images: ['/og-radio-en-casa.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}