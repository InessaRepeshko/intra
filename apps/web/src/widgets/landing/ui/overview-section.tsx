import {
    RotateCcw,
    Shield,
    BarChart3,
    Users,
    BookOpen,
    Building2,
} from "lucide-react"

const features = [
    {
        icon: RotateCcw,
        title: "360° Feedback Cycles",
        description:
            "Create structured review cycles with defined timelines. Collect multi-directional feedback from peers, managers, subordinates, and self-assessments.",
    },
    {
        icon: Shield,
        title: "Role-Based Access",
        description:
            "Four distinct roles - Admin, HR, Manager, and Employee - each with tailored permissions and views. Secure Google OAuth2 authentication.",
    },
    {
        icon: BarChart3,
        title: "Reporting & Analytics",
        description:
            "Auto-generated reports with aggregated scores, competence breakdowns, self vs. others comparisons, and anonymised text feedback.",
    },
    {
        icon: Users,
        title: "Team Management",
        description:
            "Model your org structure with teams, positions, and hierarchy. Automatically determine reporting lines for accurate feedback routing.",
    },
    {
        icon: BookOpen,
        title: "Competence Library",
        description:
            "Build a flexible library of skills, competence clusters, and question templates. Tailor evaluations to specific positions and roles.",
    },
    {
        icon: Building2,
        title: "Organization Structure",
        description:
            "Define positions with hierarchical relationships. Map superior-subordinate trees to streamline review assignment and data collection.",
    },
]

export function OverviewSection() {
    return (
        <section id="overview" className="relative px-6 py-32">
            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-bl from-pink-200/20 to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-yellow-200/20 to-transparent blur-3xl" />
            </div>

            {/* Top divider */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="relative mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-16 max-w-2xl">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Overview
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                        Everything you need for structured feedback
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
                        A complete toolkit for HR teams, managers, and employees to run
                        transparent and impactful 360-degree performance reviews.
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        const isEven = idx % 2 === 0
                        return (
                            <div
                                key={feature.title}
                                className="group relative flex flex-col gap-4 rounded-2xl border border-border/40 bg-gradient-to-br from-white/60 to-white/30 p-8 transition-all hover:border-border/80 hover:shadow-xl overflow-hidden"
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${isEven
                                    ? 'from-pink-50/0 to-yellow-50/0 group-hover:from-pink-50/50 group-hover:to-yellow-50/40'
                                    : 'from-yellow-50/0 to-pink-50/0 group-hover:from-yellow-50/50 group-hover:to-pink-50/40'
                                    } transition-all pointer-events-none`} />

                                <div className="relative">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${isEven ? 'from-pink-100 to-yellow-100 group-hover:from-pink-200 group-hover:to-yellow-200' : 'from-yellow-100 to-pink-100 group-hover:from-yellow-200 group-hover:to-pink-200'
                                        } transition-all`}>
                                        <Icon className={`h-6 w-6 ${isEven ? 'text-pink-600' : 'text-amber-600'}`} />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
