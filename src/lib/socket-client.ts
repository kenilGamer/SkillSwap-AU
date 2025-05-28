import { io } from 'socket.io-client'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const socket = io(baseUrl, {
    path: '/api/socket',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false
}) 