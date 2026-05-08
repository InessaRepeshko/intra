'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { ReportsList } from '@widgets/reporting/report/list/report-list';

export default function ReportsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Reports" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <ReportsList />
            </div>
        </div>
    );
}
