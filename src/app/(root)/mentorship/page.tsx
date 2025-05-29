"use client"
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/shadcn/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/shadcn/ui/dialog';

// Mock data for mentors
const mentors = [
  {
    _id: '1',
    name: 'Amit Sharma',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['React', 'Node.js', 'Career Advice'],
    country: 'India',
    bio: '5+ years experience in web dev. Love to help beginners!'
  },
  {
    _id: '2',
    name: 'Sara Khan',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    skills: ['Python', 'Data Science', 'Machine Learning'],
    country: 'Pakistan',
    bio: 'Data scientist, mentor, and community builder.'
  },
  {
    _id: '3',
    name: 'John Doe',
    image: '',
    skills: ['Java', 'System Design'],
    country: 'USA',
    bio: 'Senior engineer, open to mentor globally.'
  },
];

// Mock data for user's mentorships
const myMentorships = [
  {
    _id: 'm1',
    mentor: mentors[0],
    mentee: { name: 'You' },
    status: 'pending',
    role: 'mentee',
  },
  {
    _id: 'm2',
    mentor: { name: 'You' },
    mentee: mentors[1],
    status: 'accepted',
    role: 'mentor',
  },
];

export default function MentorshipPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');

  // Placeholder: handle mentorship request
  const handleRequest = async () => {
    setRequestLoading(true);
    setTimeout(() => {
      setRequestLoading(false);
      setIsDialogOpen(false);
      setSelectedSkill('');
      setMessage('');
      // TODO: Show toast for success
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Mentorship Program</h1>
        <p className="text-lg text-slate-600 mb-4">Connect with experienced members and grow faster. Find a mentor or become one to help others!</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full px-8 py-3 text-lg font-semibold shadow-md">Request Mentorship</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Request Mentorship</DialogTitle>
              <p className="text-slate-500 text-sm mt-1" id="mentorship-dialog-desc">
                Fill in the skill/area you want help with and an optional message for your mentor.
              </p>
            </DialogHeader>
            <div aria-describedby="mentorship-dialog-desc">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Area/Skill you need help with</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. React, Data Science"
                    value={selectedSkill}
                    onChange={e => setSelectedSkill(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Message (optional)</label>
                  <textarea
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                    placeholder="Tell your mentor what you need help with..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <DialogClose asChild>
                    <Button variant="secondary" className="w-full">Cancel</Button>
                  </DialogClose>
                  <Button className="w-full" loading={requestLoading} onClick={handleRequest}>
                    Send Request
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mentor List */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Available Mentors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-all">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-indigo-200">
                {mentor.image ? (
                  <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-3xl font-bold text-indigo-400">
                    {mentor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-slate-800">{mentor.name}</div>
                <div className="text-xs text-slate-500 mb-2">{mentor.country}</div>
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {mentor.skills.map((skill: string, i: number) => (
                    <Badge key={i} className="bg-indigo-100 text-indigo-700 font-medium">{skill}</Badge>
                  ))}
                </div>
                <div className="text-sm text-slate-600 mb-3">{mentor.bio}</div>
                <Button size="sm" className="rounded-full px-4" onClick={() => { setIsDialogOpen(true); }}>
                  Request Mentorship
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Mentorships */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">My Mentorships</h2>
        <div className="space-y-4">
          {myMentorships.length === 0 ? (
            <div className="bg-slate-100 rounded p-4 text-center text-slate-500">No mentorships yet.</div>
          ) : (
            myMentorships.map((m) => (
              <div key={m._id} className="bg-white rounded-xl shadow flex flex-col sm:flex-row items-center gap-4 p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200">
                    {m.role === 'mentor' && 'image' in m.mentee && m.mentee.image ? (
                      <img src={m.mentee.image} alt={m.mentee.name} className="w-full h-full object-cover" />
                    ) : m.mentor && 'image' in m.mentor && m.mentor.image ? (
                      <img src={m.mentor.image} alt={m.mentor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-2xl font-bold text-indigo-400">
                        {(m.role === 'mentor' ? m.mentee.name : m.mentor.name).charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{m.role === 'mentor' ? m.mentee.name : m.mentor.name}</div>
                    <div className="text-xs text-slate-500">{m.role === 'mentor' ? 'Mentee' : 'Mentor'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    m.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : m.status === 'accepted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }>
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </Badge>
                  {/* TODO: Add Accept/Decline/Cancel buttons for pending requests */}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
} 