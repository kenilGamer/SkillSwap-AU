import { Server as HTTPServer } from 'http';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { initSocket } from '@/lib/socket';

let io: SocketIOServer | null = null;

export async function GET(req: NextApiRequest) {
    if (!io) {
        const server = new HTTPServer();
        io = initSocket(server);
    }

    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
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