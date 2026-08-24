import { NextResponse } from 'next/server';

export async function GET() {
  const streamUrl = 'http://streaming01.shockmedia.com.ar:9018/live';

  try {
    const response = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok || !response.body) {
      return new NextResponse('Error al conectar con el servidor de streaming', {
        status: 500,
      });
    }

    // Retornar el stream directo con las cabeceras de audio correctas
    return new NextResponse(response.body as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error proxying audio stream:', error);
    return new NextResponse('Error interno de audio', { status: 500 });
  }
}