import { NextResponse } from 'next/server';
import { z } from 'zod';

export function successResponse(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

export function validationErrorResponse(error: z.ZodError) {
    return NextResponse.json(
        {
            error: 'Validation failed',
            details: error.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        },
        { status: 400 }
    );
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
    );
}
