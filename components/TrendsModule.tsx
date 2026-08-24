import { headers } from 'next/headers';

// Fuerza a Next.js a no renderizar este componente de forma estática durante el build
export const dynamic = 'force-dynamic';

interface TrendItem {
  id: number;
  topic: string;
  volume: string;
}

export default async function TrendsModule() {
  // 1. Leemos el país que identificó el middleware en los headers HTTP
  const headersList = await headers();
  const countryCode = (headersList.get('x-user-country') || 'AR').toUpperCase();

  const countryNames: Record<string, string> = {
    AR: 'Argentina',
    ES: 'España',
    MX: 'México',
    CL: 'Chile',
    CO: 'Colombia',
    UY: 'Uruguay',
    US: 'Estados Unidos',
    BR: 'Brasil',
  };

  const countryName = countryNames[countryCode] || countryCode;

  // 2. Determinamos el host para construir una URL absoluta válida
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/trends?country=${countryCode}`;

  let trends: TrendItem[] = [];

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Garantiza que siempre pida datos frescos a la API
    });

    if (res.ok) {
      trends = await res.json();
    } else {
      console.error(`Error al pedir tendencias a la API: status ${res.status}`);
    }
  } catch (err) {
    console.error('Error de conexión con la API de trends:', err);
  }

  return (
    <section className="w-full bg-[#161616] text-[#f2f2f2] py-6 px-4 font-mono">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#f74a35] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f74a35] animate-pulse" />
            TOP 5 TENDENCIAS — {countryName.toUpperCase()} ({countryCode})
          </h3>
          <span className="text-[10px] text-neutral-500 uppercase">
            Google Trends en vivo
          </span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {trends.length > 0 ? (
            trends.slice(0, 5).map((item, index) => (
              <li
                key={item.id || index}
                className="bg-[#242424] p-3 border-l-2 border-[#f74a35] flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-[#f74a35] font-bold block mb-1">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-bold truncate text-white" title={item.topic}>
                    {item.topic}
                  </p>
                </div>
                {item.volume && (
                  <span className="text-[10px] text-neutral-400 mt-2 block">
                    {item.volume} búsquedas
                  </span>
                )}
              </li>
            ))
          ) : (
            <p className="text-xs text-neutral-500 col-span-5">
              Cargando tendencias...
            </p>
          )}
        </ol>
      </div>
    </section>
  );
}