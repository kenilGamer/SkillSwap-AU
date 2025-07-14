import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProgressBar from '@/components/ProgressBar'
import { Toaster } from '@/components/shadcn/ui/sonner'
import ReduxProvider from '@/components/ReduxProvider'
import Providers from '@/components/Providers'

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
                <Providers>
                    <ProgressBar />
                    <Toaster richColors />
                    <ReduxProvider>
                        {children}
                    </ReduxProvider>
                </Providers>
            </body>
        </html>
    )
}
