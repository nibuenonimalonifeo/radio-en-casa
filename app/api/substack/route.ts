import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://radioencasa.substack.com/feed', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/xml, application/xml, application/rss+xml',
      },
      next: { revalidate: 60 }, // Revalida cada 60 segundos
    });

    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }

    const xmlText = await res.text();

    // Parseo por Regex del feed XML de Substack
    const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

    const posts = itemMatches.slice(0, 12).map((item, index) => {
      const titleMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || item.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || item.match(/<description>([\s\S]*?)<\/description>/);
      const imageMatch = item.match(/<enclosure[^>]+url=["']([^"']+)["']/) || item.match(/<og:image>([\s\S]*?)<\/og:image>/);

      const title = titleMatch ? titleMatch[1].trim() : `Publicación #${index + 1}`;
      const link = linkMatch ? linkMatch[1].trim() : 'https://radioencasa.substack.com';
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
      const rawDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const coverImage = imageMatch ? imageMatch[1].trim() : null;

      return {
        id: index + 1,
        title,
        subtitle: rawDesc.slice(0, 120) + (rawDesc.length > 120 ? '...' : ''),
        canonical_url: link,
        cover_image: coverImage,
        post_date: pubDate,
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al procesar RSS de Substack:', error);
    return NextResponse.json([], { status: 500 });
  }
}