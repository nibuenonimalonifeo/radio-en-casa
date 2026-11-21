import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_IMAGE = '/images/servicios/Radio_en_Casa_logo_REC-04.svg';

function normalizeArtUrl(art?: unknown): string {
  if (typeof art !== 'string') return FALLBACK_IMAGE;
  const trimmed = art.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith('/')) {
    return `https://streaming01.shockmedia.com.ar${trimmed}`;
  }
  return `https://streaming01.shockmedia.com.ar/${trimmed}`;
}

export async function GET() {
  try {
    const response = await fetch('https://streaming01.shockmedia.com.ar/cp/get_info.php?p=9018', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'RadioEnCasaWeb/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Error API Shockmedia: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      nowPlaying: data.title || 'Radio en Casa - En Vivo',
      image: normalizeArtUrl(data.art),
      onlineListeners: data.listeners ?? 0,
      uniqueListeners: data.ulistener ?? 0,
      bitrate: data.bitrate || '128 kbps',
      djUsername: data.djusername || null,
      djProfile: data.djprofile || null,
      history: Array.isArray(data.history) ? data.history : [],
      streamUrl: '/api/stream/audio',
    });
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