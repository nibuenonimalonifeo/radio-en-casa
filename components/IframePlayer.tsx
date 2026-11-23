'use client';

import { useState, useEffect, useRef } from 'react';

interface StreamInfo {
  nowPlaying: string;
  image?: string;
  onlineListeners: number;
  uniqueListeners: number;
  history: string[];
  streamUrl: string;
}

const FALLBACK_COVER = '/images/servicios/Radio_en_Casa_logo_REC-04.svg';

export default function IframePlayer({
  width = 280,
  isForceCollapsed = false,
}: {
  width?: number;
  isForceCollapsed?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [streamInfo, setStreamInfo] = useState<StreamInfo>({
    nowPlaying: 'Radio en Casa - En Vivo',
    image: FALLBACK_COVER,
    onlineListeners: 0,
    uniqueListeners: 0,
    history: [],
    streamUrl: '/api/stream/audio',
  });

  const activeCover = streamInfo.image || FALLBACK_COVER;

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

  useEffect(() => {
    setImgError(false);
  }, [activeCover]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: streamInfo.nowPlaying || 'Radio en Casa',
        artist: 'EN VIVO',
        album: 'Radio en Casa',
        artwork: [
          { src: activeCover, sizes: '512x512', type: 'image/png' },
        ],
      });
    }
  }, [streamInfo.nowPlaying, activeCover]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const audioSource = `/api/stream/audio?t=${Date.now()}`;
      audioRef.current.src = audioSource;
      audioRef.current.volume = isMuted ? 0 : volume / 100;

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

  const handleGoToContacto = () => {
    const contactoEl = document.getElementById('contacto');
    if (contactoEl) {
      contactoEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contacto';
    }
  };

  const isFallback = imgError || activeCover === FALLBACK_COVER;

  return (
    <div
      className={`w-full bg-[#121212] p-3 shadow-2xl flex flex-col items-center gap-3 font-datatype text-left rounded-xl ${
        isForceCollapsed ? 'hidden' : 'block'
      }`}
      style={{ maxWidth: `${width}px` }}
    >
      <style jsx>{`
        @keyframes vinylSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-vinyl-loop {
          animation: vinylSpin 5.5s linear infinite;
          transform-origin: 96px 76px;
        }
      `}</style>

      <audio
        ref={audioRef}
        id="radio-audio-element"
        preload="none"
        playsInline
        crossOrigin="anonymous"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onCanPlay={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Audio element error:', e);
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />

      {/* PORTADA / BANDEJA GIRADISCOS FLAT CON LOGO SVG OFICIAL EN EL CENTRO */}
      <div className="w-full h-44 bg-[#181818] overflow-hidden relative flex-shrink-0 flex items-center justify-center rounded-xl">
        {isFallback ? (
          <div className="w-full h-full relative select-none overflow-hidden">
            <svg
              viewBox="0 0 240 168"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full block"
              role="img"
              aria-label="Bandeja de vinilo girando - Radio en Casa"
            >
              {/* Detalles mínimos de la bandeja */}
              <circle cx="24" cy="24" r="3.5" fill="#f74a35" />
              <rect x="34" y="22.5" width="12" height="3" rx="1.5" fill="#2c2c2c" />

              {/* Plato metálico */}
              <circle cx="96" cy="76" r="68" fill="#222222" />

              {/* Disco de vinilo girando en loop */}
              <g className="animate-vinyl-loop">
                <circle cx="96" cy="76" r="64" fill="#090909" />

                {/* Surcos concéntricos flat */}
                <circle cx="96" cy="76" r="56" fill="none" stroke="#181818" strokeWidth="1" />
                <circle cx="96" cy="76" r="48" fill="none" stroke="#151515" strokeWidth="1" />
                <circle cx="96" cy="76" r="40" fill="none" stroke="#181818" strokeWidth="1" />
                <circle cx="96" cy="76" r="32" fill="none" stroke="#151515" strokeWidth="1" />

                {/* Reflejos diagonales flat */}
                <path
                  d="M 96 12 A 64 64 0 0 1 151.4 44 L 118.2 63.2 A 25.6 25.6 0 0 0 96 50.4 Z"
                  fill="#ffffff"
                  opacity="0.065"
                />
                <path
                  d="M 96 140 A 64 64 0 0 1 40.6 108 L 73.8 88.8 A 25.6 25.6 0 0 0 96 101.6 Z"
                  fill="#ffffff"
                  opacity="0.065"
                />

                {/* Galleta central roja SVG oficial (512x512 escalada exacta a radio 22 en 96,76) */}
                <g transform="translate(96, 76) scale(0.0859375) translate(-256, -256)">
                  <circle fill="#F74A35" cx="256" cy="256" r="256" />
                  <g>
                    <path
                      fill="#E3E3E3"
                      d="M359.789,231.893L359.789,231.893c0-23.738-19.242-42.981-42.98-42.981H154.248v135.801h39.426v-96.375h124.499v8.761H204.991v39.426h24.641l15.472,37.368c2.712,6.55,9.101,10.819,16.19,10.819h96.475v-39.426h-83.44l-3.629-8.761h44.456C339.705,276.525,359.789,256.44,359.789,231.893z"
                    />
                    <path
                      fill="#E3E3E3"
                      d="M435.043,237.099v-44.872c0-45.056-36.525-81.581-81.581-81.581H158.556c-45.056,0-81.581,36.525-81.581,81.581v129.17c0,45.056,36.525,81.581,81.581,81.581h35.118v-33.992l28.799,33.992h130.988c45.056,0,81.581-36.525,81.581-81.581v-36.111h-47.589v70.124h-262.89V158.24h262.89v78.859H435.043z"
                    />
                  </g>
                </g>
              </g>

              {/* Eje central fijo */}
              <circle cx="96" cy="76" r="4" fill="#ececec" />
              <circle cx="96" cy="76" r="1.5" fill="#121212" />

              {/* Brazo fonocaptor geométrico flat */}
              <g
                style={{
                  transformOrigin: '198px 34px',
                  transform: isPlaying ? 'rotate(0deg)' : 'rotate(-16deg)',
                  transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <circle cx="198" cy="34" r="13" fill="#232323" />
                <circle cx="198" cy="34" r="7" fill="#323232" />
                <rect
                  x="201"
                  y="17"
                  width="11"
                  height="13"
                  rx="2.5"
                  transform="rotate(28 198 34)"
                  fill="#3e3e3e"
                />
                <path
                  d="M 198 34 L 180 78 L 158 100"
                  fill="none"
                  stroke="#dcdcdc"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g transform="translate(158, 100) rotate(44)">
                  <rect x="-4" y="-2.5" width="8" height="14" rx="2" fill="#f74a35" />
                  <rect x="-2.2" y="9.5" width="4.4" height="3.5" rx="1" fill="#ececec" />
                </g>
              </g>
            </svg>

            {/* FRANJA INFERIOR CON TEXTO EN 1 SOLA LÍNEA Y BOTÓN REDONDEADO */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-2.5 pt-5 pb-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex items-end justify-between gap-2">
              <p className="!text-[13px] sm:!text-[14px] !leading-[1.15] text-[#e3e3e3] font-datatype font-normal uppercase tracking-tight m-0 text-left">
                ¿QUERÉS SONAR
                <br />
                EN ESTA CASA?
              </p>
              <button
                type="button"
                onClick={handleGoToContacto}
                className="flex-shrink-0 bg-[#242424] hover:bg-[#f74a35] text-[#f74a35] hover:text-white rounded-full px-3 py-1.5 !text-[13px] sm:!text-[14px] font-normal uppercase tracking-wider font-datatype cursor-pointer transition-colors shadow-md leading-none"
              >
                ESCRIBINOS
              </button>
            </div>
          </div>
        ) : (
          <img
            key={activeCover}
            src={activeCover}
            alt={streamInfo.nowPlaying || 'Tapa del tema en vivo'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* CONTROLES DEL PLAYER (PLAY / PAUSA Y VOLUMEN) */}
      <div className="w-full bg-black/80 p-2 flex items-center justify-between gap-2.5 rounded-xl">
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
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
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
            aria-label="Volumen"
            className="w-full h-1 accent-[#f74a35] bg-neutral-800 cursor-pointer"
          />
        </div>
      </div>

      {/* TÍTULO DEL TEMA SONANDO EN VIVO */}
      <div className="w-full bg-black/60 p-2.5 font-datatype text-left space-y-1 rounded-xl">
        <span className="text-[8.5px] uppercase font-bold text-[#f74a35] tracking-widest block font-datatype">
          NOW PLAYING:
        </span>
        <p
          className="text-neutral-200 !text-[13px] sm:!text-[14px] font-bold leading-relaxed font-datatype m-0 truncate"
          title={streamInfo.nowPlaying}
        >
          {streamInfo.nowPlaying}
        </p>
      </div>
    </div>
  );
}
