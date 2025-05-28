import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbconnect from '@/helpers/dbconnect';
import Mentorship from '@/models/Mentorship.model';
import User from '@/models/user.model';

// GET /api/admin/mentorship - Get all mentorships
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbconnect();

        const mentorships = await Mentorship.find()
            .populate('mentor', 'name username image skills')
            .populate('mentee', 'name username image skills')
            .sort({ startDate: -1 })
            .lean();

        return NextResponse.json({ success: true, mentorships });
    } catch (error) {
        console.error('Failed to fetch mentorships:', error);
        return NextResponse.json({ error: 'Failed to fetch mentorships' }, { status: 500 });
    }
}

// POST /api/admin/mentorship - Create new mentorship
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { mentorId, menteeId } = await request.json();
        if (!mentorId || !menteeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbconnect();

        // Check if users exist and have correct roles
        const [mentor, mentee] = await Promise.all([
            User.findOne({ _id: mentorId, role: 'mentor' }),
            User.findOne({ _id: menteeId, role: 'mentee' })
        ]);

        if (!mentor || !mentee) {
            return NextResponse.json({ error: 'Invalid mentor or mentee' }, { status: 400 });
        }

        // Check if mentorship already exists
        const existingMentorship = await Mentorship.findOne({
            $or: [
                { mentor: mentorId, mentee: menteeId, status: 'active' },
                { mentor: menteeId, mentee: mentorId, status: 'active' }
            ]
        });

        if (existingMentorship) {
            return NextResponse.json({ error: 'Mentorship already exists' }, { status: 400 });
        }

        // Create new mentorship
        const mentorship = await Mentorship.create({
            mentor: mentorId,
            mentee: menteeId,
            status: 'active',
            startDate: new Date(),
            goals: [],
            progress: {
                completedGoals: [],
                notes: [],
                lastUpdated: new Date()
            }
        });

        return NextResponse.json({ success: true, mentorship });
    } catch (error) {
        console.error('Failed to create mentorship:', error);
        return NextResponse.json({ error: 'Failed to create mentorship' }, { status: 500 });
    }
} 