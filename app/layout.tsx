import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-JGMF9SXT6D';

export const metadata: Metadata = {
  metadataBase: new URL('https://radioencasa.com'),
  title: {
    default: 'RADIO EN CASA | Podcast & Streaming',
    template: '%s | RADIO EN CASA',
  },
  description:
    'Medio independiente de producciones audiovisuales: Radio, Podcast y Streaming. Más de 10 años difundiendo emprendedores y artistas de nuestra comunidad.',
  keywords: [
    'radio en casa',
    'estudio de podcast buenos aires',
    'alquiler estudio podcast palermo',
    'estudio de streaming caba',
    'radio online argentina',
    'grabacion podcast palermo soho',
    'produccion audiovisual streaming',
  ],
  authors: [{ name: 'Radio en Casa', url: 'https://radioencasa.com' }],
  creator: 'Radio en Casa',
  publisher: 'Radio en Casa',
  alternates: {
    canonical: 'https://radioencasa.com/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://radioencasa.com/',
    siteName: 'Radio en Casa',
    title: 'RADIO EN CASA | Podcast & Streaming',
    description:
      'Medio independiente de producciones audiovisuales: Radio, Podcast y Streaming. Más de 10 años difundiendo emprendedores y artistas de nuestra comunidad.',
    images: [
      {
        url: '/og-radio-en-casa.jpg',
        width: 1200,
        height: 630,
        alt: 'Radio en Casa — Estudio de radio, podcast y streaming en Palermo Soho',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@radioencasa',
    title: 'RADIO EN CASA | Podcast & Streaming',
    description:
      'Medio independiente de producciones audiovisuales: Radio, Podcast y Streaming. Más de 10 años difundiendo emprendedores y artistas de nuestra comunidad.',
    images: ['/og-radio-en-casa.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'RadioStation'],
      '@id': 'https://radioencasa.com/#organization',
      name: 'Radio en Casa',
      url: 'https://radioencasa.com',
      logo: 'https://radioencasa.com/icon.svg',
      image: 'https://radioencasa.com/og-radio-en-casa.jpg',
      description:
        'Medio independiente de producciones audiovisuales: Radio, Podcast y Streaming. Más de 10 años difundiendo emprendedores y artistas de nuestra comunidad.',
      foundingDate: '2016',
      telephone: '+54-11-4831-7132',
      email: 'info@radioencasa.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Malabia 2134',
        addressLocality: 'Palermo Soho, Ciudad Autónoma de Buenos Aires',
        addressRegion: 'CABA',
        postalCode: 'C1425EZD',
        addressCountry: 'AR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -34.5893083,
        longitude: -58.4238515,
      },
      sameAs: [
        'https://www.instagram.com/radioencasa/',
        'https://www.facebook.com/RadioEnCasa',
        'https://x.com/radioencasa',
        'https://www.tiktok.com/@radioencasa',
        'https://www.youtube.com/radioencasa',
        'https://www.twitch.tv/radioencasa',
        'https://www.linkedin.com/company/radioencasa',
        'https://radioencasa.substack.com',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Boldonse&family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Datatype:wght@400..900&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}