'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'sonner'
import { updateProfile } from '@/actions/user/data/updateProfile'
import { userValidation } from '@/lib/validations/user'
import { IUser } from '@/models/user.model'
import userStore from '@/store/user.store'

export default function SetupPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        country: '',
        website: '',
        skills: [] as string[]
    })

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // If user already has a complete profile, redirect to home
            if (session.user.name && session.user.username) {
                router.push('/')
            }
            // Pre-fill form with existing data
            setFormData({
                name: session.user.name || '',
                username: session.user.username || '',
                bio: session.user.bio || '',
                country: session.user.country || '',
                website: session.user.website || '',
                skills: session.user.skills || []
            })
        }
    }, [session, status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const validate = userValidation.safeParse(formData)
            if (!validate.success) {
                toast.error('Please fill in all required fields correctly')
                return
            }

            const res = await updateProfile(validate.data)
            if (res.success) {
                toast.success('Profile setup complete!')
                userStore.user = res.user as IUser
                router.push('/')
            } else {
                toast.error(res.error || 'Failed to update profile')
            }
        } catch (error) {
            toast.error('An error occurred')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (status === 'unauthenticated') {
        router.push('/login')
        return null
    }

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>
                        Tell us a bit about yourself to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                placeholder="Where are you from?"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                placeholder="https://your-website.com"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Complete Setup'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
