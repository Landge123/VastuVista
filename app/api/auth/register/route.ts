import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/response';
import { z } from 'zod';

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validatedData = registerSchema.parse(body);

        const { email, password, name } = validatedData;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return errorResponse('User with this email already exists', 409);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        return successResponse(
            {
                message: 'User registered successfully',
                user,
            },
            201
        );
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return validationErrorResponse(error);
        }

        return errorResponse('Failed to register user', 500);
    }
}
