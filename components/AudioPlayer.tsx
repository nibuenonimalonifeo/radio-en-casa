'use client';

import React, { useState, useRef } from 'react'; // 👈 Asegúrate de importar React si te pide tipos

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Importante: React.ChangeEvent<HTMLInputElement>
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  return (
    <div className="flex items-center gap-3 p-1.5 px-3 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full shadow-lg text-white">
      <audio ref={audioRef} preload="none">
        <source src="https://streaming01.shockmedia.com.ar/9018/;" type="audio/mpeg" />
      </audio>

      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-[#f74a35] hover:bg-[#ff5c47] text-white flex items-center justify-center transition-transform hover:scale-105 shrink-0"
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex flex-col overflow-hidden hidden sm:flex">
        <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">Radio</span>
        <span className="text-[11px] font-semibold flex items-center gap-1.5 leading-none">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPlaying ? 'bg-[#00ff66] shadow-[0_0_6px_#00ff66]' : 'bg-neutral-600'
            }`}
          />
          <span className={isPlaying ? 'text-[#00ff66]' : 'text-neutral-400'}>
            {isPlaying ? 'EN VIVO' : 'PAUSADO'}
          </span>
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolumeChange}
        className="w-10 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#f74a35] hidden md:block"
      />
    </div>
  );
}