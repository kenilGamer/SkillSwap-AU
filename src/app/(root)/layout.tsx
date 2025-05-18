import auth from '@/auth/auth'
import Navbar from '@/components/root/Navbar'
import { redirect } from 'next/navigation'
import SetUser from '@/components/root/setUser'
import formatUser from '@/helpers/formatUser'
import { IUser } from '@/models/user.model'

export default async function layout({ children }: { children: React.ReactNode }) {
    const res = await auth.getCurrentUser()
    // TEMP: Show a message instead of redirecting for unauthenticated users
    if (res.error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center flex-col">
                <Navbar />
                <div className="text-red-500 text-lg font-bold mt-8">{res.error || 'You are not logged in.'}</div>
                {children}
            </div>
        )
    }
    return (
        <div className="flex h-screen w-screen">
            <Navbar />
            <SetUser user={formatUser(res.user) as IUser} />
            {children}
        </div>
    )
}
