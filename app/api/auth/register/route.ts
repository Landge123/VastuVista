import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db/users';
import { hashPassword } from '@/lib/auth/password';
import { generateTokens } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required',
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email format',
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User with this email already exists',
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with isActive set to true
        const user = await createUser({
            email,
            password: hashedPassword,
            name: name || null,
            role: 'USER',
            isActive: true,  // ✅ FIXED: Set active by default
        });

        // Generate tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                    accessToken: tokens.accessToken,
                },
            },
            { status: 201 }
        );

        // Set cookies
        setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

        return response;
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Registration failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
