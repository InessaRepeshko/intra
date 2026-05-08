import { CtaSection } from '@widgets/landing/ui/cta-section';
import { Footer } from '@widgets/landing/ui/footer';
import { Header } from '@widgets/landing/ui/header';
import { HeroSection } from '@widgets/landing/ui/hero-section';
import { HowItWorksSection } from '@widgets/landing/ui/how-it-works-section';
import { KeyFeaturesSection } from '@widgets/landing/ui/key-features-section';
import { OverviewSection } from '@widgets/landing/ui/overview-section';
import { ProblemSolutionSection } from '@widgets/landing/ui/problem-solution-section';
import { SecuritySection } from '@widgets/landing/ui/security-section';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <HeroSection />
                <OverviewSection />
                <HowItWorksSection />
                <KeyFeaturesSection />
                <ProblemSolutionSection />
                <SecuritySection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    );
}
