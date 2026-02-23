'use client';

import logo from '@public/logo.png';
import { Button } from '@shared/components/ui/button';
import { GoogleIcon } from '@shared/ui/google-icon';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Problem & Solution', href: '#problem-solution' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Key Features', href: '#key-features' },
    { label: 'Security', href: '#security' },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-border/50 bg-background/80 backdrop-blur-xl'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group transition-opacity hover:opacity-80"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                        <img src={logo.src} alt="Intra" className="h-7 w-7" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">
                        Intra
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex">
                    <Button
                        size="sm"
                        className="gap-2 rounded-full px-5"
                        asChild
                    >
                        <Link href="/signin">
                            <GoogleIcon />
                            Sign in with Google
                        </Link>
                    </Button>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
                    <nav className="flex flex-col gap-1 px-6 py-4">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                onClick={() => setMobileOpen(false)}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3">
                            <Button size="sm" className="gap-2" asChild>
                                <Link href="/signin">
                                    <GoogleIcon />
                                    Sign in with Google
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
