import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbconnect from '@/helpers/dbconnect';
import User from '@/models/user.model';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        if (role && !['mentor', 'mentee'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        await dbconnect();

        const query = role ? { role } : {};
        const users = await User.find(query)
            .select('name username image skills bio')
            .sort({ name: 1 })
            .lean();

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
} 