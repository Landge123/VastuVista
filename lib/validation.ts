import { z } from 'zod';

// User schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Project schemas
export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
});

// Design schemas
export const designSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    dimensions: z.object({
        length: z.number().positive('Length must be positive'),
        width: z.number().positive('Width must be positive'),
        unit: z.enum(['sqft', 'sqm', 'feet', 'meters']),
    }),
    rooms: z.array(z.object({
        name: z.string(),
        type: z.string(),
        direction: z.enum(['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest']),
        position: z.object({
            x: z.number(),
            y: z.number(),
        }),
        dimensions: z.object({
            width: z.number().positive(),
            height: z.number().positive(),
        }),
    })),
    projectId: z.string(),
});

export const vastuCheckSchema = z.object({
    rooms: z.array(z.object({
        name: z.string(),
        type: z.string(),
        direction: z.string(),
        position: z.object({
            x: z.number(),
            y: z.number(),
        }),
    })),
    dimensions: z.object({
        length: z.number(),
        width: z.number(),
    }),
});
