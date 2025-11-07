import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/response';

export async function GET(request: NextRequest) {
    try {
        // Verify the JWT token from the request
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        // Fetch user data from database
        const userData = await prisma.user.findUnique({
            where: { id: user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!userData) {
            return errorResponse('User not found', 404);
        }

        return successResponse({ user: userData });
    } catch (error) {
        console.error('Get current user error:', error);
        return errorResponse('Failed to fetch user data', 500);
    }
}
