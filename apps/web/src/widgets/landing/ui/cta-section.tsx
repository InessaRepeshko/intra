import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export function CtaSection() {
    return (
        <section className="relative px-6 py-32">
            {/* Top divider */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="mx-auto max-w-4xl text-center">
                {/* Glow background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute bottom-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-t from-foreground/[0.03] to-transparent blur-3xl" />
                </div>

                <h2 className="relative text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                    Start building a feedback culture today
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                    Sign in with your Google workspace account and launch your
                    first 360-degree review cycle in minutes.
                </p>
                <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="gap-2 rounded-full px-8 text-base"
                        asChild
                    >
                        <Link href="/auth/google">
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
                        <Link href="#overview">Explore Overview</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
