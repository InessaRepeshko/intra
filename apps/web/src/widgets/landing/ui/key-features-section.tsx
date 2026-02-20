import { BarChart3, Shield, TrendingUp, Zap } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Customizable Surveys',
        description:
            'Design flexible feedback forms tailored to different roles and competencies within your organization.',
    },
    {
        icon: Shield,
        title: 'Complete Anonymity',
        description:
            'Protect respondent privacy with full anonymization settings, ensuring honest and unbiased feedback.',
    },
    {
        icon: TrendingUp,
        title: 'Real-time Progress Tracking',
        description:
            "Monitor survey completion rates instantly and identify who's completed their feedback at a glance.",
    },
    {
        icon: BarChart3,
        title: 'Visual Analytics',
        description:
            'Analyze feedback with interactive spider charts, bar charts, and skill comparisons for deeper insights.',
    },
];

export function KeyFeaturesSection() {
    return (
        <section id="key-features" className="relative px-6 py-32">
            {/* Top divider */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-gradient-to-bl from-pink-200/20 to-transparent blur-3xl" />
                <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-yellow-200/20 to-transparent blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-16 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Key Features
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                        Turn Raw Feedback into Actionable Strategy
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                        Everything you need to run comprehensive 360-degree
                        feedback cycles with confidence.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid gap-6 sm:grid-cols-2">
                    {features.map((f, index) => {
                        const Icon = f.icon;
                        const isEven = index % 2 === 0;
                        return (
                            <div
                                key={f.title}
                                className="group relative flex flex-col rounded-2xl border border-border/40 bg-gradient-to-br from-white/50 to-white/30 p-8 transition-all hover:border-border/80 hover:shadow-lg"
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-50/0 to-yellow-50/0 group-hover:from-pink-50/40 group-hover:to-yellow-50/40 transition-all" />

                                <div className="relative">
                                    <div
                                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${isEven ? 'bg-gradient-to-br' : 'bg-gradient-to-tl'} from-pink-100 to-yellow-100 group-hover:from-pink-200 group-hover:to-yellow-200 transition-all`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${isEven ? 'text-pink-600' : 'text-amber-600'}`}
                                        />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                                        {f.title}
                                    </h3>
                                    <p className="text-base leading-relaxed text-muted-foreground">
                                        {f.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
