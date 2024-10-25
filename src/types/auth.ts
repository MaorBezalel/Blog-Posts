import z from 'zod';
import { SignUpFormSchema, LoginFormWithEmailSchema, LoginFormWithUsernameSchema } from '@/lib/validations';

export type SessionPayload = {
    userId: string;
    username: string;
    email: string;
};

export type UserSessionState = {
    session: SessionPayload | null;
    removeSession: () => void;
};

export type AuthFormSchemaType =
    | typeof SignUpFormSchema
    | typeof LoginFormWithEmailSchema
    | typeof LoginFormWithUsernameSchema;

export type SafelyParsedAuthFormSchema<TSchema extends z.ZodType<any, any>> = z.SafeParseReturnType<
    z.infer<TSchema>,
    z.infer<TSchema>
>;

export type AuthFormFieldErrors<TSchema extends AuthFormSchemaType = AuthFormSchemaType> =
    z.inferFlattenedErrors<TSchema>['fieldErrors'];

// prettier-ignore
export type AuthFormActionErrorState<TFieldErrors extends AuthFormFieldErrors = AuthFormFieldErrors>  = {
    type: 'error';
    errors: TFieldErrors;
} | {
    type: 'success';
    errors: null;
};

export type SignUpFormActionErrorState = AuthFormActionErrorState<AuthFormFieldErrors<typeof SignUpFormSchema>>;

export type LoginFormActionErrorState = AuthFormActionErrorState<
    AuthFormFieldErrors<typeof LoginFormWithEmailSchema | typeof LoginFormWithUsernameSchema>
>;
