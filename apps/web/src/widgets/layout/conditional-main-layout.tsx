'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from './main-layout';

export function ConditionalMainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isPublicRoute =
        pathname === '/' ||
        pathname.startsWith('/signin') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/google') ||
        pathname.startsWith('/signout');

    if (isPublicRoute) {
        return <>{children}</>;
    }

    return <MainLayout>{children}</MainLayout>;
}
