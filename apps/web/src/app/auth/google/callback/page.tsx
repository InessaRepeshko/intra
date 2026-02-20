'use client';

import { handleGoogleCallback } from '@entities/identity/user/api/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');

    useEffect(() => {
        const params = searchParams?.toString();
        if (!params) {
            setError('Missing authentication parameters.');
            return;
        }

        handleGoogleCallback('?' + params)
            .then(() => {
                // Cookie is set by the backend, redirect to dashboard
                router.push('/profile');
            })
            .catch((err: any) => {
                console.error('Google callback failed:', err);
                setError(
                    err.response?.data?.message ||
                        'Authentication failed. Please try again.',
                );
            });
    }, []);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-sm text-center">
                    <div className="mb-4 text-destructive text-sm font-medium">
                        {error}
                    </div>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="text-sm text-muted-foreground underline hover:text-foreground"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                    I
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                    Completing sign in...
                </p>
            </div>
        </div>
    );
}

// Suspense is required because useSearchParams() needs it
export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Loading...
                    </p>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
