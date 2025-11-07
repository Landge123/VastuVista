import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/middleware/auth';
import { getAllUsers } from '@/lib/db/users';

export async function GET(request: NextRequest) {
    return withRole(['ADMIN'])(request, async (authRequest: AuthenticatedRequest) => {
        try {
            const { searchParams } = new URL(request.url);
            const page = parseInt(searchParams.get('page') || '1', 10);
            const limit = parseInt(searchParams.get('limit') || '10', 10);
            const skip = (page - 1) * limit;

            // Get all users (admin only)
            const result = await getAllUsers({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            });

            return NextResponse.json(
                {
                    success: true,
                    data: {
                        users: result.users.map((user) => ({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            isActive: user.isActive,
                            createdAt: user.createdAt,
                        })),
                        pagination: {
                            page: result.page,
                            totalPages: result.totalPages,
                            total: result.total,
                        },
                    },
                },
                { status: 200 }
            );
        } catch (error) {
            console.error('Get users error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to get users',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
                { status: 500 }
            );
        }
    });
}
