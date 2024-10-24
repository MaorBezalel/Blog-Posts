import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';
import { PROTECTED_ROUTES, GUEST_ROUTES, NAV_ITEMS } from '@/constants';

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = PROTECTED_ROUTES.includes(path as (typeof PROTECTED_ROUTES)[number]);
    const isGuest = GUEST_ROUTES.includes(path as (typeof GUEST_ROUTES)[number]);

    switch (true) {
        case isProtected: {
            // Check if the user is authenticated
            // If the user is not authenticated, redirect them to the login page
            // If the user is authenticated, allow them to access the protected route
            const session = await verifySession();
            if (session) return NextResponse.next();
            else return NextResponse.redirect(new URL(NAV_ITEMS.LOGIN.href, req.nextUrl.origin));
        }
        case isGuest: {
            // Check if the user is authenticated
            // If the user is authenticated, redirect them to the user page
            // If the user is not authenticated, allow them to access the guest route
            const session = await verifySession();
            if (session) return NextResponse.redirect(new URL(NAV_ITEMS.USER.href, req.nextUrl.origin));
            else return NextResponse.next();
        }
        default:
            // Allow everyone to access the public route
            return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - site.webmanifest (web manifest file)
         * - icons (icons folder)
         * - fonts (fonts folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|site.webmanifest|icons|fonts).*)',
    ],
};
