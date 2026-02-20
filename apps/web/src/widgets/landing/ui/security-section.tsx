import { Lock, Eye, ShieldCheck, Key } from "lucide-react"

const securityItems = [
    {
        icon: Lock,
        title: "Secure Sessions",
        description: "HTTP-only cookies with strict session management protect every interaction.",
    },
    {
        icon: Eye,
        title: "Anonymised Feedback",
        description: "Text responses are aggregated and anonymised to protect respondent identity.",
    },
    {
        icon: ShieldCheck,
        title: "Guard-Protected API",
        description: "AuthSession and Roles guards enforce authentication and authorization on every endpoint.",
    },
    {
        icon: Key,
        title: "Google OAuth2",
        description: "Enterprise-grade authentication via Google workspace. No passwords to manage.",
    },
]

export function SecuritySection() {
    return (
        <section id="security" className="relative px-6 py-32">
            {/* Top divider */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="mx-auto max-w-6xl">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                    {/* Text column */}
                    <div>
                        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                            Security
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                            Enterprise-grade security, built in
                        </h2>
                        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
                            Your people data is sensitive. Intra is built with security at
                            every layer - from authentication to data anonymisation.
                        </p>
                    </div>

                    {/* Cards column */}
                    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 bg-gradient-to-br from-white/60 to-white/30 transition-all overflow-hidden">
                        {securityItems.map((item, idx) => {
                            const isEven = idx % 2 === 0
                            const Icon = item.icon
                            return (
                                <div
                                    key={item.title}
                                    className={`flex flex-col gap-3 bg-card p-6 transition-colors bg-gradient-to-br from-pink-50/0 to-yellow-50/0 hover:from-pink-50/50 hover:to-yellow-50/40 hover:shadow-xl `}
                                >
                                    <Icon className={`h-5 w-5 ${isEven ? 'text-pink-600' : 'text-amber-600'}`} />
                                    <h3 className="text-sm font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
