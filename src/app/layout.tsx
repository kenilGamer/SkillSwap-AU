import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProgressBar from '@/components/ProgressBar'
import { Toaster } from '@/components/shadcn/ui/sonner'
import { LoaderProvider, LoaderOverlay } from '@/components/GlobalLoader'
import ReduxProvider from '@/components/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SkillSwap',
    description: 'Connect with Developers',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true} cz-shortcut-listen="true" className={inter.className}>
                <ProgressBar />
                <Toaster richColors />
                <ReduxProvider>
                    <LoaderProvider>
                        <LoaderOverlay />
                        {children}
                    </LoaderProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}
