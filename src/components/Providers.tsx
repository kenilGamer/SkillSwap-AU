"use client";

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/shadcn/ui/sonner';
import { LoaderProvider, LoaderOverlay } from '@/components/GlobalLoader';
import ReduxProvider from '@/components/ReduxProvider';
import { NotificationToast } from '@/components/NotificationToast';
import ProgressBar from '@/components/ProgressBar';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ProgressBar />
            <Toaster richColors />
            <ReduxProvider>
                <LoaderProvider>
                    <LoaderOverlay />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    {/* <NotificationToast /> */}
                </LoaderProvider>
            </ReduxProvider>
        </SessionProvider>
    );
} 