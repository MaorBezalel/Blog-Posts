'use server';

import { Prisma } from '@prisma/client';
import { createUser, getUser } from '@/lib/db/dal';
import { createSession } from '@/lib/session';
import type { LoginFormActionErrorState, UserSessionPayload, SignUpFormActionErrorState } from '@/types/auth';
import { validateSignUpForm, validateLoginForm, handlePrismaError } from '@/actions/_utils';

export async function signup(
    initialState: SignUpFormActionErrorState | null,
    formData: FormData
): Promise<SignUpFormActionErrorState> {
    // 1. Validate the form data
    const validatedFields = validateSignUpForm(formData);
    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 2. Check if the user already exists and create a new user
    const { username, email, password } = validatedFields.data;
    let payload: UserSessionPayload;
    try {
        const userId = await createUser(username, email, password);
        payload = { userId, username, email };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        throw error;
    }

    // 3. Sign a session token and set it as a HTTP-only cookie
    await createSession(payload);

    return {
        type: 'success',
        errors: null,
    };
}

export async function login(
    initialState: LoginFormActionErrorState | null,
    formData: FormData
): Promise<LoginFormActionErrorState> {
    // 1. Validate the form data
    const validatedFields = validateLoginForm(formData);
    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 2. Check if the user exists and return the user's session
    let payload: UserSessionPayload | null;
    if ('email' in validatedFields.data) {
        const { password, email } = validatedFields.data;
        payload = await getUser(email, password, 'email');
    } else {
        const { password, username } = validatedFields.data;
        payload = await getUser(username, password, 'username');
    }
    if (!payload) {
        return {
            type: 'error',
            errors: {
                email: ['Invalid email/username or password'],
                username: ['Invalid email/username or password'],
                password: ['Invalid email/username or password'],
            },
        };
    }

    // 3. Sign a session token and set it as a HTTP-only cookie
    await createSession(payload);

    return {
        type: 'success',
        errors: null,
    };
}
