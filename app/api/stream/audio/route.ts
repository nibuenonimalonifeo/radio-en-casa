import { NextResponse } from 'next/server';
import http from 'http';
import https from 'https';

export const dynamic = 'force-dynamic';

export async function GET() {
  const STREAM_URL = 'http://streaming01.shockmedia.com.ar:9018/stream';

  const stream = new ReadableStream({
    start(controller) {
      const client = STREAM_URL.startsWith('https') ? https : http;

      const req = client.get(
        STREAM_URL,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Icy-MetaData': '1',
          },
        },
        (res) => {
          res.on('data', (chunk) => {
            try {
              controller.enqueue(chunk);
            } catch (e) {
              // Si el cliente cierra el navegador
            }
          });

          res.on('end', () => {
            try { controller.close(); } catch (e) {}
          });

          res.on('error', (err) => {
            try { controller.error(err); } catch (e) {}
          });
        }
      );

      req.on('error', (err) => {
        try { controller.error(err); } catch (e) {}
      });
    },
  });

  return new NextResponse(stream, {
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