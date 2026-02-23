"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";

interface ErrorPageLayoutProps {
    code: string;
    title: string;
    description: string | string[];
    icon?: React.ElementType;
    retryAction?: {
        label: string;
        onClick: () => void;
    };
    primaryActionText?: string;
    primaryActionHref?: string;
}

export function ErrorPageLayout({
    code,
    title,
    description,
    icon: Icon,
    retryAction,
    primaryActionText = "Go to Dashboard",
    primaryActionHref = "/dashboard",
}: ErrorPageLayoutProps) {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            setCanGoBack(true);
        }
    }, []);

    const handleBack = () => {
        if (canGoBack) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            {/* Error content */}
            <div className="flex flex-col items-center text-center max-w-md">
                {Icon && (
                    <div className="mb-6">
                        <Icon className="h-24 w-24 text-neutral-300" />
                    </div>
                )}

                <p className="text-2xl font-bold tracking-tighter text-primary/20">
                    {code}
                </p>

                <h1 className="mt-3 text-2xl font-semibold text-foreground text-balance">
                    {title}
                </h1>

                <div className={`mt-3 text-base leading-relaxed text-muted-foreground text-pretty ${Array.isArray(description) ? "space-y-1" : ""}`}>
                    {Array.isArray(description) ? (
                        description.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))
                    ) : (
                        <p>{description}</p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    {primaryActionHref ? (
                        <Button asChild size="lg" className="gap-2">
                            <Link href={primaryActionHref}>
                                <span className="relative flex h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                                    <span className="relative inline-flex h-4 w-4 rounded-full bg-white/100" />
                                </span>
                                {primaryActionText || (canGoBack ? "Go Back" : "Go to Home Page")}
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={handleBack}
                            className="gap-2"
                        >
                            <span className="relative flex h-4 w-4">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-white/100" />
                            </span>
                            {primaryActionText || (canGoBack ? "Go Back" : "Go to Home Page")}
                        </Button>
                    )}

                    {retryAction && (
                        <Button variant="secondary" size="lg" onClick={retryAction.onClick}>
                            {retryAction.label}
                        </Button>
                    )}

                    {canGoBack && (
                        <Button asChild size="lg" className="gap-2" variant="outline">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Go to Home
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
