import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';


import { getUserById } from '@/lib/db/users';

export async function GET(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get('token')?.value;

        console.log('Auth check - Token present:', !!token); // Debug log

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No token provided',
                },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verifyAccessToken(token);


        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid token',
                },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await getUserById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        // Return user data
        return NextResponse.json(
            {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        isActive: user.isActive,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
            },
            { status: 401 }
        );
    }
}
