import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { uploadFile } from '@/lib/upload/uploadService';
import { withErrorHandler } from '@/lib/middleware/errorHandler';
import { withLogger } from '@/lib/middleware/logger';
import { composeMiddleware } from '@/lib/middleware/composer';

async function uploadImageHandler(request: AuthenticatedRequest): Promise<NextResponse> {
    try {
        // Get form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No file provided',
                },
                { status: 400 }
            );
        }

        // Upload file
        const result = await uploadFile(file, 'image');

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.error || 'Upload failed',
                    errors: result.errors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    file: result.file,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to upload image',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Compose middleware
const composedHandler = composeMiddleware(
    withErrorHandler,
    withLogger
);

// POST endpoint - MUST return the result
export async function POST(request: NextRequest): Promise<NextResponse> {
    return composedHandler((req) =>
        withAuth(req, uploadImageHandler)
    )(request);
}
