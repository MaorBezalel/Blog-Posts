export const NAV_ITEMS = {
    HOME: {
        href: '/',
        label: 'Home',
    },
    POSTS: {
        href: '/posts',
        label: 'Posts',
    },
    TAGS: {
        href: '/tags',
        label: 'Tags',
    },
    USER: {
        href: '/user',
        label: 'User',
    },
    LOGIN: {
        href: '/login',
        label: 'Login',
    },
    SIGNUP: {
        href: '/sign-up',
        label: 'Sign Up',
    },
} as const;
export type ROUTES = (typeof NAV_ITEMS)[keyof typeof NAV_ITEMS]['href'];

/**
 * The routes that can only be accessed by authenticated users
 */
export const PROTECTED_ROUTES = [NAV_ITEMS.USER.href] as const;

/**
 * The routes that can be accessed by everyone (authenticated and guest users)
 */
export const PUBLIC_ROUTES = [NAV_ITEMS.HOME.href, NAV_ITEMS.POSTS.href, NAV_ITEMS.TAGS.href] as const;

/**
 * The routes that can only be accessed by guests (unauthenticated users)
 */
export const GUEST_ROUTES = [NAV_ITEMS.LOGIN.href, NAV_ITEMS.SIGNUP.href] as const;
