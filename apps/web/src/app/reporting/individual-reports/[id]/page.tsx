'use client';

import { parseParamToPositiveNumber } from '@shared/lib/utils/parse-param-to-positive-number';
import { PageHeader } from '@shared/ui/app-sidebar';
import { IndividualReportPage } from '@widgets/reporting/individual-report/page/individual-report-page';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function IndividualReportByIdPage({ params }: PageProps) {
    const unwrappedParams = use(params);
    const reportId = parseParamToPositiveNumber(unwrappedParams.id);
    if (!reportId) {
        return notFound();
    }

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title={`Individual Report #${reportId}`} />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <IndividualReportPage reportId={reportId} />
            </div>
        </div>
    );
}
