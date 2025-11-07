import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getCookie, ACCESS_TOKEN_COOKIE } from '@/lib/auth/cookies';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

// Middleware to verify authentication
export async function withAuth(
    request: NextRequest,
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        // Get access token from cookie
        const accessToken = getCookie(request, ACCESS_TOKEN_COOKIE);

        if (!accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Authentication required',
                    error: 'No access token provided',
                },
                { status: 401 }
            );
        }

        // Verify token
        const payload = verifyAccessToken(accessToken);

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired token',
                    error: 'Token verification failed',
                },
                { status: 401 }
            );
        }

        // Attach user to request
        const authenticatedRequest = request as AuthenticatedRequest;
        authenticatedRequest.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };

        // Call the actual handler
        return await handler(authenticatedRequest);
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Middleware to check specific roles
export function withRole(allowedRoles: string[]) {
    return async (
        request: NextRequest,
        handler: (request: AuthenticatedRequest) => Promise<NextResponse>
    ): Promise<NextResponse> => {
        return withAuth(request, async (authRequest) => {
            const userRole = authRequest.user?.role;

            if (!userRole || !allowedRoles.includes(userRole)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Insufficient permissions',
                        error: `Required roles: ${allowedRoles.join(', ')}`,
                    },
                    { status: 403 }
                );
            }

            return await handler(authRequest);
        });
    };
}
