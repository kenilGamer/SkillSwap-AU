import getUser from '@/actions/user/data/getUser'
import { IUserClient } from '@/models/user.model'
import { proxy } from 'valtio'

const userStore = proxy({
    user: {} as IUserClient,

    async setUser(data?: IUserClient) {
        if (data) {
            this.user = data
            return
        }
        const { error, user } = await getUser()
        if (error) return { error }
        this.user = user as IUserClient
    },
})

export default userStore
