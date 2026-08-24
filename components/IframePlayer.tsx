'use client';

import { useEffect, useState } from 'react';

interface SonicInfo {
  nowplaying?: string;
  song?: string;
  artist?: string;
  title?: string;
  [key: string]: unknown;
}

interface IframePlayerProps {
  width?: number | null;
}

export default function IframePlayer({ width }: IframePlayerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sonicInfo, setSonicInfo] = useState<SonicInfo | null>(null);

  useEffect(() => {
    const fetchSonicInfo = async () => {
      try {
        const res = await fetch('/api/sonic', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSonicInfo(data);
        }
      } catch (error) {
        console.error('Error cargando el tema en vivo:', error);
      }
    };

    fetchSonicInfo();
    const interval = setInterval(fetchSonicInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  const excludedTrack = 'FAITH NO MORE - Smaller And Smaller';

  const rawNowPlaying =
    sonicInfo?.nowplaying ||
    sonicInfo?.song ||
    (sonicInfo?.artist && sonicInfo?.title
      ? `${sonicInfo.artist} - ${sonicInfo.title}`
      : sonicInfo?.title || 'SINTONIZANDO...');

  const nowPlayingTrack =
    rawNowPlaying.trim().toUpperCase() === excludedTrack.toUpperCase()
      ? 'Radio en Casa — Transmisión Oficial'
      : rawNowPlaying;

  const defaultImageUrl =
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80';

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto font-mono select-none flex items-center justify-between gap-3 h-[52px]"
      style={{
        width: width ? `${width}px` : '64vw',
        maxWidth: '100vw',
      }}
    >
      {/* 1. LOGO CON REBOTE SUTIL (CUBIC-BEZIER SUAVE) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="group cursor-pointer block flex-shrink-0 outline-none h-full z-20 transition-transform duration-500"
        style={{
          transform: isCollapsed
            ? `translateX(calc(${width ? width / 2 : 300}px - 26px))`
            : 'translateX(0px)',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.15, 0.64, 1)',
        }}
        aria-label={isCollapsed ? 'Expandir reproductor' : 'Colapsar reproductor'}
        title={isCollapsed ? 'Click para expandir' : 'Click para ocultar reproductor'}
      >
        <div className="w-[52px] h-[52px] bg-[#f74a35] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xl animate-pulse">
          <img
            src="/icon.svg"
            alt="Radio en Casa"
            className="h-5 w-auto filter drop-shadow"
          />
        </div>
      </button>

      {/* 2. CONTENEDOR DESPLEGABLE */}
      <div
        className={`bg-[#f2f2f2] text-neutral-900 border border-neutral-400/80 shadow-2xl flex items-center justify-between gap-3 md:gap-4 overflow-hidden transition-all duration-500 ease-in-out flex-1 h-[52px] ${
          isCollapsed
            ? 'max-w-0 opacity-0 pointer-events-none px-0 py-0 border-opacity-0 scale-95'
            : 'max-w-full opacity-100 translate-x-0 px-4 py-0 border-opacity-100 scale-100'
        }`}
      >
        {/* TEXTO EN VIVO */}
        <div className="flex-shrink-0 flex items-center text-[#f74a35] text-[11px] md:text-xs font-bold uppercase tracking-widest pl-1">
          <span>EN VIVO</span>
        </div>

        {/* PORTADA RECTA */}
        <div className="relative w-[36px] h-[36px] border border-neutral-300 overflow-hidden flex-shrink-0 bg-neutral-900">
          <img
            src={defaultImageUrl}
            alt="Radio en Casa"
            className="w-full h-full object-cover filter contrast-110 grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>

        {/* PLAYER DE AUDIO */}
        <div className="flex-shrink-0 w-[160px] sm:w-[190px] md:w-[220px] h-[36px] flex items-center overflow-hidden border-l border-neutral-300 pl-2">
          <audio
            id="stream"
            controls
            autoPlay
            preload="auto"
            className="w-full"
            style={{
              transform: 'scale(0.92)',
              transformOrigin: 'center center',
            }}
          >
            <source src="https://streaming01.shockmedia.com.ar/9018/;" type="audio/mpeg" />
            Tu navegador no soporta audio.
          </audio>
        </div>

        {/* MARQUESINA $NOWPLAYING */}
        <div className="flex items-center gap-2 border-l border-neutral-300 pl-3 overflow-hidden flex-1 h-[36px]">
          <div className="flex-shrink-0 bg-[#2a2a2a] text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-neutral-800">
            <span>NOW PLAYING:</span>
          </div>

          <div className="overflow-hidden w-full relative flex items-center">
            <div className="flex w-max animate-marquee space-x-6 whitespace-nowrap text-[11px] md:text-xs font-bold text-[#f74a35]">
              <span>{nowPlayingTrack}</span>
              <span>{nowPlayingTrack}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}