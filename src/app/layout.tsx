import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProgressBar from '@/components/ProgressBar'
import { Toaster } from '@/components/shadcn/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SkillSwap',
    description: 'Connect with Developers',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true} cz-shortcut-listen="true" className={inter.className}>
                <ProgressBar />
                <Toaster richColors />
                {children}
            </body>
        </html>
    )
}
