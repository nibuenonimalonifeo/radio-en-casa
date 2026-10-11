import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mapeo de ISO Alpha-2 al slug que utiliza Trends24
const COUNTRY_SLUGS: Record<string, string> = {
  AR: 'argentina',
  ES: 'spain',
  MX: 'mexico',
  CL: 'chile',
  CO: 'colombia',
  PE: 'peru',
  UY: 'uruguay',
  VE: 'venezuela',
  EC: 'ecuador',
  BR: 'brazil',
  US: 'united-states',
  GB: 'united-kingdom',
  FR: 'france',
  IT: 'italy',
  DE: 'germany',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // 1. Obtener código de país explícito (si existe en query param)
  let countryCode = searchParams.get('country')?.trim().toUpperCase();

  // 2. Si no viene en la URL, revisar las cabeceras del CDN (Cloudflare / Vercel)
  if (!countryCode) {
    countryCode = (
      request.headers.get('x-user-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      ''
    ).trim().toUpperCase();
  }

  // 3. Si sigue sin detectarse (por ejemplo, en desarrollo local / localhost)
  if (!countryCode || countryCode === 'XX') {
    try {
      // Obtener la IP real del cliente
      const forwardedFor = request.headers.get('x-forwarded-for');
      const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '';

      // Consultar servicio público de IP Geolocation
      const ipGeoRes = await fetch(`https://ipinfo.io/${clientIp}/json`, {
        cache: 'no-store',
      });

      if (ipGeoRes.ok) {
        const ipGeoData = await ipGeoRes.json();
        if (ipGeoData.country) {
          countryCode = ipGeoData.country.toUpperCase();
        }
      }
    } catch (e) {
      console.warn('No se pudo geolocalizar por IP cliente:', e);
    }
  }

  // Si fallan todos los métodos, por defecto usa Argentina ('AR')
  countryCode = countryCode || 'AR';
  const countrySlug = COUNTRY_SLUGS[countryCode] || 'argentina';

  try {
    const targetUrl = `https://trends24.in/${countrySlug}/`;

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} al consultar ${countrySlug}`);

    const html = await res.text();

    // Extraemos la lista de tendencias del DOM de Trends24
    const matches = Array.from(
      html.matchAll(/<a href="http[s]?:\/\/(?:twitter|x)\.com\/search\?q=[^"]+"[^>]*>(.*?)<\/a>/g)
    );

    const xTrends = matches
      .map((m) => m[1].replace(/<[^>]+>/g, '').trim())
      .filter((topic) => topic.length > 0)
      .filter((topic, index, self) => self.indexOf(topic) === index) // Elimina duplicados
      .slice(0, 10) // Extrae los 10 primeros
      .map((topic, index) => ({
        id: index + 1,
        topic: topic,
        volume: `Tendencia en ${countryCode}`,
      }));

    if (xTrends.length === 0) {
      throw new Error('No se encontraron elementos en el DOM');
    }

    return NextResponse.json(xTrends);
  } catch (error) {
    console.error(`Error procesando tendencias para ${countryCode} (${countrySlug}):`, error);

    // Fallback garantizado de 10 tendencias
    return NextResponse.json([
      { id: 1, topic: '#RadioEnCasa', volume: 'Tendencia en X' },
      { id: 2, topic: 'Música en Vivo', volume: 'Tendencia en X' },
      { id: 3, topic: 'Tendencias Globales', volume: 'Tendencia en X' },
      { id: 4, topic: '#Streaming', volume: 'Tendencia en X' },
      { id: 5, topic: 'Cultura Digital', volume: 'Tendencia en X' },
      { id: 6, topic: 'Cultura Independiente', volume: 'Tendencia en X' },
      { id: 7, topic: '#SalgoArriba', volume: 'Tendencia en X' },
      { id: 8, topic: 'Podcasts', volume: 'Tendencia en X' },
      { id: 9, topic: '#ProyectoRosca', volume: 'Tendencia en X' },
      { id: 10, topic: 'Radio Online', volume: 'Tendencia en X' },
    ]);
  }
}