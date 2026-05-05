'use client';

import { useAuth } from '@entities/identity/user/model/auth-context';
import { ProcessReportCommentsForm } from '@features/reporting/individual-report-comment/process-survey-answers/ui/ProcessReportCommentsForm';
import { parseParamToPositiveNumber } from '@shared/lib/utils/parse-param-to-positive-number';
import { forbidden, notFound, unauthorized } from 'next/navigation';
import { use } from 'react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProcessReportCommentsPage({ params }: PageProps) {
    const auth = useAuth();

    if (!auth.user) return unauthorized();

    if (!auth.isAdmin && !auth.isHR) return forbidden();

    const unwrappedParams = use(params);
    const reportId = parseParamToPositiveNumber(unwrappedParams.id);
    if (!reportId) {
        return notFound();
    }

    return <ProcessReportCommentsForm reportId={reportId} />;
}
