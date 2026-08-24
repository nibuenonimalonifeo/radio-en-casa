import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'AR';

  try {
    const trendsData = await fetchTrendsByCountry(country);

    return NextResponse.json(trendsData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error(`Error obteniendo trends para ${country}:`, error);
    return NextResponse.json(getFallbackTrends(), { status: 200 });
  }
}

async function fetchTrendsByCountry(countryCode: string) {
  const mockTrends: Record<string, Array<{ id: number; topic: string; volume: string }>> = {
    AR: [
      { id: 1, topic: '#RadioEnCasa', volume: '+50K' },
      { id: 2, topic: 'Clásico del Domingo', volume: '+30K' },
      { id: 3, topic: 'Nuevos Lanzamientos', volume: '+20K' },
      { id: 4, topic: 'Clima Buenos Aires', volume: '+15K' },
      { id: 5, topic: '#MúsicaEnvivo', volume: '+10K' },
    ],
    ES: [
      { id: 1, topic: 'La Liga Highlights', volume: '+100K' },
      { id: 2, topic: '#RadioEspaña', volume: '+40K' },
      { id: 3, topic: 'Festivales Verano', volume: '+25K' },
      { id: 4, topic: 'Concierto Madrid', volume: '+18K' },
      { id: 5, topic: '#CulturaYRadio', volume: '+12K' },
    ],
    MX: [
      { id: 1, topic: '#MusicaMexicana', volume: '+80K' },
      { id: 2, topic: 'Festival CDMX', volume: '+45K' },
      { id: 3, topic: '#RadioEnVivo', volume: '+30K' },
      { id: 4, topic: 'Estrenos de la Semana', volume: '+20K' },
      { id: 5, topic: 'Noticias Destacadas', volume: '+15K' },
    ],
  };

  return mockTrends[countryCode] || getFallbackTrends();
}

function getFallbackTrends() {
  return [
    { id: 1, topic: '#TendenciasGlobales', volume: '+100K' },
    { id: 2, topic: '#MusicaEnVivo', volume: '+50K' },
    { id: 3, topic: '#RadioEnCasa', volume: '+25K' },
    { id: 4, topic: '#TopHits', volume: '+15K' },
    { id: 5, topic: '#Cultura', volume: '+10K' },
  ];
}