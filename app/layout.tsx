import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guapo.studio',
  description: 'Estudio de diseño y desarrollo web con narrativas horizontales.',
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