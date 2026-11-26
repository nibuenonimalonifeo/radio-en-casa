import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_IMAGE = '/images/servicios/Radio_en_Casa_logo_REC-04.svg';

function cleanTrackTitle(rawTitle: string): string {
  return rawTitle
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s*[\(\[].*?[\)\]]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchItunesCover(title: string): Promise<string | null> {
  try {
    const cleaned = cleanTrackTitle(title);
    if (!cleaned || cleaned.toLowerCase().includes('radio en casa') || !cleaned.includes('-')) {
      return null;
    }

    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(cleaned)}&media=music&entity=song&limit=1`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;

    const json = await res.json();
    const artwork = json?.results?.[0]?.artworkUrl100;

    if (typeof artwork === 'string' && artwork.length > 0) {
      return artwork.replace('100x100bb', '600x600bb');
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveCoverUrl(art?: unknown, title?: string): Promise<string> {
  const rawArt = typeof art === 'string' ? art.trim() : '';
  const isNoCover = !rawArt || rawArt.toLowerCase().includes('nocover');

  if (!isNoCover) {
    let fullUrl = rawArt;
    if (rawArt.startsWith('http://')) {
      fullUrl = rawArt.replace('http://', 'https://');
    } else if (rawArt.startsWith('//')) {
      fullUrl = `https:${rawArt}`;
    } else if (rawArt.startsWith('/')) {
      fullUrl = `https://streaming01.shockmedia.com.ar${rawArt}`;
    } else if (!rawArt.startsWith('https://')) {
      fullUrl = `https://streaming01.shockmedia.com.ar/${rawArt}`;
    }

    const cacheKey = encodeURIComponent(title || String(Date.now()));
    return `/api/stream/cover?url=${encodeURIComponent(fullUrl)}&v=${cacheKey}`;
  }

  if (title) {
    const itunesArt = await fetchItunesCover(title);
    if (itunesArt) {
      return itunesArt;
    }
  }

  return FALLBACK_IMAGE;
}

export async function GET() {
  try {
    const response = await fetch(
      `https://streaming01.shockmedia.com.ar/cp/get_info.php?p=9018&_=${Date.now()}`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://streaming01.shockmedia.com.ar/',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error API Shockmedia: ${response.status}`);
    }

    const data = await response.json();
    const resolvedImage = await resolveCoverUrl(data.art, data.title);

    const cleanedHistory = Array.isArray(data.history)
      ? data.history
          .map((item: unknown) =>
            typeof item === 'string'
              ? item
                  .replace(/<br\s*\/?>/gi, '') // Quita cualquier <br>
                  .replace(/^\d+\.\)\s*/, '') // Quita "1.) ", "2.) ", etc.
                  .trim()
              : ''
          )
          .filter(Boolean)
      : [];

    return NextResponse.json(
      {
        nowPlaying: data.title || 'Radio en Casa - En Vivo',
        image: resolvedImage,
        onlineListeners: Number(data.listeners) || 0,
        uniqueListeners: Number(data.ulistener) || 0,
        bitrate: data.bitrate || '128 kbps',
        djUsername: data.djusername || null,
        djProfile: data.djprofile || null,
        history: cleanedHistory,
        streamUrl: '/api/stream/audio',
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching stream info:', error);
    return NextResponse.json(
      {
        nowPlaying: 'Radio en Casa - Transmisión en Vivo',
        image: FALLBACK_IMAGE,
        onlineListeners: 0,
        uniqueListeners: 0,
        bitrate: '128 kbps',
        history: [],
        streamUrl: '/api/stream/audio',
      },
      { status: 200 }
    );
  }
}