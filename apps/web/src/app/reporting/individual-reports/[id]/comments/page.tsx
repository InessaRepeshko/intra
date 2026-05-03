'use client';

import { ProcessReportCommentsForm } from '@features/reporting/individual-report-comment/process-survey-answers/ui/ProcessReportCommentsForm';
import { parseParamToPositiveNumber } from '@shared/lib/utils/parse-param-to-positive-number';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProcessReportCommentsPage({ params }: PageProps) {
    const unwrappedParams = use(params);
    const reportId = parseParamToPositiveNumber(unwrappedParams.id);
    if (!reportId) {
        return notFound();
    }

    return <ProcessReportCommentsForm reportId={reportId} />;
}
