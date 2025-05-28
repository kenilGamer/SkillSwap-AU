import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initSocket = (server: HTTPServer) => {
    if (!io) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        console.log('Initializing Socket.IO server with base URL:', baseUrl);
        
        io = new SocketIOServer(server, {
            path: '/api/socket',
            addTrailingSlash: false,
            cors: {
                origin: baseUrl,
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

            // Handle reconnection
            socket.on('reconnect_attempt', (attemptNumber) => {
                console.log('Reconnection attempt:', attemptNumber);
            });

            socket.on('reconnect', (attemptNumber) => {
                console.log('Reconnected after', attemptNumber, 'attempts');
            });

            socket.on('reconnect_error', (error) => {
                console.error('Reconnection error:', error);
            });
        });

        console.log('Socket.IO server initialized');
    }
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}; 