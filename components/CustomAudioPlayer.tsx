'use client';

interface SonicInfo {
  title?: string;
  nowplaying?: string;
  song?: string;
  artist?: string;
  image?: string;
  djusername?: string;
  djprofile?: string;
  status?: string;
  [key: string]: unknown;
}

export default function CustomAudioPlayer({ sonicInfo }: { sonicInfo: SonicInfo | null }) {
  // URL OFICIAL DEL REPRODUCTOR SHOCKMEDIA
  const officialPlayerUrl = 'https://streaming01.shockmedia.com.ar/9018/';

  const currentSong =
    sonicInfo?.title ||
    sonicInfo?.nowplaying ||
    sonicInfo?.song ||
    (sonicInfo?.artist && sonicInfo?.title
      ? `${sonicInfo.artist} - ${sonicInfo.title}`
      : 'Radio en Casa — Transmisión Oficial');

  return (
    <div className="w-full bg-[#181818] border border-[#f74a35] p-6 sm:p-8 shadow-2xl font-mono text-white relative overflow-hidden">
      {/* HEADER DEL REPRODUCTOR */}
      <div className="flex justify-between items-center border-b border-[#5c5c5c]/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f74a35] animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest">
            REPRODUCTOR OFICIAL SHOCKMEDIA REC
          </span>
        </div>
        <span className="text-[10px] bg-[#f74a35] px-2 py-0.5 font-bold uppercase">
          {sonicInfo?.status || 'ONLINE'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* CARÁTULA ($image) Y DJ AL MANDO */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[200px] aspect-square bg-[#111111] border border-[#5c5c5c]/60 relative overflow-hidden shadow-lg">
            {sonicInfo?.image ? (
              <img
                src={sonicInfo.image}
                alt={currentSong}
                className="w-full h-full object-cover filter contrast-110"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
                <span className="text-4xl">📻</span>
                <span className="text-[10px] font-bold uppercase">SIN PORTADA</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2 left-2 text-[9px] bg-[#f74a35] text-white px-1.5 py-0.5 font-bold uppercase shadow-sm">
              $image
            </span>
          </div>

          {sonicInfo?.djusername && (
            <div className="mt-3 flex items-center gap-2 bg-[#222222] border border-[#5c5c5c]/40 px-3 py-1.5 w-full max-w-[200px]">
              {sonicInfo.djprofile ? (
                <img
                  src={sonicInfo.djprofile}
                  alt={sonicInfo.djusername}
                  className="w-6 h-6 rounded-full object-cover border border-[#f74a35]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#f74a35] text-white text-[9px] font-bold flex items-center justify-center">
                  DJ
                </div>
              )}
              <div className="truncate">
                <span className="text-[8px] text-neutral-400 block font-bold uppercase">AL MANDO</span>
                <p className="text-[11px] font-bold text-white truncate uppercase">
                  {sonicInfo.djusername}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* REPRODUCTOR EN VIVO DE SHOCKMEDIA & TITULO */}
        <div className="md:col-span-8 space-y-5">
          <div>
            <span className="text-[10px] text-[#f74a35] font-bold uppercase block tracking-wider mb-1">
              SONANDO AHORA ($nowplaying)
            </span>
            <h3
              className="text-xl sm:text-2xl text-white uppercase leading-tight truncate"
              style={{ fontFamily: "'Special Gothic Expanded One', sans-serif" }}
            >
              {currentSong}
            </h3>
          </div>

          {/* MARCO CONTENEDOR DEL REPRODUCTOR EN VIVO */}
          <div className="bg-[#111111] p-2 border border-[#5c5c5c]/60 shadow-inner">
            <div className="w-full h-[180px] sm:h-[200px] overflow-hidden rounded bg-black">
              <iframe
                src={officialPlayerUrl}
                title="Shockmedia Live Player"
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}