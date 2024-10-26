import { PrismaClient, Prisma, Tag } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcrypt';
import { PostJson, UserJson, CommentJson } from './_types';

/**
 * Clear the database of all data
 *
 * @param prisma The PrismaClient instance
 * @remarks Only use this function in a development environment and prior to seeding the database
 */
export async function clearDatabase(prisma: PrismaClient) {
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.comment.deleteMany();
}

/**
 * Seed the database with tags
 *
 * @param prisma The PrismaClient instance
 * @param posts The posts from the JSON data
 */
export async function seedTags(prisma: PrismaClient, posts: PostJson[]) {
    const tags = posts.flatMap(post => post.tags);
    const uniqueTags = Array.from(new Set(tags));
    await prisma.tag.createMany({ data: uniqueTags.map(tag => ({ name: tag })) });
}

/**
 * Seed the database with users
 *
 * @param prisma The PrismaClient instance
 * @param users The users from the JSON data
 * @returns A mapping of numeric user IDs to CUIDs
 */
export async function seedUsers(prisma: PrismaClient, users: UserJson[]): Promise<Record<number, string>> {
    const usersNumericIdToCuid: Record<number, string> = {};
    const usersToSeed = await Promise.all(
        users.map(async user => {
            const cuid = createId();
            usersNumericIdToCuid[user.id] = cuid;
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return {
                id: cuid,
                email: user.email,
                username: user.username,
                hashedPassword,
                image: user.image,
            };
        })
    );
    await prisma.user.createMany({ data: usersToSeed });
    return usersNumericIdToCuid;
}

/**
 * Seed the database with posts
 *
 * @param prisma The PrismaClient instance
 * @param posts The posts from the JSON data
 * @param usersNumericIdToCuid A mapping of numeric user IDs to CUIDs
 * @returns A mapping of numeric post IDs to CUIDs
 *
 * @remarks This is also where we connect the author (User) and tags (Tag) to each post
 */
export async function seedPosts(
    prisma: PrismaClient,
    posts: PostJson[],
    usersNumericIdToCuid: Record<number, string>
): Promise<Record<number, string>> {
    const postsNumericIdToCuid: Record<number, string> = {};
    const postsToSeed: Prisma.PostCreateInput[] = posts.map(post => {
        const cuid = createId();
        postsNumericIdToCuid[post.id] = cuid;
        return {
            id: cuid,
            title: post.title,
            slug: post.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, ''),
            content: post.body,
            author: {
                connect: { id: usersNumericIdToCuid[post.userId] },
            },
            tags: {
                connect: post.tags.map(tag => ({
                    name: tag,
                })),
            },
        };
    });
    await Promise.all(postsToSeed.map(post => prisma.post.create({ data: post })));
    return postsNumericIdToCuid;
}

/**
 * Seed the database with comments
 *
 * @param prisma The PrismaClient instance
 * @param comments The comments from the JSON data
 * @param usersNumericIdToCuid A mapping of numeric user IDs to CUIDs
 * @param postsNumericIdToCuid A mapping of numeric post IDs to CUIDs
 */
export async function seedComments(
    prisma: PrismaClient,
    comments: CommentJson[],
    usersNumericIdToCuid: Record<number, string>,
    postsNumericIdToCuid: Record<number, string>
) {
    const commentsToSeed: Prisma.CommentCreateInput[] = comments.map(comment => ({
        content: comment.body,
        author: {
            connect: { id: usersNumericIdToCuid[comment.userId] },
        },
        post: {
            connect: { id: postsNumericIdToCuid[comment.postId] },
        },
    }));
    await Promise.all(commentsToSeed.map(comment => prisma.comment.create({ data: comment })));
}

/**
 * Log a message to the console
 *
 * @param funcName The name of the function that is logging the message
 * @param message The message to log
 */
export function logger(funcName: string, message: string): void {
    const colors = {
        date: '\x1b[36m', // Cyan
        funcName: '\x1b[33m', // Yellow
        message: '\x1b[32m', // Green
        reset: '\x1b[0m', // Reset color
    };
    console.log(
        `${colors.date}[${new Date().toLocaleString()}]${colors.reset} ` +
            `${colors.funcName}[${funcName}]${colors.reset} ` +
            `${colors.message}[${message}]${colors.reset}`
    );
}
