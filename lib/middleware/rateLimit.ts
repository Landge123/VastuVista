import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
    message?: string;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Clean every minute

// Get client identifier (IP address)
function getClientId(request: NextRequest): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to a default identifier
    return 'unknown';
}

// Rate limit middleware
export function rateLimit(config: RateLimitConfig) {
    const {
        windowMs,
        maxRequests,
        message = 'Too many requests, please try again later.',
    } = config;

    return async (
        request: NextRequest,
        handler: (request: NextRequest) => Promise<NextResponse>
    ): Promise<NextResponse> => {
        const clientId = getClientId(request);
        const now = Date.now();
        const key = `${clientId}:${request.nextUrl.pathname}`;

        // Get current rate limit data
        let rateLimitData = rateLimitStore.get(key);

        // Initialize or reset if window expired
        if (!rateLimitData || now > rateLimitData.resetTime) {
            rateLimitData = {
                count: 0,
                resetTime: now + windowMs,
            };
            rateLimitStore.set(key, rateLimitData);
        }

        // Increment request count
        rateLimitData.count++;

        // Check if limit exceeded
        if (rateLimitData.count > maxRequests) {
            const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);

            return NextResponse.json(
                {
                    success: false,
                    message,
                    error: 'Rate limit exceeded',
                    retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString(),
                    },
                }
            );
        }

        // Add rate limit headers to response
        const response = await handler(request);
        response.headers.set('X-RateLimit-Limit', maxRequests.toString());
        response.headers.set(
            'X-RateLimit-Remaining',
            (maxRequests - rateLimitData.count).toString()
        );
        response.headers.set(
            'X-RateLimit-Reset',
            new Date(rateLimitData.resetTime).toISOString()
        );

        return response;
    };
}

// Preset rate limit configurations
export const RATE_LIMIT_PRESETS = {
    strict: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 requests per 15 minutes
    standard: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
    relaxed: { windowMs: 15 * 60 * 1000, maxRequests: 1000 }, // 1000 requests per 15 minutes
    auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes (for auth endpoints)
};
