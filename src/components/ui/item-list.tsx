type ItemListProps<TItem> = {
    className?: string;
    items: TItem[];
    renderItem: (item: TItem) => React.ReactNode;

    /**
     * Whether to include `display: contents` for each `li` element
     */
    includeDisplayContents?: boolean;
};

export function ItemList<TItem>({ className, items, renderItem, includeDisplayContents }: ItemListProps<TItem>) {
    return (
        <ul className={className}>
            {items.map((item, index) => (
                <li key={index} className={includeDisplayContents ? 'contents' : undefined}>
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    );
}
