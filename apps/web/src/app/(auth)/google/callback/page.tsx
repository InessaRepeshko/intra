'use client';

import { handleGoogleCallback } from '@entities/identity/user/api/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AuthCallbackContent() {
    console.log('Current API URL:', process.env.NEXT_PUBLIC_API_URL);
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
            .then((auth) => {
                if (auth.session?.token) {
                    localStorage.setItem('session_token', auth.session.token);
                }
                router.push('/dashboard');
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
                        onClick={() => router.push('/signin')}
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
            <p className="text-sm text-muted-foreground animate-pulse">
                Completing sign in...
            </p>
        </div>
    );
}

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
