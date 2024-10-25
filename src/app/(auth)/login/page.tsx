import Link from 'next/link';
import { NAV_ITEMS } from '@/utils/constants';
import { LoginForm } from '@/app/(auth)/login/form';

export default function LoginPage() {
    return (
        <main className="flex flex-col items-center justify-center gap-5 px-7">
            <hgroup className="flex w-[40%] flex-col gap-2">
                <h1 className="text-6xl font-bold">Welcome Back!</h1>
                <p className="text-lg text-zinc-500">We are glad to see you back with us :D</p>
            </hgroup>
            <LoginForm />
            <p>
                Don't have an account?{' '}
                <Link href={NAV_ITEMS.SIGNUP.href} className="underline">
                    Sign Up
                </Link>
            </p>
        </main>
    );
}
