import { IUser } from '@/models/user.model'

function safeString(val: any): string {
  return typeof val === 'string' ? val : '';
}

export default function formatUser(user: Partial<IUser> | undefined): IUser {
    return {
        _id: safeString(user?._id),
        name: safeString(user?.name),
        username: safeString(user?.username),
        email: safeString(user?.email),
        skills: user?.skills || [],
        password: '', // or safeString(user?.password)
        bio: safeString(user?.bio),
        country: safeString(user?.country),
        website: safeString(user?.website),
        verified: user?.verified ?? false,
        image: safeString(user?.image),
        followers: user?.followers || [],
        following: user?.following || [],
    };
}
