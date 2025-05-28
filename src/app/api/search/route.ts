import { NextResponse } from 'next/server'
import User, { IUser } from '@/models/user.model'
import Post from '@/models/Post.model'
import dbconnect from '@/helpers/dbconnect'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')?.toLowerCase()

        if (!query) {
            return NextResponse.json({ results: [] })
        }

        await dbconnect()

        // Search users
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { skills: { $in: [new RegExp(query, 'i')] } }
            ]
        })
        .select('name username image skills bio')
        .limit(5)
        .lean()

        // Search posts
        const posts = await Post.find({
            $or: [
                { description: { $regex: query, $options: 'i' } },
                { requiredSkills: { $in: [new RegExp(query, 'i')] } },
                { category: { $regex: query, $options: 'i' } }
            ]
        })
        .populate<{ owner: IUser }>('owner', 'name username image')
        .limit(5)
        .lean()

        // Transform results
        const results = {
            users: users.map(user => ({
                type: 'user',
                id: user._id.toString(),
                name: user.name,
                username: user.username,
                image: user.image,
                skills: user.skills,
                bio: user.bio
            })),
            posts: posts.map(post => ({
                type: 'post',
                id: post._id.toString(),
                description: post.description,
                requiredSkills: post.requiredSkills,
                category: post.category,
                owner: {
                    name: (post.owner as IUser).name,
                    username: (post.owner as IUser).username,
                    image: (post.owner as IUser).image
                }
            }))
        }

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
} 