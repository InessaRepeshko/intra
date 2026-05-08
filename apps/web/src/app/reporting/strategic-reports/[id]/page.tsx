'use client';

import { DownloadStrategicReportPdfButton } from '@features/reporting/strategic-report/download-pdf/ui/download-strategic-report-pdf-button';
import { parseParamToPositiveNumber } from '@shared/lib/utils/parse-param-to-positive-number';
import { PageHeader } from '@shared/ui/app-sidebar';
import { StrategicReportPage } from '@widgets/reporting/strategic-report/page/strategic-report-page';
import { notFound } from 'next/navigation';
import { use, useRef } from 'react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function StrategicReportByIdPage({ params }: PageProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const unwrappedParams = use(params);
    const reportId = parseParamToPositiveNumber(unwrappedParams.id);
    if (!reportId) {
        return notFound();
    }

    return (
        <div
            ref={printRef}
            className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background"
        >
            <PageHeader
                title={`Strategic Report #${reportId}`}
                actions={
                    <DownloadStrategicReportPdfButton
                        contentRef={printRef}
                        reportId={reportId}
                        printWidth={1400}
                    />
                }
            />
            <div
                data-print-root
                className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10"
            >
                <StrategicReportPage reportId={reportId} />
            </div>
        </div>
    );
}
