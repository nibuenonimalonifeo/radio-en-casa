import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_IMAGE = '/images/servicios/Radio_en_Casa_logo_REC-04.svg';

function normalizeArtUrl(art?: unknown, title?: string): string {
  if (typeof art !== 'string') return FALLBACK_IMAGE;
  const trimmed = art.trim();

  if (!trimmed || trimmed.toLowerCase().includes('nocover.png')) {
    return FALLBACK_IMAGE;
  }

  let fullUrl = trimmed;
  if (trimmed.startsWith('http://')) {
    fullUrl = trimmed.replace('http://', 'https://');
  } else if (trimmed.startsWith('//')) {
    fullUrl = `https:${trimmed}`;
  } else if (trimmed.startsWith('/')) {
    fullUrl = `https://streaming01.shockmedia.com.ar${trimmed}`;
  } else if (!trimmed.startsWith('https://')) {
    fullUrl = `https://streaming01.shockmedia.com.ar/${trimmed}`;
  }

  const cacheKey = encodeURIComponent(title || String(Date.now()));
  return `/api/stream/cover?url=${encodeURIComponent(fullUrl)}&v=${cacheKey}`;
}

export async function GET() {
  try {
    const response = await fetch(
      `https://streaming01.shockmedia.com.ar/cp/get_info.php?p=9018&_=${Date.now()}`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'RadioEnCasaWeb/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error API Shockmedia: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        nowPlaying: data.title || 'Radio en Casa - En Vivo',
        image: normalizeArtUrl(data.art, data.title),
        onlineListeners: data.listeners ?? 0,
        uniqueListeners: data.ulistener ?? 0,
        bitrate: data.bitrate || '128 kbps',
        djUsername: data.djusername || null,
        djProfile: data.djprofile || null,
        history: Array.isArray(data.history) ? data.history : [],
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