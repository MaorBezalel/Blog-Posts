'use client';

import { useActionState } from 'react';
import { InputField, DynamicBinaryInputField } from '@/components/ui/input-field';
import { login } from '@/actions/auth';

export function LoginForm() {
    const [state, action, isPending] = useActionState(login, null);

    return (
        <form action={action} className="flex w-[40%] flex-col gap-6">
            <DynamicBinaryInputField
                id={['emailOrUsername', 'emailOrUsername']}
                label={['Email', 'Username']}
                type={['email', 'text']}
                name={['emailOrUsername', 'emailOrUsername']}
                placeholder={['johndoe@email.com', 'john_doe']}
                error={[state?.errors?.email?.[0], state?.errors?.username?.[0]]}
            />
            <InputField
                id="password"
                label="Password"
                type="password"
                name="password"
                error={state?.errors?.password?.[0]}
            />
            <button
                type="submit"
                className="w-[60%] self-center rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
                {isPending ? 'Logging In...' : 'Log In'}
            </button>
        </form>
    );
}
