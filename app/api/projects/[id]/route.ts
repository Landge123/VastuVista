import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { projectSchema } from '@/lib/validation';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    validationErrorResponse,
} from '@/lib/response';
import { z } from 'zod';

// GET single project
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const project = await prisma.project.findFirst({
            where: {
                id: params.id,
                userId: user.userId,
            },
            include: {
                designs: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!project) {
            return errorResponse('Project not found', 404);
        }

        return successResponse({ project });
    } catch (error) {
        console.error('Get project error:', error);
        return errorResponse('Failed to fetch project', 500);
    }
}

// PATCH update project
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
        const validatedData = projectSchema.partial().parse(body);

        const project = await prisma.project.updateMany({
            where: {
                id: params.id,
                userId: user.userId,
            },
            data: validatedData,
        });

        if (project.count === 0) {
            return errorResponse('Project not found', 404);
        }

        const updatedProject = await prisma.project.findUnique({
            where: { id: params.id },
        });

        return successResponse({
            message: 'Project updated successfully',
            project: updatedProject,
        });
    } catch (error) {
        console.error('Update project error:', error);

        if (error instanceof z.ZodError) {
            return validationErrorResponse(error);
        }

        return errorResponse('Failed to update project', 500);
    }
}

// DELETE project
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const project = await prisma.project.deleteMany({
            where: {
                id: params.id,
                userId: user.userId,
            },
        });

        if (project.count === 0) {
            return errorResponse('Project not found', 404);
        }

        return successResponse({
            message: 'Project deleted successfully',
        });
    } catch (error) {
        console.error('Delete project error:', error);
        return errorResponse('Failed to delete project', 500);
    }
}
