import { NextRequest, NextResponse } from 'next/server';

// CORS configuration
export interface CorsOptions {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
    maxAge?: number;
}

const DEFAULT_CORS_OPTIONS: CorsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
};

// Check if origin is allowed
function isOriginAllowed(origin: string, allowedOrigins: string | string[]): boolean {
    if (Array.isArray(allowedOrigins)) {
        return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
    }
    return allowedOrigins === '*' || allowedOrigins === origin;
}

// Apply CORS headers
export function applyCorsHeaders(
    request: NextRequest,
    response: NextResponse,
    options: CorsOptions = DEFAULT_CORS_OPTIONS
): NextResponse {
    const origin = request.headers.get('origin') || '';

    // Check if origin is allowed
    if (origin && isOriginAllowed(origin, options.origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (options.origin === '*') {
        response.headers.set('Access-Control-Allow-Origin', '*');
    }

    // Set other CORS headers
    response.headers.set('Access-Control-Allow-Methods', options.methods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', options.allowedHeaders.join(', '));

    if (options.credentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    if (options.maxAge) {
        response.headers.set('Access-Control-Max-Age', options.maxAge.toString());
    }

    return response;
}

// Handle preflight requests
export function handlePreflight(request: NextRequest): NextResponse | null {
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        return applyCorsHeaders(request, response);
    }
    return null;
}

// CORS middleware wrapper
export function withCors(
    handler: (request: NextRequest) => Promise<NextResponse>,
    options: CorsOptions = DEFAULT_CORS_OPTIONS
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        // Handle preflight
        const preflightResponse = handlePreflight(request);
        if (preflightResponse) {
            return preflightResponse;
        }

        // Handle actual request
        const response = await handler(request);
        return applyCorsHeaders(request, response, options);
    };
}
