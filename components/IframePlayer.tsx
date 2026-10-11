'use client';

import { useState, useEffect, useRef } from 'react';

interface StreamInfo {
  nowPlaying: string;
  image: string;
  onlineListeners: number;
  uniqueListeners: number;
  history: string[];
  streamUrl: string;
}

export default function IframePlayer({ 
  width = 280,
  isForceCollapsed = false 
}: { 
  width?: number;
  isForceCollapsed?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamInfo, setStreamInfo] = useState<StreamInfo>({
    nowPlaying: 'Radio en Casa - En Vivo',
    image: '',
    onlineListeners: 0,
    uniqueListeners: 0,
    history: [],
    streamUrl: '/api/stream/audio',
  });

  const fetchStreamData = async () => {
    try {
      const res = await fetch('/api/stream', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStreamInfo(data);
      }
    } catch (err) {
      console.warn('Error cargando info del stream:', err);
    }
  };

  useEffect(() => {
    fetchStreamData();
    const interval = setInterval(fetchStreamData, 10000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const audioSource = `/api/stream/audio?t=${Date.now()}`;
      audioRef.current.src = audioSource;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Error al reproducir audio:', err);
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div 
      className={`w-full bg-[#121212] border-0 p-3 shadow-2xl flex flex-col items-center gap-3 font-datatype text-left rounded-none ${
        isForceCollapsed ? 'hidden' : 'block'
      }`}
      style={{ maxWidth: `${width}px` }}
    >
      <audio
        ref={audioRef}
        id="radio-audio-element"
        preload="none"
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />

      {/* PORTADA EN GRANDE OCUPANDO EL ANCHO DEL MÓDULO */}
      <div className="w-full h-44 bg-black/90 border-0 overflow-hidden relative flex-shrink-0 flex items-center justify-center rounded-none">
        {streamInfo.image ? (
          <img
            src={streamInfo.image}
            alt="Tapa del tema"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-[#f74a35] font-black text-xl font-datatype">RADIO EN CASA</span>
        )}
        
        {isPlaying && (
          <div className="absolute top-2 left-2 bg-[#f74a35] text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider animate-pulse font-datatype z-10 shadow-md rounded-none">
            LIVE
          </div>
        )}
      </div>

      {/* CONTROLES DEL PLAYER (PLAY / PAUSA Y VOLUMEN) */}
      <div className="w-full bg-black/80 p-2 border-0 flex items-center justify-between gap-2.5 rounded-none">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-[#f74a35] hover:bg-[#d93a26] text-white flex items-center justify-center text-xs font-bold shadow-lg transition-transform active:scale-95 flex-shrink-0 cursor-pointer"
          title={isPlaying ? 'Pausar transmisión' : 'Escuchar en vivo'}
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            '❚❚'
          ) : (
            '▶'
          )}
        </button>

        <div className="flex-1 flex items-center gap-2 px-1">
          <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition-colors cursor-pointer" title={isMuted ? 'Activar sonido' : 'Silenciar'}>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              {isMuted || volume === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              )}
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 accent-[#f74a35] bg-neutral-800 cursor-pointer rounded-none"
          />
        </div>
      </div>

      {/* TÍTULO DEL TEMA SONANDO EN VIVO */}
      <div className="w-full bg-black/60 p-2.5 border-0 font-datatype text-left space-y-1 rounded-none">
        <span className="text-[8.5px] uppercase font-bold text-[#f74a35] tracking-widest block font-datatype">
          NOW PLAYING:
        </span>
        <p className="text-neutral-200 !text-[13px] sm:!text-[14px] font-bold leading-relaxed font-datatype m-0 truncate" title={streamInfo.nowPlaying}>
          {streamInfo.nowPlaying}
        </p>
      </div>
    </div>
  );
}