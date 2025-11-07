import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { uploadFile, deleteUploadedFile } from '@/lib/upload/uploadService';
import { getProfileByUserId, upsertProfile } from '@/lib/db/profiles';
import { withErrorHandler } from '@/lib/middleware/errorHandler';
import { withLogger } from '@/lib/middleware/logger';
import { composeMiddleware } from '@/lib/middleware/composer';

async function uploadAvatarHandler(request: AuthenticatedRequest) {
    try {
        const userId = request.user?.userId;

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID not found',
                },
                { status: 400 }
            );
        }

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

        // Get existing profile
        const existingProfile = await getProfileByUserId(userId);

        // Upload new avatar
        const result = await uploadFile(file, 'avatar');

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

        // Delete old avatar if exists
        if (existingProfile?.avatar && existingProfile.avatar.startsWith('/public')) {
            const oldAvatarPath = existingProfile.avatar.replace(/^\//, '');
            await deleteUploadedFile(oldAvatarPath);
        }

        // Update profile with new avatar URL
        const profile = await upsertProfile(userId, {
            avatar: result.file?.url,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Avatar uploaded successfully',
                data: {
                    avatar: result.file?.url,
                    profile,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to upload avatar',
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

// POST endpoint
export async function POST(request: NextRequest) {
    return composedHandler((req) =>
        withAuth(req, uploadAvatarHandler)
    )(request);
}
