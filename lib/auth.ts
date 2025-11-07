import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export async function verifyToken(request: NextRequest): Promise<TokenPayload | null> {
    try {
        // Try to get token from cookie first
        const cookieToken = request.cookies.get('token')?.value;

        // Fallback to Authorization header
        const authHeader = request.headers.get('authorization');
        const bearerToken = authHeader?.replace('Bearer ', '');

        const token = cookieToken || bearerToken;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });
}
