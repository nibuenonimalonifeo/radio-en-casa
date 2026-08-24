import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://streaming01.shockmedia.com.ar/cp/get_info.php?p=9018',
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('Error al conectar con Shockmedia');

    const data = await res.json();

    // Portada al aire ($image)
    let imageUrl = data.image || data.cover || data.cover_art || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://streaming01.shockmedia.com.ar/${imageUrl.replace(/^\//, '')}`;
    }

    return NextResponse.json({
      ...data,
      image: imageUrl,
      // URL directa del audio para HTML5
      stream_url: 'https://streaming01.shockmedia.com.ar:9018/live',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo info' }, { status: 500 });
  }
}