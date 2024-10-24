import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

/**
 * Creates a new user in the database
 *
 * @param username The username of the new user
 * @param email The email of the new user
 * @param password The password of the new user
 * @returns The user ID of the newly created user
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
