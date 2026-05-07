'use client';

import { devLogin, login } from '@entities/identity/user/api/auth.api';
import logo from '@public/logo.png';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Separator } from '@shared/components/ui/separator';
import { GoogleIcon } from '@shared/ui/google-icon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = () => {
        login();
    };

    const handleDevLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const auth = await devLogin(email);
            if (auth.session?.token) {
                localStorage.setItem('session_token', auth.session.token);
            }
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Dev Signin failed:', err);
            setError(
                err.response?.data?.message ||
                    'Failed to signin. Please ensure the email is correct.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Top left gradient blob */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                {/* Bottom right gradient blob */}
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                {/* Center subtle glow */}
                <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-2xl" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                                          linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 flex flex-col items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-3 transition-opacity hover:opacity-80"
                    >
                        <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                            <img
                                src={logo.src}
                                alt="Intra"
                                className="h-10.5 w-10.5"
                            />
                        </div>
                        <span className="text-4xl font-bold tracking-tight">
                            Intra
                        </span>
                    </Link>

                    {/* Badge */}
                    <div className="relative mt-4 mb-4 inline-flex items-center gap-4 ">
                        <span className="bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                            360° Feedback Service
                        </span>
                    </div>
                </div>

                {/* Login Card */}
                <Card className="border border-border/50 bg-background/80 shadow-2xl shadow-primary/5 backdrop-blur-xl">
                    <CardContent className="p-8">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Sign In
                            </h1>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Access your workspace and connect with your team
                            </p>
                        </div>

                        {/* Google Sign In */}
                        <Button
                            className="group relative w-full gap-2 rounded-full px-5"
                            size="lg"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            <span className="font-medium">
                                Continue with Google
                            </span>
                        </Button>

                        {/* Divider */}
                        <div className="my-10 flex items-center gap-4">
                            <Separator className="flex-1" />
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                or
                            </span>
                            <Separator className="flex-1" />
                        </div>

                        {/* Dev Login Form */}
                        <form
                            onSubmit={handleDevLogin}
                            className="flex flex-col gap-4"
                        >
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                                    <svg
                                        className="h-4 w-4 shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2 flex flex-col items-center justify-center">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-center"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="text-center h-11 border-border/60 rounded-xl bg-background transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full font-medium transition-all rounded-full px-5"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Help Text */}
                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            Need help? Contact your{' '}
                            <span>IT administrator</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Legal Footer */}
                <p className="mt-8 text-center text-xs text-muted-foreground/80">
                    By signing in, you agree to our{' '}
                    <a
                        href="#"
                        className="underline underline-offset-2 hover:text-foreground"
                    >
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                        href="#"
                        className="underline underline-offset-2 hover:text-foreground"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
}
