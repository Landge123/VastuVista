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

// GET all projects for current user
export async function GET(request: NextRequest) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const projects = await prisma.project.findMany({
            where: { userId: user.userId },
            include: {
                designs: {
                    select: {
                        id: true,
                        title: true,
                        vastuCompliant: true,
                        vastuScore: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: { designs: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return successResponse({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        return errorResponse('Failed to fetch projects', 500);
    }
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const body = await request.json();
        const validatedData = projectSchema.parse(body);

        const project = await prisma.project.create({
            data: {
                ...validatedData,
                userId: user.userId,
            },
            include: {
                _count: {
                    select: { designs: true },
                },
            },
        });

        return successResponse(
            {
                message: 'Project created successfully',
                project,
            },
            201
        );
    } catch (error) {
        console.error('Create project error:', error);

        if (error instanceof z.ZodError) {
            return validationErrorResponse(error);
        }

        return errorResponse('Failed to create project', 500);
    }
}
