'use client';

import { useEffect, useState } from 'react';

export default function AlbumCover() {
  const [songInfo, setSongInfo] = useState<{ title: string; artwork: string }>({
    title: 'Radio Guapo',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  });

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch('/api/now-playing');
        if (!res.ok) throw new Error('Error al obtener metadata');
        const data = await res.json();
        
        if (data.title) {
          setSongInfo({
            title: data.title,
            artwork: data.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          });
          setHasError(false);
        }
      } catch (e) {
        console.error('Error cargando la carátula:', e);
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 12000);

    return () => clearInterval(interval);
  }, []);

  const fallbackImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="flex items-center gap-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-2.5 rounded-2xl shadow-2xl transition-all duration-300 hover:border-neutral-700 max-w-[220px] shrink-0 pointer-events-auto">
      
      {/* CONTENEDOR DE LA CARÁTULA CON EFECTO BORDER */}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/50 flex items-center justify-center">
        <img
          src={hasError ? fallbackImage : songInfo.artwork}
          alt={songInfo.title}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>

      {/* TITULO Y ESTADO EN VIVO */}
      <div className="flex flex-col overflow-hidden font-mono pr-1">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f74a35] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f74a35]"></span>
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#f74a35] font-semibold">
            En Vivo
          </span>
        </div>
        <span className="text-xs text-neutral-200 font-medium truncate mt-0.5" title={songInfo.title}>
          {songInfo.title}
        </span>
      </div>
    </div>
  );
}