import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokens } from '@/lib/auth/jwt';
import { getCookie, REFRESH_TOKEN_COOKIE, setAuthCookies } from '@/lib/auth/cookies';
import { getUserById } from '@/lib/db/users';

export async function POST(request: NextRequest) {
    try {
        // Get refresh token from cookie
        const refreshToken = getCookie(request, REFRESH_TOKEN_COOKIE);

        if (!refreshToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Refresh token not found',
                },
                { status: 401 }
            );
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired refresh token',
                },
                { status: 401 }
            );
        }

        // Verify user still exists and is active
        const user = await getUserById(payload.userId);

        if (!user || !user.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found or inactive',
                },
                { status: 401 }
            );
        }

        // Generate new tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: tokens.accessToken,
                },
            },
            { status: 200 }
        );

        // Set new cookies
        setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

        return response;
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Token refresh failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
