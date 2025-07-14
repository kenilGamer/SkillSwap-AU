'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Mentorship {
    _id: string;
    mentor: {
        _id: string;
        name: string;
        username: string;
        image: string;
        skills: string[];
    };
    mentee: {
        _id: string;
        name: string;
        username: string;
        image: string;
        skills: string[];
    };
    status: 'active' | 'completed' | 'cancelled';
    startDate: string;
    endDate?: string;
    goals: string[];
    progress: {
        completedGoals: string[];
        notes: string[];
        lastUpdated: string;
    };
}

export default function MentorshipManagement() {
    const { data: session } = useSession();
    const router = useRouter();
    const [mentorships, setMentorships] = useState<Mentorship[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [selectedMentee, setSelectedMentee] = useState('');
    const [availableMentors, setAvailableMentors] = useState<IUserClient[]>([]);
    const [availableMentees, setAvailableMentees] = useState<IUserClient[]>([]);

    useEffect(() => {
        if (session?.user?.role !== 'admin') {
            router.push('/');
            return;
        }

        fetchMentorships();
        fetchAvailableUsers();
    }, [session, router]);

    const fetchMentorships = async () => {
        try {
            const res = await fetch('/api/admin/mentorship');
            const data = await res.json();
            if (data.success) {
                setMentorships(data.mentorships);
            }
        } catch (error) {
            console.error('Failed to fetch mentorships:', error);
            toast.error('Failed to load mentorship data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const [mentorsRes, menteesRes] = await Promise.all([
                fetch('/api/admin/users?role=mentor'),
                fetch('/api/admin/users?role=mentee')
            ]);
            const [mentorsData, menteesData] = await Promise.all([
                mentorsRes.json(),
                menteesRes.json()
            ]);
            if (mentorsData.success) setAvailableMentors(mentorsData.users);
            if (menteesData.success) setAvailableMentees(menteesData.users);
        } catch (error) {
            console.error('Failed to fetch available users:', error);
            toast.error('Failed to load user data');
        }
    };

    const assignMentor = async () => {
        if (!selectedMentor || !selectedMentee) {
            toast.error('Please select both mentor and mentee');
            return;
        }

        try {
            const res = await fetch('/api/admin/mentorship', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mentorId: selectedMentor, menteeId: selectedMentee })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Mentorship assigned successfully');
                fetchMentorships();
                setSelectedMentor('');
                setSelectedMentee('');
            } else {
                toast.error(data.error || 'Failed to assign mentorship');
            }
        } catch (error) {
            console.error('Failed to assign mentorship:', error);
            toast.error('Failed to assign mentorship');
        }
    };

    const removeMentorship = async (mentorshipId: string) => {
        if (!window.confirm('Are you sure you want to remove this mentorship?')) return;

        try {
            const res = await fetch(`/api/admin/mentorship/${mentorshipId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Mentorship removed successfully');
                fetchMentorships();
            } else {
                toast.error(data.error || 'Failed to remove mentorship');
            }
        } catch (error) {
            console.error('Failed to remove mentorship:', error);
            toast.error('Failed to remove mentorship');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Mentorship Management</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Assign New Mentorship</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Mentor to Mentee</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Mentor</label>
                                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a mentor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableMentors.map(mentor => (
                                            <SelectItem key={mentor._id} value={mentor._id}>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={mentor.image} />
                                                        <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{mentor.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Mentee</label>
                                <Select value={selectedMentee} onValueChange={setSelectedMentee}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a mentee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableMentees.map(mentee => (
                                            <SelectItem key={mentee._id} value={mentee._id}>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={mentee.image} />
                                                        <AvatarFallback>{mentee.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{mentee.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={assignMentor} className="w-full">
                                Assign Mentorship
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Mentorships</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mentor</TableHead>
                                <TableHead>Mentee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mentorships.map(mentorship => (
                                <TableRow key={mentorship._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={mentorship.mentor.image} />
                                                <AvatarFallback>{mentorship.mentor.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{mentorship.mentor.name}</div>
                                                <div className="text-sm text-gray-500">@{mentorship.mentor.username}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={mentorship.mentee.image} />
                                                <AvatarFallback>{mentorship.mentee.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{mentorship.mentee.name}</div>
                                                <div className="text-sm text-gray-500">@{mentorship.mentee.username}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            mentorship.status === 'active' ? 'default' :
                                            mentorship.status === 'completed' ? 'success' : 'destructive'
                                        }>
                                            {mentorship.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(mentorship.startDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>Goals: {mentorship.progress.completedGoals.length}/{mentorship.goals.length}</div>
                                            <div className="text-gray-500">
                                                Last updated: {new Date(mentorship.progress.lastUpdated).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeMentorship(mentorship._id)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
} 