import { z } from 'zod'

export const userValidation = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
    
    bio: z.string()
        .max(500, 'Bio must be less than 500 characters')
        .optional(),
    
    country: z.string()
        .max(100, 'Country must be less than 100 characters')
        .optional(),
    
    website: z.string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    
    skills: z.array(z.string())
        .min(1, 'Please add at least one skill')
        .max(10, 'You can add up to 10 skills')
        .optional()
        .default([])
})

export type UserFormData = z.infer<typeof userValidation> 