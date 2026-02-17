import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';
import { QueryProvider } from './providers/query-provider';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '360° Feedback Cycles | HR Admin',
    description:
        'Manage and monitor 360° feedback cycles across your organization',
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
                    {children}
                    <Toaster richColors position="top-right" />
                </QueryProvider>
            </body>
        </html>
    );
}
