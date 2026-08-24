'use client';

import { useEffect, useState } from 'react';

export default function LiveArtist() {
  const [songInfo, setSongInfo] = useState<string>('Cargando información...');

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        // Enlace de metadata/stats directo de ShockMedia para la radio 9018
        const response = await fetch('https://streaming01.shockmedia.com.ar/9018/stats?json=1');
        const data = await response.json();
        
        // Si el servidor devuelve el título de la canción actual
        if (data && data.songtitle) {
          setSongInfo(data.songtitle);
        } else if (data && data.title) {
          setSongInfo(data.title);
        } else {
          setSongInfo('Radio en Vivo');
        }
      } catch (error) {
        // En caso de que la API directa restrinja CORS desde el cliente
        setSongInfo('En Vivo — Radio Guapo');
      }
    };

    fetchNowPlaying();

    // Actualiza la canción sonando cada 10 segundos
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 rounded-full px-5 py-2.5 max-w-md shadow-xl">
      {/* Indicador rojo titilante de transmisión en directo */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f74a35] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f74a35]"></span>
      </span>

      <div className="flex flex-col overflow-hidden">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Sonando Ahora
        </span>
        <span className="text-sm font-mono text-neutral-200 truncate font-medium">
          {songInfo}
        </span>
      </div>
    </div>
  );
}