import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RADIO EN CASA | Radio + Podcast + Streaming + Outdoor',
  description: 'Mudamos la forma de hacer radio. Estudio profesional de radio, podcast y streaming en Palermo, Buenos Aires.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=DM+Sans:wght@400;500;700&family=Datatype:wght@400..900&family=Boldonse&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0f0f0f] text-[#ececec] antialiased selection:bg-[#f74a35] selection:text-white">
        {children}
      </body>
    </html>
  );
}