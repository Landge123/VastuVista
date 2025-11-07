import { NextRequest, NextResponse } from 'next/server';

type Middleware = (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
) => Promise<NextResponse>;

// Compose multiple middleware functions
export function composeMiddleware(...middlewares: Middleware[]) {
    return (finalHandler: (request: NextRequest) => Promise<NextResponse>) => {
        return middlewares.reduceRight(
            (next, middleware) => (request: NextRequest) => middleware(request, next),
            finalHandler
        );
    };
}
