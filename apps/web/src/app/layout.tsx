import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import { ConditionalMainLayout } from '@widgets/layout/conditional-main-layout';
import './globals.css';
import { QueryProvider } from './providers/query-provider';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Intra 360° Feedback Platform',
    description:
        'Manage and monitor 360° feedback cycles across your organization',
    keywords: [
        '360 feedback',
        'performance review',
        'employee feedback',
        'HR platform',
        'people analytics',
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <QueryProvider>
                    <ConditionalMainLayout>{children}</ConditionalMainLayout>
                    <Toaster richColors position="top-right" />
                </QueryProvider>
            </body>
        </html>
    );
}
