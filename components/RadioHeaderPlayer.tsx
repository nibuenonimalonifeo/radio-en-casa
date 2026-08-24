'use client';

import { useState, useEffect } from 'react';

interface PlayedSong {
  title?: string;
  song?: string;
  artist?: string;
  time?: string;
  image?: string;
  [key: string]: unknown;
}

interface SonicData {
  image?: string;
  song?: string;
  artist?: string;
  nowplaying?: string;
  played_last20?: PlayedSong[];
  [key: string]: unknown;
}

export default function RadioHeaderPlayer() {
  const [sonicData, setSonicData] = useState<SonicData | null>(null);

  const fetchSonicData = async () => {
    try {
      const res = await fetch('/api/sonic', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSonicData(data);
      }
    } catch (error) {
      console.error('Error fetching Sonic player data:', error);
    }
  };

  useEffect(() => {
    fetchSonicData();
    const interval = setInterval(fetchSonicData, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentSong =
    sonicData?.nowplaying ||
    sonicData?.song ||
    (sonicData?.artist ? `${sonicData.artist} - ${sonicData.song}` : 'Radio en Casa — En Vivo');

  const historyList = sonicData?.played_last20 || [];

  return (
    <div className="font-mono select-none">
      <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-2 shadow-2xl flex items-center gap-3">
        {/* 1. LOGO */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group cursor-pointer block flex-shrink-0"
          aria-label="Ir al inicio"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f74a35] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md">
            <img
              src="/icon.svg"
              alt="Radio en Casa"
              className="h-5 md:h-6 w-auto filter drop-shadow"
            />
          </div>
        </button>

        {/* 2. CANCIÓN EN VIVO */}
        <div className="border-l border-[#5c5c5c]/40 pl-3 flex items-center gap-2 overflow-hidden w-[160px] sm:w-[200px] md:w-[240px] h-10 md:h-12">
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#f74a35] text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>EN VIVO:</span>
          </div>

          <div className="overflow-hidden w-full relative">
            <div className="flex w-max animate-marquee space-x-6 whitespace-nowrap text-white font-bold text-[11px]">
              <span>{currentSong}</span>
              <span>{currentSong}</span>
            </div>
          </div>
        </div>

        {/* 3. ÚLTIMAS 20 CANCIONES */}
        <div className="border-l border-[#5c5c5c]/40 pl-3 flex items-center gap-2 overflow-hidden w-[220px] sm:w-[300px] md:w-[380px] h-10 md:h-12">
          <div className="flex-shrink-0 bg-[#2a2a2a] text-neutral-300 border border-[#5c5c5c]/40 px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
            ÚLTIMAS 20:
          </div>

          <div className="overflow-x-auto overflow-y-hidden w-full flex items-center gap-2 custom-scrollbar py-1">
            {historyList.length > 0 ? (
              historyList.map((track, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 flex-shrink-0 bg-[#2a2a2a] px-2 py-1 border border-[#5c5c5c]/30 text-[10px] whitespace-nowrap"
                >
                  <span className="text-[#f74a35] font-bold">{idx + 1}.</span>
                  <span className="text-white font-semibold truncate max-w-[110px]">
                    {track.song || track.title || 'Canción'}
                  </span>
                  {track.artist && (
                    <span className="text-neutral-400 truncate max-w-[80px]">
                      — {track.artist}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-neutral-400 text-[10px] whitespace-nowrap">
                Cargando lista de temas...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}