import { z } from 'zod'

// Schema validation for Post model
export const postValidation = z.object({
    requiredSkills: z.array(z.string()).min(1),
    description: z.string().min(10, 'Content must be at least 10 characters').max(1024, 'Content must be at most 1024 characters'),
    owner: z.string().optional(),
    category: z.string(),
})
