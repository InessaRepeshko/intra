const steps = [
    {
        number: "1",
        title: "Set Up Your Organization",
        description:
            "Define your teams, positions, and hierarchy. Import users via Google workspace or create them manually. Assign roles to control access.",
    },
    {
        number: "2",
        title: "Create a Review Cycle",
        description:
            "HR creates a feedback cycle with start and end dates. Attach competence-based questions and invite reviewers - peers, managers, and subordinates.",
    },
    {
        number: "3",
        title: "Collect 360° Feedback",
        description:
            "Participants submit anonymised ratings and text feedback through an intuitive interface. Track response rates in real time.",
    },
    {
        number: "4",
        title: "Analyse & Act",
        description:
            "Auto-generated reports surface competence scores, self-vs-others comparisons, and anonymised comments. Drive data-informed growth conversations.",
    },
]

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative px-6 py-32">
            {/* Top divider */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-16 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        How it works
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                        Your Journey to Better Insights
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                        From setup to actionable insights in four clear steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, idx) => {
                        const isEven = idx % 2 === 0
                        return (
                            <div key={step.number} className="group relative flex flex-col">
                                {/* Connector line - visible on lg */}
                                {idx < steps.length - 1 && (
                                    <div className="pointer-events-none absolute right-0 top-8 hidden h-px w-8 translate-x-full bg-border lg:block" />
                                )}

                                {/* Number */}
                                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-2xl font-bold transition-colors
                                bg-gradient-to-br ${isEven 
                                    ? 'from-pink-100 to-yellow-100 group-hover:from-pink-200 group-hover:to-yellow-200 text-pink-600' 
                                    : 'from-yellow-100 to-pink-100 group-hover:from-yellow-200 group-hover:to-pink-200 text-amber-600'
                                    }`}>
                                    {step.number}
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
