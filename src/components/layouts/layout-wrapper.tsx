import { PropsWithChildren } from 'react';

export function LayoutWrapper({ children }: PropsWithChildren) {
    return (
        <div role="presentation" className="container grid min-h-[100dvh] grid-rows-[auto_1fr_auto] bg-white">
            {children}
        </div>
    );
}
