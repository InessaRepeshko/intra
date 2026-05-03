'use client';

import { useMeQuery } from '@entities/identity/user/api/user.queries';
import {
    IdentityRole,
    type AuthContextType,
    type AuthUser,
} from '@entities/identity/user/model/types';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, type ReactNode } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { data: user, isLoading, isError } = useMeQuery();

    useEffect(() => {
        if (isError) {
            router.push('/signin');
        }
    }, [isError, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-sm text-muted-foreground animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return null;
    }

    const hasRole = (...roles: IdentityRole[]) =>
        roles.some((role) => user.roles.includes(role));

    const value: AuthContextType = {
        user: user as AuthUser,
        hasRole,
        isAdmin: hasRole(IdentityRole.ADMIN),
        isHR: hasRole(IdentityRole.HR),
        isManager: hasRole(IdentityRole.MANAGER),
        isEmployee: hasRole(IdentityRole.EMPLOYEE),
    };

    return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
