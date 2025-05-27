import User, { IUser } from '@/models/user.model';
import Profile from './Profile';
import { redirect } from 'next/navigation';
import { isValidObjectId } from 'mongoose';
import formatUser from '@/helpers/formatUser';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        if (!isValidObjectId(id)) redirect('/');

        const user = await User.findById(id).select('name username email skills bio country website image followers following');
        if (!user) redirect('/');

        return <Profile user={formatUser(user) as IUser} currentUserId={id} />;
    } catch (error) {
        redirect('/');
    }
}
