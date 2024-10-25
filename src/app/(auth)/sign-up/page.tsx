import Link from 'next/link';
import { NAV_ITEMS } from '@/utils/constants';
import { SignUpForm } from '@/app/(auth)/sign-up/form';

export default function SignUpPage() {
    return (
        <main className="flex flex-col items-center justify-center gap-5 px-7">
            <hgroup className="flex w-[40%] flex-col gap-2">
                <h1 className="text-6xl font-bold">Create an Account!</h1>
                <p className="text-lg text-zinc-500">Enter your information to get started with us!</p>
            </hgroup>
            <SignUpForm />
            <p>
                Already have an account?{' '}
                <Link href={NAV_ITEMS.LOGIN.href} className="underline">
                    Login
                </Link>
            </p>
        </main>
    );
}
