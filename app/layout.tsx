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
      <body className="bg-[#0f0f0f] text-[#ececec] antialiased selection:bg-[#f74a35] selection:text-white">
        {children}
      </body>
    </html>
  );
}