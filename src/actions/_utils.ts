import { SignUpFormSchema } from '@/lib/validations';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { SignUpActionErrorState } from '@/types/auth';

/**
 * Validate the sign-up form data
 *
 * @param formData The form data to be validated
 * @returns The validated fields or an error state
 */
export function validateSignUpForm(
    formData: FormData
): z.SafeParseReturnType<z.infer<typeof SignUpFormSchema>, z.infer<typeof SignUpFormSchema>> {
    return SignUpFormSchema.safeParse({
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    });
}

/**
 * Handle Prisma errors and return an appropriate error state
 *
 * @param error The error to be handled
 * @returns The error state
 */
export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): SignUpActionErrorState {
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
