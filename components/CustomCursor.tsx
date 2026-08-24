'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Posición del ratón utilizando gsap.quickTo para rendimiento óptimo
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Detección de elementos interactivos con atributos data-cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]');

      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsHovered(true);
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out hidden md:flex ${
        isHovered
          ? 'w-24 h-24 bg-white text-black text-xs font-bold uppercase tracking-widest scale-100'
          : 'w-4 h-4 bg-white/50 backdrop-blur-sm scale-75'
      }`}
    >
      {isHovered && <span>{cursorText}</span>}
    </div>
  );
}