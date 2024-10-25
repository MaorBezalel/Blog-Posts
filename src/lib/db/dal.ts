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
