import prisma from '@/lib/db/_prisma';
import bcrypt from 'bcrypt';
import type { UserSessionPayload } from '@/types/auth';

/**
 * Creates a new user in the database
 *
 * @param username The username of the new user
 * @param email The email of the new user
 * @param password The password of the new user
 * @returns The user ID of the newly created user
 *
 * @remarks This function should be used when a user successfully signs up
 */
export async function createUser(username: string, email: string, password: string): Promise<string> {
    const { id: userId } = await prisma.user.create({
        data: {
            username,
            email,
            hashedPassword: await bcrypt.hash(password, 10),
        },
        select: {
            id: true,
        },
    });
    return userId;
}

/**
 * Tries to find and verify a user from the database based on a given email/username and password
 *
 * @param emailOrUsernameValue The value of the email or username
 * @param password The password of the user
 * @param emailOrUsernameKey The first part of the query key (either 'email' or 'username')
 * @returns The user session payload if the user exists and the password is correct, otherwise null
 *
 * @remarks This function should be used when a user successfully logs in
 */
export async function getUser(
    emailOrUsernameValue: string,
    password: string,
    emailOrUsernameKey: 'email' | 'username'
): Promise<UserSessionPayload | null> {
    const whereClause =
        emailOrUsernameKey === 'email' ? { email: emailOrUsernameValue } : { username: emailOrUsernameValue };
    const user = await prisma.user.findUnique({
        where: whereClause,
        select: {
            id: true,
            username: true,
            email: true,
            hashedPassword: true,
        },
    });
    return !!user && (await bcrypt.compare(password, user.hashedPassword))
        ? { userId: user.id, username: user.username, email: user.email }
        : null;
}

/**
 * Gets ordered and paginated posts from the database.
 *
 * @param [skip=0] The number of posts to skip. Default is 0.
 * @param [take=10] The number of posts to take. Default is 10.
 * @returns The ordered and paginated posts
 */
export async function getPosts(skip: number = 0, take: number = 10) {
    return prisma.post.findMany({
        skip,
        take,
        orderBy: {
            updatedAt: 'desc',
        },
        select: {
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
        },
    });
}

/**
 * Gets ordered and paginated posts from the database based on tags.
 *
 * @param tags The tags to filter the posts by
 * @param [skip=0] The number of posts to skip. Default is 0.
 * @param [take=10] The number of posts to take. Default is 10.
 * @returns The ordered and paginated posts
 */
export async function getPostsByTags(tags: string[], skip: number = 0, take: number = 10) {
    return prisma.post.findMany({
        skip,
        take,
        where: {
            tags: {
                some: {
                    name: {
                        in: tags,
                    },
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
        select: {
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
        },
    });
}

/**
 * Gets ordered and paginated posts from the database based on a search query (title).
 *
 * @param searchQuery The search query to filter the posts by title
 * @param [take=5] The number of posts to take. Default is 5.
 * @param [lastPostSlug=null] The slug of the last post in the previous query. Default is null (i.e., no cursor - start of the query).
 */
export async function getPostsByTitle(searchQuery: string, take: number = 5, lastPostSlug: string | null) {
    return prisma.post.findMany({
        take,
        skip: lastPostSlug ? 1 : 0, // If a cursor is provided, we skip by 1 so it won't be included in the results
        cursor: lastPostSlug ? { slug: lastPostSlug } : undefined,
        where: {
            title: {
                contains: searchQuery,
            },
        },
        orderBy: [{ updatedAt: 'desc' }, { slug: 'asc' }],
        select: {
            title: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

/**
 * Gets a single post from the database based on its slug
 *
 * @param slug The slug of the post
 * @returns The post
 *
 * @todo Consider indexing the slug column in the database
 */
export async function getPost(slug: string) {
    return prisma.post.findUnique({
        where: {
            slug,
        },
        select: {
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
            author: {
                select: {
                    username: true,
                    image: true,
                },
            },
        },
    });
}

/**
 * Gets all tags from the database with an optional count of posts for each tag
 *
 * @param [includePostCount=false] Whether to include the count of posts for each tag. Default is false.
 * @returns The tags with only their name included, and optionally the count of posts for each tag
 */
export async function getTags(includePostCount: boolean = false) {
    return prisma.tag.findMany({
        select: {
            name: true,
            _count: includePostCount ? { select: { posts: true } } : undefined,
        },
    });
}
