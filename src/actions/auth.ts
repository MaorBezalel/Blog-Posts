'use server';

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { SignUpFormSchema, LoginFormWithEmailSchema, LoginFormWithUsernameSchema } from '@/lib/validations';
import { createUser } from '@/lib/dal';
import { createSession } from '@/lib/session';
import type { SignUpActionErrorState, SessionPayload } from '@/types/auth';
import { validateSignUpForm, handlePrismaError } from '@/actions/_utils';

export async function signUpAction(
    initialState: SignUpActionErrorState | null,
    formData: FormData
): Promise<SignUpActionErrorState> {
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
    let payload: SessionPayload;
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
