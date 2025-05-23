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
        return { error: 'Session ID is no longer used' }
    }

    async deleteCurrentUsersAllSessions() {
        try {
            const res: any = await this.getCurrentSession()
            if (res.error) return { error: res.error }
            await Session.deleteMany({ user: (res.user as any)._id })
            return { success: 'Deleted current users all session' }
        } catch (error) {
            return { error: "Couldn't delete current users session" }
        }
    }

    async deleteSession(filter: { _id?: string; user?: string }) {
        if (!filter._id && !filter.user) {
            return { error: 'Session ID or User ID, at least one is required' }
        }
        try {
            await this.dbconnect()
            const deletedSessions = await Session.deleteMany(filter)
            if (!deletedSessions.deletedCount) return { success: 'Session was not found with provied Session/User ID' }
            return { success: filter.user ? 'Deleted sessions by user id' : 'Deleted session by session id' }
        } catch (error) {
            return { error: "Couldn't delete session" }
        }
    }

    async deleteExpiredSessions() {
        try {
            await this.dbconnect()
            await Session.deleteMany({ expiresAt: { $lte: new Date() } })
            return { success: 'Deleted all expired sessions' }
        } catch (error) {
            return { error: "Couldn't delete expired sessions" }
        }
    }

    async deleteAllSessions() {
        try {
            await this.dbconnect()
            await Session.deleteMany({})
            return { success: 'Deleted all sessions' }
        } catch (error) {
            return { error: "Couldn't delete expired sessions" }
        }
    }

    async getCurrentUser() {
        const session = await this.getCurrentSession();
        if (!session || !session.user) return { error: 'Not authenticated' };
        return { user: session.user };
    }
}

export default Auth
