import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
    src: '../../public/fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: '../../public/fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Blog Posts',
    description: 'A website for adding, editing, and deleting blog posts.',
    icons: [
        { url: '/icons/favicon.ico', rel: 'icon' },
        { url: '/icons/apple-touch-icon.png', sizes: '180x180', rel: 'apple-touch-icon' },
        { url: '/icons/favicon-32x32.png', sizes: '32x32', rel: 'icon', type: 'image/png' },
        { url: '/icons/favicon-16x16.png', sizes: '16x16', rel: 'icon', type: 'image/png' },
    ],
    manifest: '/site.webmanifest',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    );
}
