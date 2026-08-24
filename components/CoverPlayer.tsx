'use client';

import { useState, useRef } from 'react';

interface SonicInfo {
  title?: string;
  nowplaying?: string;
  song?: string;
  artist?: string;
  image?: string;
  url?: string;
  unique_listeners?: number | string;
  online_listeners?: number | string;
  listeners?: number | string;
  bitrate?: number | string;
  djusername?: string;
  djprofile?: string;
  status?: string;
  [key: string]: unknown;
}

interface CoverPlayerProps {
  sonicInfo: SonicInfo | null;
}

export default function CoverPlayer({ sonicInfo }: CoverPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // URL DEL REPRODUCTOR OFICIAL DE SHOCKMEDIA
  const officialPlayerUrl =
    'https://shockmedia.com.ar/reproductor/reproductores/?idr=MjQ0';

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const currentTrack =
    sonicInfo?.title ||
    sonicInfo?.nowplaying ||
    sonicInfo?.song ||
    (sonicInfo?.artist && sonicInfo?.title
      ? `${sonicInfo.artist} - ${sonicInfo.title}`
      : 'Radio en Casa — Transmisión Oficial');

  return (
    <div className="w-full bg-[#181818] border border-[#f74a35] p-6 sm:p-8 shadow-2xl relative overflow-hidden font-mono">
      {/* HEADER DEL REPRODUCTOR */}
      <div className="flex justify-between items-center border-b border-[#5c5c5c]/40 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f74a35] animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            CUSTOM PLAYER REC
          </span>
        </div>
        <span className="text-[10px] bg-[#f74a35] text-white px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm">
          {sonicInfo?.status || 'ONLINE'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* CARÁTULA ($image) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="w-full max-w-[220px] aspect-square bg-[#111111] border border-[#5c5c5c]/60 relative overflow-hidden group shadow-xl">
            {sonicInfo?.image ? (
              <img
                src={sonicInfo.image}
                alt={currentTrack}
                className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
                <span className="text-4xl">📻</span>
                <span className="text-[10px] font-bold uppercase">SIN COVER</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2 left-2 text-[9px] bg-[#f74a35] text-white px-1.5 py-0.5 font-bold uppercase shadow-sm">
              $image
            </span>
          </div>

          {/* FICHA DEL DJ */}
          {sonicInfo?.djusername && (
            <div className="mt-3 flex items-center gap-2.5 bg-[#222222] border border-[#5c5c5c]/40 px-3 py-1.5 w-full max-w-[220px]">
              {sonicInfo.djprofile ? (
                <img
                  src={sonicInfo.djprofile}
                  alt={sonicInfo.djusername}
                  className="w-7 h-7 rounded-full object-cover border border-[#f74a35]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#f74a35] text-white text-[10px] font-bold flex items-center justify-center">
                  DJ
                </div>
              )}
              <div className="truncate">
                <span className="text-[8px] text-neutral-400 block font-bold uppercase">
                  AL MANDO
                </span>
                <p className="text-[11px] font-bold text-white truncate uppercase">
                  {sonicInfo.djusername}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* DATOS & CONTROLES */}
        <div className="md:col-span-8 space-y-6">
          {/* TRACK AHORA SONANDO */}
          <div className="space-y-1">
            <span className="text-[10px] text-[#f74a35] font-bold uppercase tracking-widest block">
              SONANDO AHORA ($nowplaying)
            </span>
            <h3
              className="text-xl sm:text-2xl text-white uppercase leading-tight truncate"
              style={{ fontFamily: "'Special Gothic Expanded One', sans-serif" }}
            >
              {currentTrack}
            </h3>
          </div>

          {/* CONTROLES DE AUDIO PERSONALIZADOS */}
          <div className="bg-[#222222] p-4 border border-[#5c5c5c]/40 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* BOTÓN CON CAMBIO DE COLOR DINÁMICO */}
              <button
                onClick={togglePlay}
                className={`w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer ${
                  isPlaying
                    ? 'bg-[#1b9aaa] hover:bg-[#f74a35] text-white'
                    : 'bg-[#f74a35] hover:bg-[#f9b92f] text-white hover:text-neutral-900'
                }`}
              >
                {isPlaying ? '⏸ PAUSAR REPRODUCCIÓN' : '▶ REPRODUCIR EN VIVO'}
              </button>

              {/* BARRA DE VOLUMEN Y MUTE PERSONALIZADA */}
              <div className="w-full sm:w-auto flex items-center gap-3 bg-[#111111] px-4 py-2 border border-[#5c5c5c]/40">
                <button
                  onClick={toggleMute}
                  className="text-xs text-[#f9b92f] hover:text-[#f74a35] transition-colors cursor-pointer"
                  title={isMuted ? 'Desactivar silencio' : 'Silenciar'}
                >
                  {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-28 sm:w-36 accent-[#f9b92f] cursor-pointer"
                />

                <span className="text-xs font-bold text-[#f9b92f] w-10 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>

            {/* IFRAME INTEGRADO SI SE ACTIVA */}
            {isPlaying && (
              <div className="w-full h-24 pt-2 border-t border-[#5c5c5c]/40">
                <iframe
                  ref={iframeRef}
                  src={officialPlayerUrl}
                  className="w-full h-full border-0 rounded"
                  allow="autoplay"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}