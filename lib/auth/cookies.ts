import { NextResponse } from 'next/server';

export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
) {
    // Set access token cookie
    response.cookies.set('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',  // ✅ Changed from 'strict' to 'lax'
        maxAge: 60 * 15, // 15 minutes
        path: '/',
    });

    // Set refresh token cookie
    response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',  // ✅ Changed from 'strict' to 'lax'
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return response;
}

export function clearAuthCookies(response: NextResponse) {
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');
    return response;
}
