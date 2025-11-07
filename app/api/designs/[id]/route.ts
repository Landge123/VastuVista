import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { designSchema } from '@/lib/validation';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    validationErrorResponse,
} from '@/lib/response';
import { z } from 'zod';

// GET single design
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const design = await prisma.design.findFirst({
            where: {
                id: params.id,
                userId: user.userId,
            },
            include: {
                project: true,
            },
        });

        if (!design) {
            return errorResponse('Design not found', 404);
        }

        return successResponse({ design });
    } catch (error) {
        console.error('Get design error:', error);
        return errorResponse('Failed to fetch design', 500);
    }
}

// PATCH update design
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const body = await request.json();
        const validatedData = designSchema.partial().parse(body);

        const design = await prisma.design.updateMany({
            where: {
                id: params.id,
                userId: user.userId,
            },
            data: validatedData,
        });

        if (design.count === 0) {
            return errorResponse('Design not found', 404);
        }

        const updatedDesign = await prisma.design.findUnique({
            where: { id: params.id },
            include: { project: true },
        });

        return successResponse({
            message: 'Design updated successfully',
            design: updatedDesign,
        });
    } catch (error) {
        console.error('Update design error:', error);

        if (error instanceof z.ZodError) {
            return validationErrorResponse(error);
        }

        return errorResponse('Failed to update design', 500);
    }
}

// DELETE design
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const design = await prisma.design.deleteMany({
            where: {
                id: params.id,
                userId: user.userId,
            },
        });

        if (design.count === 0) {
            return errorResponse('Design not found', 404);
        }

        return successResponse({
            message: 'Design deleted successfully',
        });
    } catch (error) {
        console.error('Delete design error:', error);
        return errorResponse('Failed to delete design', 500);
    }
}
