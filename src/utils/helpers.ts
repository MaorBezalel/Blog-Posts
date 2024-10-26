export function getCurrentYear() {
    return new Date().getFullYear();
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function parseCommaSeparatedSearchParam(searchParam: string | string[]): string[] {
    return Array.isArray(searchParam) ? searchParam : searchParam?.split(',').filter(val => Boolean(val.trim())) || [];
}

export function generateSkipFromPageAndTake(page: number, take: number) {
    if (page < 1) {
        page = 1;
    }
    return (page - 1) * take;
}
