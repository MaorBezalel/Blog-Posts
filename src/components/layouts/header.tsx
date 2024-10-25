'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS } from '@/utils/constants';

export function Header() {
    const pathname = usePathname();

    return (
        <header className="flex items-center justify-between border-b px-7 py-4">
            <Link href={NAV_ITEMS.HOME.href}>
                <Image src="/icons/favicon.ico" alt="Blog Posts" className="size-8" width={32} height={32} />
            </Link>

            <nav>
                <ul className="flex gap-6 text-[0.875rem]">
                    {Object.values(NAV_ITEMS).map(({ href, label }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`${pathname === href ? 'font-bold text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'}`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
