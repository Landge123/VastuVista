import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            'Password must contain at least one special character'
        ),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    dateOfBirth: z.string().datetime().optional(),
    address: z.string().max(200, 'Address must be less than 200 characters').optional(),
    city: z.string().max(100, 'City must be less than 100 characters').optional(),
    country: z.string().max(100, 'Country must be less than 100 characters').optional(),
});

// Post validation schemas
export const createPostSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
    published: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

// Comment validation schemas
export const createCommentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
    postId: z.string().uuid('Invalid post ID'),
});

// Query parameter schemas
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

export const searchSchema = z.object({
    query: z.string().min(1, 'Search query is required').max(100),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
