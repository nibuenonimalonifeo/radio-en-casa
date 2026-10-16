import { NextResponse } from 'next/server';
import http from 'http';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  // Punto de montaje nativo para SHOUTcast v2 AAC
  const STREAM_URL = 'http://streaming01.shockmedia.com.ar:9018/stream/1/';

  const passThrough = new Readable({
    read() {}
  });

  // Manejador de errores interno para limpiar silenciosamente el stream local
  const handleStreamError = (err: any) => {
    if (err?.code === 'ECONNRESET' || err?.code === 'ECONNABORTED' || err?.message?.includes('aborted')) {
      console.warn('Proxy de audio: Conexión cerrada o reiniciada por el servidor de streaming.');
    } else {
      console.error('Proxy de audio: Error en la transmisión:', err);
    }
    if (!passThrough.destroyed) {
      passThrough.destroy();
    }
  };

  passThrough.on('error', handleStreamError);

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
      // Prevenir el fallo 'socket hang up' escuchando el evento 'aborted' de la respuesta HTTP
      res.on('aborted', () => {
        console.warn('Proxy de audio: La respuesta remota fue abortada.');
        handleStreamError({ code: 'ECONNRESET' });
      });

      res.on('data', (chunk) => {
        if (!passThrough.destroyed) {
          passThrough.push(chunk);
        }
      });

      res.on('end', () => {
        if (!passThrough.destroyed) {
          passThrough.push(null);
        }
      });

      res.on('error', handleStreamError);
    }
  );

  // Prevenir que errores de conexión a nivel de socket TCP tumben el proceso de Node.js
  req.on('error', handleStreamError);

  // Capturar el evento de cierre sobre la conexión de socket TCP directamente
  req.on('socket', (socket) => {
    socket.on('error', (err) => {
      handleStreamError(err);
    });
  });

  const webStream = new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => {
        try {
          controller.enqueue(chunk);
        } catch (e) {}
      });

      passThrough.on('end', () => {
        try {
          controller.close();
        } catch (e) {}
      });

      passThrough.on('error', (err) => {
        try {
          controller.error(err);
        } catch (e) {}
      });
    },
    cancel() {
      req.destroy();
      passThrough.destroy();
    }
  });

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/aac',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}