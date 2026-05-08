export function ProblemSolutionSection() {
    return (
        <section id="problem-solution" className="relative px-6 py-32">
            {/* Top divider */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-pink-200/20 to-transparent blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-gradient-to-bl from-yellow-200/20 to-transparent blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-16 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Problem & Solution
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                        Modernizing the Feedback Experience
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                        Ditch the spreadsheets and embrace automated, anonymous,
                        and actionable 360° reviews.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Problem side */}
                    <div className="flex flex-col justify-center">
                        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                            The Challenge
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6 text-balance">
                            The traditional way is broken
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
                                        ✗
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">
                                        Spreadsheet Chaos
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Manual survey collection in Excel
                                        creates silos, version conflicts, and
                                        lost responses.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
                                        ✗
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">
                                        Subjective Results
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Without anonymity, feedback becomes
                                        politically motivated and loses
                                        credibility.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
                                        ✗
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">
                                        Delayed Insights
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Processing and analyzing results
                                        manually takes weeks, and actionable
                                        insights come too late.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solution side */}
                    <div className="flex flex-col justify-center">
                        <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-white/60 to-white/30 p-8 transition-all hover:border-border/80 hover:shadow-xl overflow-hidden hover:from-pink-50/50 hover:to-yellow-50/40">
                            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                                The Solution
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6 text-balance">
                                Intra transforms feedback
                            </h2>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-yellow-200 text-white font-semibold text-sm">
                                            ✓
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">
                                            Automatic Workflows
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Set deadlines and reminders once.
                                            Intra handles distribution,
                                            collection, and aggregation
                                            automatically.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-yellow-200 text-white font-semibold text-sm">
                                            ✓
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">
                                            100% Anonymous
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Complete anonymization ensures
                                            honest feedback without fear of
                                            repercussions or bias.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-yellow-200 text-white font-semibold text-sm">
                                            ✓
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">
                                            Instant Insights
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Visual reports and analytics are
                                            ready immediately, so you can act on
                                            feedback right away.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
