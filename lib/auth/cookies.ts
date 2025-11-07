import { serialize, parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
};

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Set cookie in response
export function setCookie(
    response: NextResponse,
    name: string,
    value: string,
    options = COOKIE_OPTIONS
): void {
    const cookie = serialize(name, value, options);
    response.headers.append('Set-Cookie', cookie);
}

// Delete cookie from response
export function deleteCookie(response: NextResponse, name: string): void {
    const cookie = serialize(name, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    });
    response.headers.append('Set-Cookie', cookie);
}

// Get cookie from request
export function getCookie(request: NextRequest, name: string): string | undefined {
    const cookies = parse(request.headers.get('cookie') || '');
    return cookies[name];
}

// Set authentication cookies
export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
): void {
    setCookie(response, ACCESS_TOKEN_COOKIE, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60, // 15 minutes
    });

    setCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

// Clear authentication cookies
export function clearAuthCookies(response: NextResponse): void {
    deleteCookie(response, ACCESS_TOKEN_COOKIE);
    deleteCookie(response, REFRESH_TOKEN_COOKIE);
}
