import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = 'http://streaming01.shockmedia.com.ar/cp/get_info.php?p=9018';

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const rawText = await response.text();
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Respuesta inválida de Shockmedia');
    }

    const cleanJson = rawText.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(cleanJson);

    return NextResponse.json(
      {
        nowplaying: data.title || data.song || 'RADIO EN CASA - EN VIVO',
        image: data.art || data.image || data.cover || '/images/programas/Radio_en_Casa_historia_01_Posta_Logo.png',
        online_listeners: Number(data.listeners || data.ulistener || 0),
        played_last20: Array.isArray(data.history) ? data.history : (data.played_last20 || []),
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error leyendo API Shockmedia:', error);
    return NextResponse.json({
      nowplaying: 'RADIO EN CASA - TRANSMISIÓN EN VIVO',
      image: '/images/programas/Radio_en_Casa_historia_01_Posta_Logo.png',
      online_listeners: 0,
      played_last20: [],
    });
  }
}