import prisma from '@/lib/prisma';

// Get profile by user ID
export async function getProfileByUserId(userId: string) {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch profile');
    }
}

// Create or update profile
export async function upsertProfile(
    userId: string,
    data: {
        bio?: string;
        avatar?: string;
        phone?: string;
        dateOfBirth?: Date;
        address?: string;
        city?: string;
        country?: string;
    }
) {
    try {
        const profile = await prisma.profile.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
        return profile;
    } catch (error) {
        console.error('Error upserting profile:', error);
        throw new Error('Failed to update profile');
    }
}

// Delete profile
export async function deleteProfile(userId: string) {
    try {
        await prisma.profile.delete({
            where: { userId },
        });
        return true;
    } catch (error) {
        console.error('Error deleting profile:', error);
        throw new Error('Failed to delete profile');
    }
}
