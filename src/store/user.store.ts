import getUser from '@/actions/user/data/getUser'
import { IUser } from '@/models/user.model'
import { proxy } from 'valtio'

const userStore = proxy({
    user: {} as IUser,

    async setUser(data?: IUser) {
        if (data) {
            this.user = data
            return
        }
        const { error, user } = await getUser()
        if (error) return { error }
        this.user = user as any
    },
})

export default userStore
