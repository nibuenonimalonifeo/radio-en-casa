import { NextResponse } from 'next/server';
import http from 'http';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const STREAM_URL = 'http://streaming01.shockmedia.com.ar:9018/;';

  const passThrough = new Readable({
    read() {} // Administrado mediante push de eventos
  });

  const req = http.get(
    STREAM_URL,
    {
      headers: {
        'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
        'Accept': '*/*',
        'Icy-MetaData': '0',
        'Connection': 'keep-alive',
      },
    },
    (res) => {
      // Reenviar datos de audio de forma continua sin buffer de cierre
      res.on('data', (chunk) => {
        passThrough.push(chunk);
      });

      res.on('end', () => {
        passThrough.push(null);
      });

      res.on('error', (err) => {
        console.error('Error en el socket de audio:', err);
        passThrough.destroy(err);
      });
    }
  );

  req.on('error', (err) => {
    console.error('Error al conectar con Shockmedia:', err);
    passThrough.destroy(err);
  });

  // Convertir el stream de Node a un Web ReadableStream continuo
  const webStream = new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => {
        try {
          controller.enqueue(chunk);
        } catch (e) {
          // El cliente (navegador) cerró la conexión
        }
      });

      passThrough.on('end', () => {
        try { controller.close(); } catch (e) {}
      });

      passThrough.on('error', (err) => {
        try { controller.error(err); } catch (e) {}
      });
    },
    cancel() {
      // Abortar la petición a Shockmedia si el usuario detiene la música
      req.destroy();
      passThrough.destroy();
    }
  });

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}