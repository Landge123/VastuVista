import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

// Validate request body
export function validateBody<T>(schema: z.ZodSchema<T>) {
    return async (
        request: NextRequest,
        handler: (request: NextRequest, data: T) => Promise<NextResponse>
    ): Promise<NextResponse> => {
        try {
            // Parse request body
            const body = await request.json();

            // Validate against schema
            const validatedData = schema.parse(body);

            // Call handler with validated data
            return await handler(request, validatedData);
        } catch (error) {
            if (error instanceof ZodError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Validation failed',
                        errors: error.errors.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message,
                        })),
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid request body',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
                { status: 400 }
            );
        }
    };
}

// Validate query parameters
export function validateQuery<T>(schema: z.ZodSchema<T>) {
    return async (
        request: NextRequest,
        handler: (request: NextRequest, data: T) => Promise<NextResponse>
    ): Promise<NextResponse> => {
        try {
            // Parse query parameters
            const { searchParams } = new URL(request.url);
            const queryObject = Object.fromEntries(searchParams.entries());

            // Validate against schema
            const validatedData = schema.parse(queryObject);

            // Call handler with validated data
            return await handler(request, validatedData);
        } catch (error) {
            if (error instanceof ZodError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Invalid query parameters',
                        errors: error.errors.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message,
                        })),
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid query parameters',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
                { status: 400 }
            );
        }
    };
}
