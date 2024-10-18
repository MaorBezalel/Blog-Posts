import { getCurrentYear } from '@/utils';

export function Footer() {
    return (
        <footer className="border-t px-7 py-5 text-center text-zinc-400">
            <small>&copy; {getCurrentYear()} All rights reserved.</small>
        </footer>
    );
}
