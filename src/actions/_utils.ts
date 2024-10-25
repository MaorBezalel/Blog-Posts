import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { SignUpFormSchema, LoginFormWithEmailSchema, LoginFormWithUsernameSchema } from '@/lib/validations';
import type {
    SafelyParsedAuthFormSchema,
    AuthFormActionErrorState,
    SignUpFormActionErrorState,
    LoginFormActionErrorState,
} from '@/types/auth';

/**
 * Validate the sign-up form data
 *
 * @param formData The form data to be validated
 * @returns The validated fields or an error state
 */
export function validateSignUpForm(formData: FormData): SafelyParsedAuthFormSchema<typeof SignUpFormSchema> {
    return SignUpFormSchema.safeParse({
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    });
}

/**
 * Validate the login form data with either an email or a username
 *
 * @param formData The form data to be validated
 * @returns The validated fields or an error state
 */
export function validateLoginForm(
    formData: FormData
): SafelyParsedAuthFormSchema<typeof LoginFormWithEmailSchema | typeof LoginFormWithUsernameSchema> {
    const isEmail = (formData.get('emailOrUsername') as string | null)?.includes('@');

    if (isEmail) {
        return LoginFormWithEmailSchema.safeParse({
            email: formData.get('emailOrUsername') as string,
            password: formData.get('password') as string,
        });
    } else {
        return LoginFormWithUsernameSchema.safeParse({
            username: formData.get('emailOrUsername') as string,
            password: formData.get('password') as string,
        });
    }
}

/**
 * Handle Prisma errors and return an appropriate error state
 *
 * @param error The error to be handled
 * @returns The error state
 */
export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AuthFormActionErrorState {
    if (error.code === 'P2002') {
        const target = error.meta?.target as Array<string>;
        if (target.includes('email')) {
            return {
                type: 'error',
                errors: {
                    email: ['Email is already taken'],
                },
            };
        }
        if (target.includes('username')) {
            return {
                type: 'error',
                errors: {
                    username: ['Username is already taken'],
                },
            };
        }
    }
    throw error;
}
