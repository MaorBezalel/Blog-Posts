export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center gap-12 text-center">
            <h1 className="text-7xl font-bold">Welcome to my Blog Posts App</h1>
            <p className="text-2xl">
                This is a simple blog posts app that I built for learning Next.js and its ecosystem.
                <br />
                In the app, users can:
            </p>
            <ul className="list-disc text-start text-xl">
                <li className="mb-1">View a list of blog posts</li>
                <li className="mb-1">Read a single blog post and its comments</li>
                <li>
                    Authenticated users can:
                    <ul className="ml-4 list-inside list-[circle]">
                        <li>Create, update, and delete their blog posts</li>
                        <li>Leave comments on blog posts</li>
                    </ul>
                </li>
            </ul>
        </main>
    );
}
