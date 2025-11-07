import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Create post
export async function createPost(data: {
    title: string;
    content: string;
    authorId: string;
    published?: boolean;
    slug: string;
    tags?: string[];
}) {
    try {
        const post = await prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                authorId: data.authorId,
                published: data.published || false,
                slug: data.slug,
                tags: data.tags || [],
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return post;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error('Post with this slug already exists');
            }
        }
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
    }
}

// Get post by ID
export async function getPostById(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        },
                    },
                },
                comments: {
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
                },
            },
        });

        // Increment view count
        if (post) {
            await prisma.post.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });
        }

        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw new Error('Failed to fetch post');
    }
}

// Get post by slug
export async function getPostBySlug(slug: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        },
                    },
                },
                comments: {
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
                },
            },
        });

        // Increment view count
        if (post) {
            await prisma.post.update({
                where: { slug },
                data: { viewCount: { increment: 1 } },
            });
        }

        return post;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        throw new Error('Failed to fetch post');
    }
}

// Get all posts with pagination
export async function getAllPosts(options?: {
    skip?: number;
    take?: number;
    published?: boolean;
    authorId?: string;
    orderBy?: Prisma.PostOrderByWithRelationInput;
}) {
    try {
        const {
            skip = 0,
            take = 10,
            published,
            authorId,
            orderBy = { createdAt: 'desc' },
        } = options || {};

        const where: Prisma.PostWhereInput = {};
        if (published !== undefined) where.published = published;
        if (authorId) where.authorId = authorId;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                skip,
                take,
                where,
                orderBy,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: {
                                select: {
                                    avatar: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            }),
            prisma.post.count({ where }),
        ]);

        return {
            posts,
            total,
            page: Math.floor(skip / take) + 1,
            totalPages: Math.ceil(total / take),
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
    }
}

// Update post
export async function updatePost(
    id: string,
    data: {
        title?: string;
        content?: string;
        published?: boolean;
        slug?: string;
        tags?: string[];
    }
) {
    try {
        const post = await prisma.post.update({
            where: { id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return post;
    } catch (error) {
        console.error('Error updating post:', error);
        throw new Error('Failed to update post');
    }
}

// Delete post
export async function deletePost(id: string) {
    try {
        await prisma.post.delete({
            where: { id },
        });
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
}

// Search posts
export async function searchPosts(query: string, published: boolean = true) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } },
                ],
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            take: 20,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return posts;
    } catch (error) {
        console.error('Error searching posts:', error);
        throw new Error('Failed to search posts');
    }
}
