import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

  // 1. Obtener país mediante parámetro o headers del CDN (Cloudflare/Render/Vercel)
  let countryCode = searchParams.get('country')?.trim().toUpperCase();

  if (!countryCode) {
    countryCode = (
      request.headers.get('x-user-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      ''
    ).trim().toUpperCase();
  }

  if (!countryCode || countryCode === 'XX') {
    try {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '';

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
      console.warn('No se pudo geolocalizar por IP:', e);
    }
  }

  countryCode = countryCode || 'AR';
  const countrySlug = COUNTRY_SLUGS[countryCode] || 'argentina';

  try {
    const targetUrl = `https://trends24.in/${countrySlug}/`;

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} al consultar ${countrySlug}`);

    const html = await res.text();

    // Regex ampliado para capturar las etiquetas <a> dentro de los elementos de lista trend-card de Trends24
    const matches = Array.from(
      html.matchAll(/<a[^>]*href="[^"]*(?:search\?q=|twitter\.com|x\.com|\/trend\/)[^"]*"[^>]*>(.*?)<\/a>/gi)
    );

    const xTrends = matches
      .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim())
      .filter((topic) => topic.length > 0 && !topic.toLowerCase().includes('trends24'))
      .filter((topic, index, self) => self.indexOf(topic) === index) // Filtra duplicados
      .slice(0, 10)
      .map((topic, index) => ({
        id: index + 1,
        topic: topic,
        volume: `Tendencia en ${countryCode}`,
      }));

    if (xTrends.length === 0) {
      throw new Error('No se encontraron trends en la estructura parseada');
    }

    return NextResponse.json(xTrends);
  } catch (error) {
    console.error(`Error obteniendo tendencias para ${countryCode}:`, error);

    // Fallback limpio
    return NextResponse.json([
      { id: 1, topic: '#RadioEnCasa', volume: `Tendencia en ${countryCode}` },
      { id: 2, topic: 'Música en Vivo', volume: `Tendencia en ${countryCode}` },
      { id: 3, topic: 'Tendencias Globales', volume: `Tendencia en ${countryCode}` },
      { id: 4, topic: '#Streaming', volume: `Tendencia en ${countryCode}` },
      { id: 5, topic: 'Cultura Digital', volume: `Tendencia en ${countryCode}` },
      { id: 6, topic: 'Cultura Independiente', volume: `Tendencia en ${countryCode}` },
      { id: 7, topic: '#SalgoArriba', volume: `Tendencia en ${countryCode}` },
      { id: 8, topic: 'Podcasts', volume: `Tendencia en ${countryCode}` },
      { id: 9, topic: '#ProyectoRosca', volume: `Tendencia en ${countryCode}` },
      { id: 10, topic: 'Radio Online', volume: `Tendencia en ${countryCode}` },
    ]);
  }
}