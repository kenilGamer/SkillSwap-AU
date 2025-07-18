import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { NextResponse } from 'next/server';

declare global {
  var io: ServerIO | undefined;
  var server: NetServer | undefined;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!global.io) {
      console.log('New Socket.io server...');
      const httpServer: NetServer = global.server || new NetServer();
      const io = new ServerIO(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 45000,
        allowEIO3: true
      });

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (userId: string) => {
          socket.join(userId);
          console.log(`User ${userId} joined their room`);
        });

        socket.on('disconnect', (reason) => {
          console.log('Client disconnected:', socket.id, 'Reason:', reason);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      });

      global.io = io;
      global.server = httpServer;
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Socket.io error:', error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 