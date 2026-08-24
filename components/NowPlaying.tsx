'use client';

import { useEffect, useState } from 'react';

export default function NowPlaying() {
  const [songInfo, setSongInfo] = useState<string>('Sintonizando...');

  useEffect(() => {
    let isMounted = true;

    const fetchNowPlaying = async () => {
      try {
        // Consultamos con timestamp para evitar cualquier cache del navegador
        const response = await fetch(`/api/now-playing?t=${Date.now()}`);
        if (!response.ok) throw new Error('Error al conectar');
        
        const data = await response.json();
        
        if (isMounted && data && data.song) {
          setSongInfo(data.song);
        }
      } catch (error) {
        if (isMounted) {
          setSongInfo('Radio en Vivo');
        }
      }
    };

    fetchNowPlaying();

    // Actualiza cada 10 segundos
    const interval = setInterval(fetchNowPlaying, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-neutral-900/80 border border-neutral-800 rounded-full max-w-[200px] xl:max-w-[280px] overflow-hidden">
      {/* Punto rojo titilante */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f74a35] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f74a35]"></span>
      </span>

      {/* Información del tema */}
      <div className="flex flex-col overflow-hidden">
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 leading-none mb-0.5">
          Sonando
        </span>
        <span className="text-[11px] font-mono text-neutral-200 truncate leading-none" title={songInfo}>
          {songInfo}
        </span>
      </div>
    </div>
  );
}