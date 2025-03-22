import { z } from 'zod'

export const userSignupValidation = z.object({
    name: z.string().min(4, 'Name must be at least 4 characters').max(64, 'Name must be at most 20 characters'),
    username: z.string().trim().toLowerCase().min(4, 'Username must be at least 4 characters').max(20, 'Username must be at most 20 characters'),
    email: z.string().email().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters').trim(),
})

export const userLoginValidation = z.object({
    email: z.string().email().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters').trim(),
})

export const userValidation = z.object({
    name: z.string().min(4, 'Name must be at least 4 characters').max(64, 'Name must be at most 20 characters'),
    username: z.string().trim().toLowerCase().min(4, 'Username must be at least 4 characters').max(20, 'Username must be at most 20 characters'),
    country: z.string(),
    website: z.string(),
    skills: z.array(z.string()),
    bio: z.string().trim(),
})
