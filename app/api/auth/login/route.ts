import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/response';
import { z } from 'zod';

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validatedData = loginSchema.parse(body);

        const { email, password } = validatedData;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return errorResponse('Invalid email or password', 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return errorResponse('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Create response
        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);

        if (error instanceof z.ZodError) {
            return validationErrorResponse(error);
        }

        return errorResponse('Failed to login', 500);
    }
}
