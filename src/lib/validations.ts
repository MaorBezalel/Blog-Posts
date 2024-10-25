import { z } from 'zod';

export const SignUpFormSchema = z
    .object({
        username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters long' })
            .max(20, { message: 'Username must be at most 20 characters long' })
            .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username must contain only letters, numbers, and underscores' })
            .regex(/[a-zA-Z]/, { message: 'Username must contain at least one letter' })
            .toLowerCase()
            .trim(),
        email: z
            .string()
            .email({ message: 'Invalid email address' })
            .min(5, { message: 'Email must be at least 5 characters long' })
            .toLowerCase()
            .trim(),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(64, { message: 'Password must be at most 64 characters long' })
            .regex(/[a-zA-z]/, { message: 'Password must contain at least one letter' })
            .regex(/[0-9]/, { message: 'Password must contain at least one number' })
            .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const LoginFormWithEmailSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, 'Password is required'),
});

export const LoginFormWithUsernameSchema = z
    .object({
        username: z
            .string()
            .min(1, { message: 'Username is required' })
            .regex(/^[a-zA-Z0-9_]+$/, { message: 'Invalid username' })
            .regex(/[a-zA-Z]/, { message: 'Invalid username' }),
    })
    .merge(LoginFormWithEmailSchema.pick({ password: true }));
