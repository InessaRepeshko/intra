'use client';

import { AuthProvider } from '@entities/identity/user/model/auth-context';
import { AppSidebar, SidebarProvider } from '@shared/ui/app-sidebar';
import { type ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <div className="flex h-screen overflow-hidden">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto bg-sidebar-light">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </AuthProvider>
    );
}
