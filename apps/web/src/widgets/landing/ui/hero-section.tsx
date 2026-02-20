import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section
            id="hero"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32"
        >
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-foreground/[0.04] to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Badge */}
            <div className="relative mb-8 inline-flex items-center gap-4 rounded-full border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 px-8 py-3 text-xl text-muted-foreground backdrop-blur-sm">
                <span className="bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                    360° Feedback Platform
                </span>
            </div>

            {/* Heading */}
            <h1 className="relative max-w-4xl text-center text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl text-balance">
                {' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                    The complete
                </span>
                <br />{' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground bg-clip-text text-transparent">
                    platform for
                </span>
                <br />{' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/60 to-foreground bg-clip-text text-transparent">
                    people growth
                </span>
            </h1>

            {/* Subheading */}
            <p className="relative mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
                Run structured 360-degree performance reviews with role-based
                access, competence libraries, and actionable analytics that
                drive real growth.
            </p>

            {/* CTAs */}
            <div className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <Button
                    size="lg"
                    className="gap-2 rounded-full px-8 text-base"
                    asChild
                >
                    <Link href="/auth/login">
                        <span className="relative flex h-4 w-4">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-white/100" />
                        </span>
                        Get Started Free
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 text-base"
                    asChild
                >
                    <Link href="#how-it-works">See How It Works</Link>
                </Button>
            </div>

            {/* 
            Highlight section
            <div className="relative mt-32 w-full max-w-3xl">
                <div className="relative rounded-3xl border border-border/30 bg-gradient-to-br from-pink-50/40 to-yellow-50/40 p-8 backdrop-blur-sm md:p-12">
                    <div className="absolute -top-3 -left-3 h-20 w-20 rounded-full bg-gradient-to-br from-pink-300 to-yellow-300 blur-3xl opacity-20" />
                    <div className="absolute -bottom-3 -right-3 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 blur-3xl opacity-20" />

                    <div className="relative">
                        <h3 className="text-center text-xl md:text-2xl font-semibold text-foreground mb-4">
                            Why choose Intra?
                        </h3>
                        <ul className="grid gap-3 sm:grid-cols-2">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">Automated workflows save time</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">100% anonymous feedback</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">Real-time progress tracking</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">Enterprise-grade security</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> 
            */}
        </section>
    );
}
