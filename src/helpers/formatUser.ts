import { IUser } from '@/models/user.model'

export default function formatUser(user: IUser) {
    return JSON.parse(JSON.stringify({ _id: user._id, name: user.name, email: user.email, username: user.username, country: user.country, website: user.website, skills: user.skills, bio: user.bio }))
}
