"use client";

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/shadcn/ui/sonner';

import ReduxProvider from '@/components/ReduxProvider';
import ProgressBar from '@/components/ProgressBar';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ProgressBar />
            <Toaster richColors />
            <ReduxProvider>
                <main className="min-h-screen">
                    {children}
                </main>
                {/* <NotificationToast /> */}
            </ReduxProvider>
        </SessionProvider>
    );
} 