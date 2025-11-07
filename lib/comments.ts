import prisma from '@/lib/prisma';

// Create comment
export async function createComment(data: {
    content: string;
    postId: string;
    authorId: string;
}) {
    try {
        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                authorId: data.authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        return comment;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw new Error('Failed to create comment');
    }
}

// Get comments by post ID
export async function getCommentsByPostId(postId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments');
    }
}

// Update comment
export async function updateComment(id: string, content: string) {
    try {
        const comment = await prisma.comment.update({
            where: { id },
            data: { content },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return comment;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw new Error('Failed to update comment');
    }
}

// Delete comment
export async function deleteComment(id: string) {
    try {
        await prisma.comment.delete({
            where: { id },
        });
        return true;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw new Error('Failed to delete comment');
    }
}
