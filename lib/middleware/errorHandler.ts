import { NextRequest, NextResponse } from 'next/server';

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public errors?: any[]
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Global error handler
export function withErrorHandler(
    handler: (request: NextRequest) => Promise<NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        try {
            return await handler(request);
        } catch (error) {
            console.error('API Error:', error);

            // Handle known API errors
            if (error instanceof ApiError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message,
                        errors: error.errors,
                    },
                    { status: error.statusCode }
                );
            }

            // Handle unknown errors
            const isDevelopment = process.env.NODE_ENV === 'development';

            return NextResponse.json(
                {
                    success: false,
                    message: 'Internal server error',
                    error: isDevelopment && error instanceof Error ? error.message : undefined,
                    stack: isDevelopment && error instanceof Error ? error.stack : undefined,
                },
                { status: 500 }
            );
        }
    };
}
