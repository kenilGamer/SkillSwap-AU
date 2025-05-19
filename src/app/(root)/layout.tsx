import auth from '@/auth/auth'
import Navbar from '@/components/root/Navbar'
import { redirect } from 'next/navigation'
import SetUser from '@/components/root/setUser'
import formatUser from '@/helpers/formatUser'
import { IUser } from '@/models/user.model'

export default async function layout({ children }: { children: React.ReactNode }) {
    const res = await auth.getCurrentUser()
    if (res.error) {
        redirect('/login')
    }
    return (
        <div className="flex h-screen w-full">
            <Navbar />
            <div className="flex-1 overflow-auto">
                {res.user && <SetUser user={formatUser(res.user as any)} />}
                {children}
            </div>
        </div>
    )
}
