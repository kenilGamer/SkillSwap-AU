import { isValidObjectId } from 'mongoose'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth/[...nextauth]/options';
import Session from './session.model'

interface IAuthConstructor {
    dbconnect: () => Promise<any>
}

class Auth {
    private dbconnect: () => Promise<void>

    constructor(options: IAuthConstructor) {
        this.dbconnect = options.dbconnect
    }

    async createSession({ userId, expiresIn }: { userId: string; expiresIn: number }) {
        if (!isValidObjectId(userId)) return { error: 'Invalid user ID' }
        try {
            await this.dbconnect()
            const session = await Session.create({ user: userId, expiresAt: Date.now() + expiresIn })
            return { success: 'Session created successfully', data: session }
        } catch (error) {
            console.error("Couldn't create Session", error);
            return { error: "Couldn't create Session" }
        }
    }

    async getCurrentSession() {
        return await getServerSession(authOptions)
    }

    async deleteCurrentUsersSession() {
        try {
            const session = await this.getCurrentSession()
            if (!session?.user) return { error: 'Not authenticated' }
            await this.dbconnect()
            await Session.deleteMany({ user: (session.user as any)._id })
            return { success: 'Deleted current user session' }
        } catch (error) {
            return { error: "Couldn't delete current user session" }
        }
    }

    async deleteCurrentUsersAllSessions() {
        try {
            const session = await this.getCurrentSession()
            if (!session?.user) return { error: 'Not authenticated' }
            await this.dbconnect()
            await Session.deleteMany({ user: (session.user as any)._id })
            return { success: 'Deleted all sessions for current user' }
        } catch (error) {
            return { error: "Couldn't delete current user sessions" }
        }
    }

    async deleteSession(filter: { _id?: string; user?: string }) {
        if (!filter._id && !filter.user) {
            return { error: 'Session ID or User ID is required' }
        }
        try {
            await this.dbconnect()
            const deletedSessions = await Session.deleteMany(filter)
            if (!deletedSessions.deletedCount) {
                return { success: 'No sessions found with provided Session/User ID' }
            }
            return { success: filter.user ? 'Deleted sessions by user ID' : 'Deleted session by session ID' }
        } catch (error) {
            return { error: "Couldn't delete session" }
        }
    }

    async deleteExpiredSessions() {
        try {
            await this.dbconnect()
            const result = await Session.deleteMany({ expiresAt: { $lte: new Date() } })
            return { success: `Deleted ${result.deletedCount} expired sessions` }
        } catch (error) {
            return { error: "Couldn't delete expired sessions" }
        }
    }

    async deleteAllSessions() {
        try {
            await this.dbconnect()
            const result = await Session.deleteMany({})
            return { success: `Deleted ${result.deletedCount} sessions` }
        } catch (error) {
            return { error: "Couldn't delete all sessions" }
        }
    }

    async getCurrentUser() {
        const session = await this.getCurrentSession();
        if (!session?.user) return { error: 'Not authenticated' };
        return { user: { ...session.user, id: (session.user as any).id || (session.user as any)._id } };
    }
}

export default Auth
