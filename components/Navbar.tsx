'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detecta si la página ha bajado más de 50px para añadir un fondo/desenfoque
      setIsScrolled(currentScrollY > 50);

      // Oculta al bajar, muestra al subir
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out px-6 md:px-16 py-6 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-4 rounded-full transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-900/80 backdrop-blur-md border border-neutral-800 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Logo / Marca */}
        <Link href="/" className="text-lg font-bold tracking-tight text-[#ececec]">
          FLOC<span className="text-neutral-500">.</span>
        </Link>

        {/* Enlaces de Navegación */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="#proyectos" className="hover:text-white transition-colors duration-200">
            Proyectos
          </Link>
          <Link href="#estudio" className="hover:text-white transition-colors duration-200">
            Estudio
          </Link>
          <Link href="#servicios" className="hover:text-white transition-colors duration-200">
            Servicios
          </Link>
        </nav>

        {/* Botón Call to Action */}
        <Link
          href="#contacto"
          className="text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-neutral-700 text-[#ececec] hover:bg-white hover:text-black transition-all duration-300"
        >
          Contacto
        </Link>
      </div>
    </header>
  );
}