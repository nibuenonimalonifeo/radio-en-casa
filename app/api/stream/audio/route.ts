import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // URLs posibles del servidor Shockmedia para la cuenta puerto 9018
  const candidateUrls = [
    'https://streaming01.shockmedia.com.ar/9018/stream',
    'https://streaming01.shockmedia.com.ar:9018/stream',
    'https://streaming01.shockmedia.com.ar:9018/live',
    'https://streaming01.shockmedia.com.ar:9018/;',
  ];

  for (const streamUrl of candidateUrls) {
    try {
      const response = await fetch(streamUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': '*/*',
        },
      });

      if (response.ok && response.body) {
        return new NextResponse(response.body as ReadableStream, {
          status: 200,
          headers: {
            'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      }
    } catch (err) {
      console.warn(`Falló la conexión con ${streamUrl}:`, err);
    }
  }

  return new NextResponse('Stream no disponible', { status: 503 });
}