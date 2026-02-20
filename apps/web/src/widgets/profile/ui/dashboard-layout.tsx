'use client';

import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/shared/ui/sonner';
import { AppSidebar } from '@/widgets/profile/ui/app-sidebar';
import { type ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="mx-auto max-w-7xl px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster />
        </AuthProvider>
    );
}
