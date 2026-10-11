import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const candidateUrls = [
    'http://streaming01.shockmedia.com.ar:9018/stream',
    'http://streaming01.shockmedia.com.ar:9018/;',
    'https://streaming01.shockmedia.com.ar/9018/stream',
  ];

  for (const streamUrl of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seg de timeout por intento

      const response = await fetch(streamUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Icy-MetaData': '1',
        },
      });

      clearTimeout(timeoutId);

      if ((response.ok || response.status === 200) && response.body) {
        return new NextResponse(response.body as ReadableStream, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (err) {
      console.warn(`Falló la conexión con ${streamUrl}:`, err);
    }
  }

  return new NextResponse('Stream no disponible', { status: 503 });
}