import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Get user by ID
export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                projects: true,
                designs: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
}

// Get user by email
export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                projects: true,
                designs: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Failed to fetch user');
    }
}

// Create new user
export async function createUser(data: {
    email: string;
    password: string;
    name?: string | null;
    role?: 'USER' | 'ADMIN' | 'MODERATOR';
    isActive?: boolean;  // ✅ Make sure this is here
}) {
    try {
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name || null,
                role: data.role || 'USER',
                isActive: data.isActive !== undefined ? data.isActive : true,  // ✅ Default to true
            },
        });
        return user;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error('Email already exists');
            }
        }
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}


// Update user
export async function updateUser(
    id: string,
    data: {
        email?: string;
        name?: string | null;
        password?: string;
        role?: 'USER' | 'ADMIN' | 'MODERATOR';
        isActive?: boolean;
    }
) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
}

// Delete user
export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id },
        });
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

// Get all users with pagination
export async function getAllUsers(options?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
}) {
    try {
        const { skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = options || {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take,
                orderBy,
                include: {
                    projects: true,
                    designs: true,
                },
            }),
            prisma.user.count(),
        ]);

        return {
            users,
            total,
            page: Math.floor(skip / take) + 1,
            totalPages: Math.ceil(total / take),
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}

// Search users
export async function searchUsers(query: string) {
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: query } },
                    { name: { contains: query } },
                ],
            },
            take: 10,
        });
        return users;
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
    }
}
