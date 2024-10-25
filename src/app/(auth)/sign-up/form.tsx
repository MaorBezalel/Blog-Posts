'use client';

import { useActionState } from 'react';
import { signup } from '@/actions/auth';
import { InputField } from '@/components/ui/input-field';

export function SignUpForm() {
    const [state, action, isPending] = useActionState(signup, null);

    return (
        <form action={action} className="flex w-[40%] flex-col gap-5">
            <InputField
                id="username"
                label="Username"
                type="text"
                name="username"
                placeholder="john_doe"
                error={state?.errors?.username?.[0]}
            />
            <InputField
                id="email"
                label="Email"
                type="email"
                name="email"
                placeholder="johndoe@mail.com"
                error={state?.errors?.email?.[0]}
            />
            <InputField
                id="password"
                label="Password"
                type="password"
                name="password"
                error={state?.errors?.password?.[0]}
            />
            <InputField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                error={state?.errors?.confirmPassword?.[0]}
            />
            <button
                type="submit"
                className="w-[60%] self-center rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
                {isPending ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
    );
}
