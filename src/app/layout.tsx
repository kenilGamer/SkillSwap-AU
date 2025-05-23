import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProgressBar from '@/components/ProgressBar'
import { Toaster } from '@/components/shadcn/ui/sonner'
import { LoaderProvider, LoaderOverlay } from '@/components/GlobalLoader'
import auth from '@/auth/auth'
import Navbar from '@/components/root/Navbar'
import { redirect } from 'next/navigation'
import SetUser from '@/components/root/setUser'
import formatUser from '@/helpers/formatUser'
import { IUser } from '@/models/user.model'
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
    const res = await auth.getCurrentUser()
    if (res.error) {
        redirect('/login')
    }
    return (
        <html lang="en">
            <body suppressHydrationWarning={true} cz-shortcut-listen="true" className={inter.className}>
                <ProgressBar />
                <Toaster richColors />
                <ReduxProvider>
                    <div className="flex h-screen w-screen">
                        {res.user && <SetUser user={formatUser(res.user as any)} />}
                        <LoaderProvider>
                            <LoaderOverlay />
                            {children}
                        </LoaderProvider>
                    </div>
                </ReduxProvider>
            </body>
        </html>
    )
}
