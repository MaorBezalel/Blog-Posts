import Link from 'next/link';
import { Post, Tag } from '@prisma/client';
import { formatDate } from '@/utils/helpers';
import { NAV_ITEMS } from '@/utils/constants';

type PostItemProps = Pick<Post, 'title' | 'slug' | 'content' | 'updatedAt'> & {
    tags: Pick<Tag, 'name'>[];
};

export function PostItem({ title, slug, content, tags, updatedAt }: PostItemProps) {
    return (
        <article className="flex flex-col" itemType="https://schema.org/BlogPosting" itemScope>
            <time className="font-bold text-zinc-500" dateTime={updatedAt.toISOString()} itemProp="datePublished">
                {formatDate(updatedAt)}
            </time>
            <Link href={`/${NAV_ITEMS.POSTS.href}/${slug}`} passHref itemProp="url" aria-label={`Read ${title}`}>
                <h2 className="text-2xl font-bold hover:text-zinc-700" itemProp="headline">
                    {title}
                </h2>
            </Link>
            <ul className="flex items-baseline gap-2 uppercase text-pink-500" itemProp="keywords">
                {tags.map(tag => (
                    <li key={tag.name}>{tag.name}</li>
                ))}
            </ul>
            <p className="mt-4 text-lg text-gray-500" itemProp="articleBody">
                {content}
            </p>
        </article>
    );
}
