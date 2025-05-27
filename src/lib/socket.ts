import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocket = (res: Response) => {
    if (!io) {
        io = new SocketIOServer({
            path: '/api/socket',
            addTrailingSlash: false,
            cors: {
                origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true
            },
            transports: ['websocket'],
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

        console.log('Socket.io server initialized');
    }
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}; 