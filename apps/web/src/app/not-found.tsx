"use client";

import { FileQuestionMark } from "lucide-react";
import { ErrorPageLayout } from "@/shared/ui/error-page-layout";

export default function NotFoundPage() {
    return (
        <ErrorPageLayout
            code="404"
            title="Page not found"
            description="The page you are looking for does not exist."
            icon={FileQuestionMark}
        />
    );
}
