import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import ms from 'ms';
import { type UserSessionPayload } from '@/types/auth';
import { NAV_ITEMS } from '@/utils/constants';
import { cache } from 'react';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const SESSION_TOKEN_EXPIRY = process.env.JWT_SESSION_TOKEN_EXPIRY!;
const SESSION_TOKEN_NAME = process.env.JWT_SESSION_TOKEN_NAME!;

/**
 * Encrypt the payload and return the session token
 *
 * @param payload The payload to be encrypted
 * @return The encrypted session token
 */
async function encrypt(payload: UserSessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(SESSION_TOKEN_EXPIRY)
        .sign(SECRET);
}

/**
 * Decrypt the session token and return the payload
 *
 * @param token The session token to be decrypted
 * @return The decrypted payload
 *
 * @throws If the token is invalid or expired
 */
async function decrypt(token: string): Promise<UserSessionPayload> {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as UserSessionPayload;
}

/**
 * Create a session, set it as a HTTP-only cookie, and redirect the user to the home page
 *
 * @param payload The payload to be encrypted and stored in the session token
 *
 * @remarks Should be called after the user has successfully logged in or signed up
 */
export async function createSession(payload: UserSessionPayload) {
    const session = await encrypt(payload);
    (await cookies()).set(SESSION_TOKEN_NAME, session, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms(SESSION_TOKEN_EXPIRY) / 1000,
        path: '/',
    });
    redirect(NAV_ITEMS.HOME.href, RedirectType.replace);
}

/**
 * Verify the session token and return the payload if it is valid
 *
 * @returns The payload of the session token
 *
 * @remarks Should be called on every page load to check if the user is logged in
 */
export const verifySession = cache(async () => {
    const session = (await cookies()).get(SESSION_TOKEN_NAME)?.value ?? '';

    try {
        const payload = await decrypt(session);
        return { userId: payload.userId }; // TODO: return the role too
    } catch (error) {
        // console.error(error);
        return undefined;
    }
});

/**
 * Remove the session token from the cookies and redirect the user to the login page
 *
 * @remarks Should be called after the user has successfully logged out
 */
export async function removeSession() {
    (await cookies()).delete(SESSION_TOKEN_NAME);
    redirect(NAV_ITEMS.LOGIN.href, RedirectType.replace);
}
