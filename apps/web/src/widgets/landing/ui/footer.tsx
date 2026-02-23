import logo from '@public/logo.png';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-border px-6 py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
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

                {/* Links */}
                <nav className="flex items-center gap-6">
                    <Link
                        href="#overview"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Overview
                    </Link>
                    <Link
                        href="#problem-solution"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Problem & Solution
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#key-features"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Key Features
                    </Link>
                    <Link
                        href="#security"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Security
                    </Link>
                </nav>

                {/* Copyright */}
                <p className="text-sm text-muted-foreground">
                    {new Date().getFullYear()} Intra. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
