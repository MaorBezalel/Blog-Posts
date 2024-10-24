import z from 'zod';
import { SignUpFormSchema } from '@/lib/validations';

export type SessionPayload = {
    userId: string;
    username: string;
    email: string;
};

export type UserSessionState = {
    session: SessionPayload | null;
    removeSession: () => void;
};

export type SignUpErrors = z.inferFlattenedErrors<typeof SignUpFormSchema>['fieldErrors'];

// prettier-ignore
export type SignUpActionErrorState = {
    type: 'error';
    errors: SignUpErrors;
} | {
    type: 'success';
    errors: null;
};
