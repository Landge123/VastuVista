import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

// Generate access token
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        issuer: 'your-app-name',
        audience: 'your-app-users',
    });
}

// Generate refresh token
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        issuer: 'your-app-name',
        audience: 'your-app-users',
    });
}

// Verify access token
export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'your-app-name',
            audience: 'your-app-users',
        }) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Access token verification failed:', error);
        return null;
    }
}

// Verify refresh token
export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
            issuer: 'your-app-name',
            audience: 'your-app-users',
        }) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        return null;
    }
}

// Generate both tokens
export function generateTokens(payload: TokenPayload) {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
}
