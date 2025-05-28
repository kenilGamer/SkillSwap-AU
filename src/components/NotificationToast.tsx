"use client";

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { io, Socket } from 'socket.io-client'

// Initialize Socket.IO client
const socket = io("http://localhost:4000");

interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    read: boolean
    createdAt: Date
}

export function NotificationToast() {
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)

    // Initialize socket connection
    useEffect(() => {
        if (!session?.user) {
            return;
        }

        socket.on('connect', () => {
            socket.emit('join', session.user.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('notification', (newNotification: Notification) => {
            console.log('Received notification:', newNotification);
            // Use callback form of setState to avoid render-time updates
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast for new notification
            toast(newNotification.title, {
                description: newNotification.message,
                duration: 5000,
                className: cn(
                    'bg-white dark:bg-gray-800',
                    {
                        'border-blue-500': newNotification.type === 'info',
                        'border-green-500': newNotification.type === 'success',
                        'border-yellow-500': newNotification.type === 'warning',
                        'border-red-500': newNotification.type === 'error',
                    }
                ),
            });
        });

        return () => {
            console.log('Cleaning up socket listeners');
            socket.off('connect');
            socket.off('connect_error');
            socket.off('notification');
        };
    }, [session, notifications]);

    // Fetch initial notifications
    useEffect(() => {
        if (!session?.user) return

        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications')
                const data = await response.json()
                if (data.notifications) {
                    setNotifications(data.notifications)
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
            }
        }

        fetchNotifications()
    }, [session])

    const markAsRead = async (id: string) => {
        try {
            // Update local state first for immediate feedback
            setNotifications(notifications.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            ));

            // Then try to update on the server
            const response = await fetch(`/api/notifications/${id}/read`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn('Failed to mark notification as read on server');
                // Optionally revert the local state if server update fails
                // setNotifications(notifications);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            // Optionally revert the local state if server update fails
            // setNotifications(notifications);
        }
    }

    const deleteNotification = async (id: string) => {
        try {
            // Update local state first
            setNotifications(notifications.filter(notification => notification.id !== id));

            // Then try to update on the server
            const response = await fetch(`/api/notifications/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn('Failed to delete notification on server');
                // Optionally revert the local state if server update fails
                // setNotifications(notifications);
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
            // Optionally revert the local state if server update fails
            // setNotifications(notifications);
        }
    }

    const markAllAsRead = async () => {
        try {
            // Update local state first
            setNotifications(notifications.map(n => ({ ...n, read: true })));

            // Then try to update on the server
            const response = await fetch('/api/notifications/read-all', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn('Failed to mark all notifications as read on server');
                // Optionally revert the local state if server update fails
                // setNotifications(notifications);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            // Optionally revert the local state if server update fails
            // setNotifications(notifications);
        }
    }

    const clearAll = async () => {
        try {
            // Update local state first
            setNotifications([]);

            // Then try to update on the server
            const response = await fetch('/api/notifications', { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn('Failed to clear notifications on server');
                // Optionally revert the local state if server update fails
                // setNotifications(notifications);
            }
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            // Optionally revert the local state if server update fails
            // setNotifications(notifications);
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
                    >
                        {unreadCount}
                    </motion.div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-80 rounded-lg bg-white p-4 shadow-xl"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="max-h-96 space-y-2 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bell className="mb-2 h-8 w-8 text-gray-400" />
                                    <p className="text-sm text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={cn(
                                            "group relative rounded-lg p-3 transition-all",
                                            !notification.read ? "bg-indigo-50" : "hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    {
                                                        'bg-blue-500': notification.type === 'info',
                                                        'bg-green-500': notification.type === 'success',
                                                        'bg-yellow-500': notification.type === 'warning',
                                                        'bg-red-500': notification.type === 'error',
                                                    }
                                                )} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {new Date(notification.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="rounded-full p-1 hover:bg-gray-200"
                                                    >
                                                        <Check className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="rounded-full p-1 hover:bg-gray-200"
                                                >
                                                    <X className="h-4 w-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="mt-4 flex justify-between border-t pt-4">
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    Mark all as read
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 